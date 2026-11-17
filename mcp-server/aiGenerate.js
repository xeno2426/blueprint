// Real AI generation: asks Claude for a project JSON, validates it, retries once
// with the validator's complaints. Needs ANTHROPIC_API_KEY. Never invents the key
// path for the browser: the key stays on this server.
import { validateProject } from '../src/data/validateProject.js';

const MODEL = process.env.BLUEPRINT_MODEL || 'claude-sonnet-5-5';
const API_URL = 'https://api.anthropic.com/v1/messages';

const SYSTEM = `You are a hardware design assistant. Reply with ONE JSON object and nothing else (no markdown fences).
Schema:
{
 "projectName": string, "description": string, "category": string, "difficulty": "Beginner"|"Intermediate"|"Advanced",
 "buildTime": string, "targetMassG": number|null,
 "specs": { "mcu": string, "power": string, "connectivity": string, "sensors": string, "dimensions": string },
 "warnings": string[]   // honest risks: feasibility, weight, power, safety
 "nodes": [ { "id": "node-...", "name": string, "productName": string, "category": "electrical"|"3d_printed"|"raw_material",
   "type": string, "vendor": string, "vendor_sku": "", "price": number (USD estimate), "quantity": number, "weightG": number,
   "priceEstimate": true, "pins": [ {"name": string, "type": "power"|"ground"|"i2c"|"spi"|"uart"|"pwm"|"gpio", "signal": string} ] (electrical parts only),
   "dimensions": {"width": mm, "height": mm, "depth": mm} } ],
 "electricalConnections": [ {"id": string, "fromNode": id, "fromPin": pin name, "toNode": id, "toPin": pin name, "color": "#rrggbb", "label": string} ],
 "mechanicalConnections": [ {"parentNode": id, "childNode": id, "type": string, "count": number} ],
 "instructions": [ {"step": number, "title": string, "description": string, "tools": string[], "subSteps": string[]} ]
}
Rules: every wire must use pin names that exist on both nodes. Never invent SKUs or stock levels (leave vendor_sku empty).
Prices and masses are estimates. Respect the user's stated mass, size and budget; if the idea cannot meet them, say so in warnings.
Avoid ESP32 strapping/USB pins when assigning GPIOs. Use 5 to 14 nodes and 3 to 7 build steps.`;

async function callClaude(messages, signal) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({ model: MODEL, max_tokens: 8000, system: SYSTEM, messages }),
    signal
  });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`Anthropic API ${res.status}: ${t.slice(0, 200)}`);
  }
  const data = await res.json();
  return (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
}

export function parseJsonLoose(text) {
  const cleaned = String(text).replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start < 0 || end <= start) throw new Error('No JSON object in model reply');
  return JSON.parse(cleaned.slice(start, end + 1));
}

export async function generateWithAI({ prompt, project }) {
  if (!process.env.ANTHROPIC_API_KEY) {
    const e = new Error('ANTHROPIC_API_KEY is not set on the bridge server.');
    e.code = 'no_key';
    throw e;
  }
  const userText = project
    ? `Current project JSON:\n${JSON.stringify(project)}\n\nApply this change and return the FULL updated project JSON: ${prompt}`
    : `Design this hardware project: ${prompt}`;
  const signal = AbortSignal.timeout(120000);
  const messages = [{ role: 'user', content: userText }];

  let lastErrors = [];
  for (let attempt = 0; attempt < 2; attempt++) {
    const reply = await callClaude(messages, signal);
    try {
      const obj = parseJsonLoose(reply);
      const checked = validateProject(obj);
      if (checked.ok) {
        const out = checked.project;
        out.id = project?.id || 'proj-' + Math.random().toString(36).slice(2, 9);
        out.author = 'You'; out.authorAvatar = 'YO'; out.stars = project?.stars || 1;
        out.created_at = project?.created_at || new Date().toISOString();
        out.thumbnail = null; out.renderImage = null;
        out.aiGenerated = true;
        return out;
      }
      lastErrors = checked.errors;
    } catch (err) {
      lastErrors = [err.message];
    }
    messages.push({ role: 'assistant', content: reply });
    messages.push({ role: 'user', content: `That failed validation: ${lastErrors.slice(0, 8).join('; ')}. Return the corrected full JSON only.` });
  }
  throw new Error('Model output failed validation: ' + lastErrors.slice(0, 3).join('; '));
}
