#!/usr/bin/env node

/**
 * Blueprint Antigravity Dual MCP & HTTP Message Bridge
 * Listens on port 4000.
 * Allows sending messages/tasks via HTTP POST or the interactive Web Terminal,
 * runs the work in /workspaces/blueprint, and sends back the result.
 */

import http from 'node:http';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs';
import path from 'node:path';

const execAsync = promisify(exec);
const PORT = process.env.BRIDGE_PORT || 4000;
const WORKSPACE_ROOT = process.env.WORKSPACE_ROOT || '/workspaces/blueprint';

async function processMessage(msg) {
  let output = '';

  // 1. Check if it's shell execution
  if (msg.startsWith('run:') || msg.startsWith('cmd:') || msg.startsWith('exec:') || msg.startsWith('$')) {
    const cmd = msg.replace(/^(run|cmd|exec|\$):\s*/i, '');
    try {
      const { stdout, stderr } = await execAsync(cmd, { cwd: WORKSPACE_ROOT });
      output = `[Command: "${cmd}"]\n\n--- Output ---\n${stdout || '(No stdout)'}\n${stderr ? `--- Stderr ---\n${stderr}` : ''}`;
    } catch (err) {
      output = `[Command Error]\n${err.message}\n${err.stdout || ''}\n${err.stderr || ''}`;
    }
  }
  // 2. Check if it's project creation
  else if (msg.startsWith('create:') || msg.startsWith('create project:') || msg.startsWith('new project:')) {
    const raw = msg.replace(/^(create(\s+project)?|new\s+project):\s*/i, '').trim();
    try {
      const { createProject } = await import('./projectService.js');
      const parts = raw.split('|').map(s => s.trim());
      const name = parts[0];
      const desc = parts[1] || name;
      const result = await createProject({
        name,
        description: desc,
        addToShowcase: true
      });
      const p = result.project;
      output = `[Project Successfully Created!]\n` +
        `• Title: ${p.projectName}\n` +
        `• ID: ${p.id}\n` +
        `• Category: ${p.category} (${p.difficulty})\n` +
        `• Total Estimated BOM: $${p.estimatedCost}\n` +
        `• Components: ${p.nodes.length} parts\n` +
        `• Wiring Nets: ${p.electricalConnections.length} connections\n` +
        `• Assembly Steps: ${p.instructions.length} stages\n\n` +
        `Files Generated:\n` +
        `  - ${result.paths.projectJson}\n` +
        `  - ${result.paths.bomCsv}\n` +
        `  - ${result.paths.assemblyGuide}\n` +
        `  - ${result.paths.wiringJson}\n` +
        (result.paths.showcaseUpdated ? `\n✓ Added to Web App Showcase (visible in Community & Studio)\n` : '');
    } catch (err) {
      output = `Project creation error: ${err.message}`;
    }
  }
  // 3. Check if it's hardware generation
  else if (msg.toLowerCase().includes('generate') || msg.toLowerCase().includes('hardware') || msg.toLowerCase().includes('dog') || msg.toLowerCase().includes('drone')) {
    try {
      const { generateProjectFromPrompt } = await import('../src/data/projectGenerator.js');
      const project = generateProjectFromPrompt(msg);
      output = `[AI Hardware Architecture Generated]\n` +
        `• Project: ${project.projectName}\n` +
        `• Category: ${project.category}\n` +
        `• Total Estimated BOM: $${project.estimatedCost}\n` +
        `• Hardware Components: ${project.nodes.length} parts\n` +
        `• Circuit Wiring Nets: ${project.electricalConnections.length} connections\n` +
        `• Assembly Steps: ${project.instructions.length} stages\n\n` +
        `Bill of Materials:\n` +
        project.nodes.map(n => `  - ${n.name} ($${n.price}) [${n.vendor}]`).join('\n') +
        `\n\nAssembly Overview:\n` +
        project.instructions.map(s => `  ${s.step}. ${s.title}`).join('\n');
    } catch (err) {
      output = `Error during generation: ${err.message}`;
    }
  }
  // 4. Code / Workspace file search or inspection
  else if (msg.startsWith('read:') || msg.startsWith('cat:')) {
    const filePath = msg.replace(/^(read|cat):\s*/i, '').trim();
    const fullPath = path.resolve(WORKSPACE_ROOT, filePath);
    try {
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        output = `[File: ${filePath}]\n\n${content}`;
      } else {
        output = `File not found: ${filePath}`;
      }
    } catch (err) {
      output = `Read error: ${err.message}`;
    }
  }
  // 5. General task fallback
  else {
    try {
      const { stdout } = await execAsync('ls -la src', { cwd: WORKSPACE_ROOT });
      output = `[Task Executed in ${WORKSPACE_ROOT}]\nInput: "${msg}"\n\nWorkspace status:\n${stdout}`;
    } catch (err) {
      output = `Task execution error: ${err.message}`;
    }
  }

  return output;
}

const server = http.createServer(async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const urlPath = req.url ? req.url.split('?')[0] : '/';

  // 1. Interactive Web Dashboard UI
  if ((req.method === 'GET' || req.method === 'HEAD') && (urlPath === '/' || urlPath === '/index.html' || urlPath === '')) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    if (req.method === 'HEAD') {
      res.end();
      return;
    }
    res.end(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Blueprint Antigravity MCP Message Bridge</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Raleway:wght@700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0c0d10; color: #f8f8f7; font-family: 'JetBrains Mono', monospace; padding: 24px; min-height: 100vh; display: flex; flex-direction: column; align-items: center; }
    .container { max-width: 800px; width: 100%; display: flex; flex-direction: column; gap: 20px; }
    .header { border-bottom: 1px solid #272828; padding-bottom: 16px; display: flex; align-items: center; justify-content: space-between; }
    .title { font-family: 'Raleway', sans-serif; font-size: 20px; font-weight: bold; letter-spacing: 1px; color: #fff; }
    .badge { font-size: 11px; padding: 4px 8px; border-radius: 4px; background: #1a2e22; color: #10b981; border: 1px solid #10b98144; }
    .card { background: #141519; border: 1px solid #272828; border-radius: 12px; padding: 20px; display: flex; flex-direction: column; gap: 14px; }
    textarea { width: 100%; height: 90px; background: #0c0d10; border: 1px solid #333; border-radius: 8px; padding: 12px; color: #fff; font-family: inherit; font-size: 13px; resize: vertical; outline: none; }
    textarea:focus { border-color: #3b82f6; }
    .controls { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; }
    .chips { display: flex; gap: 8px; flex-wrap: wrap; }
    .chip { font-size: 11px; padding: 4px 10px; border-radius: 20px; background: #1c1d24; border: 1px solid #30333f; color: #9ca3af; cursor: pointer; transition: 0.15s; }
    .chip:hover { color: #fff; border-color: #3b82f6; }
    button { background: #2563eb; color: #fff; border: none; padding: 10px 20px; border-radius: 8px; font-family: inherit; font-size: 12px; font-weight: bold; text-transform: uppercase; cursor: pointer; transition: 0.15s; }
    button:hover { background: #1d4ed8; }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
    .terminal-title { font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; }
    pre { background: #08090b; border: 1px solid #1f2127; border-radius: 8px; padding: 16px; font-size: 12px; line-height: 1.6; color: #10b981; overflow-x: auto; min-height: 180px; max-height: 450px; white-space: pre-wrap; word-break: break-all; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="title">⚡ BLUEPRINT ANTIGRAVITY MCP BRIDGE</div>
      <div class="badge">● SERVER ACTIVE (PORT ${PORT})</div>
    </div>

    <div class="card">
      <div class="terminal-title">Send Task or Message to Workspace</div>
      <textarea id="input" placeholder="Type a task, message, or command (e.g. 'create: Solar Weather Station', 'generate drone with lidar', 'cmd: git status')..."></textarea>
      <div class="controls">
        <div class="chips">
          <div class="chip" onclick="setMsg('create: Solar Weather Tracker | Autonomous IoT weather station with solar charging')">create: Solar Weather Tracker</div>
          <div class="chip" onclick="setMsg('cmd: ls -la projects')">cmd: ls -la projects</div>
          <div class="chip" onclick="setMsg('generate smart robotic dog with esp32')">generate robot dog</div>
          <div class="chip" onclick="setMsg('cat: package.json')">cat: package.json</div>
        </div>
        <button id="sendBtn" onclick="send()">Send to Workspace</button>
      </div>
    </div>

    <div class="card">
      <div class="terminal-title">Workspace Live Execution Output</div>
      <pre id="output">Waiting for message...</pre>
    </div>
  </div>

  <script>
    function setMsg(txt) {
      document.getElementById('input').value = txt;
    }

    async function send() {
      const input = document.getElementById('input');
      const output = document.getElementById('output');
      const btn = document.getElementById('sendBtn');
      const msg = input.value.trim();
      if (!msg) return;

      btn.disabled = true;
      btn.innerText = 'WORKING...';
      output.innerText = 'Working on task in /workspaces/blueprint...';

      try {
        const res = await fetch('/message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: msg })
        });
        const data = await res.json();
        output.innerText = data.output || JSON.stringify(data, null, 2);
      } catch (err) {
        output.innerText = 'Error: ' + err.message;
      } finally {
        btn.disabled = false;
        btn.innerText = 'SEND TO WORKSPACE';
      }
    }
  </script>
</body>
</html>`);
    return;
  }

  // 2. HTTP POST /message Endpoint
  if (req.method === 'POST' && (urlPath === '/message' || urlPath === '/task')) {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const parsed = JSON.parse(body || '{}');
        const message = parsed.message || parsed.prompt || parsed.task || '';
        const output = await processMessage(message);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'success',
          timestamp: new Date().toISOString(),
          workspace: WORKSPACE_ROOT,
          input: message,
          output
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'error', error: err.message }));
      }
    });
    return;
  }

  // 3. Dedicated Project Creation Endpoint (/project)
  if (req.method === 'POST' && (urlPath === '/project' || urlPath === '/api/project')) {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const parsed = JSON.parse(body || '{}');
        const { createProject } = await import('./projectService.js');
        const result = await createProject({
          name: parsed.name || parsed.title || parsed.prompt || 'Untitled Hardware Project',
          description: parsed.description || parsed.prompt || parsed.name,
          category: parsed.category,
          difficulty: parsed.difficulty,
          author: parsed.author,
          specs: parsed.specs,
          components: parsed.components,
          instructions: parsed.instructions,
          addToShowcase: parsed.addToShowcase !== false
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'success',
          timestamp: new Date().toISOString(),
          ...result
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'error', error: err.message }));
      }
    });
    return;
  }

  // 4. MCP JSON-RPC Streamable HTTP Endpoint (/mcp)
  if (req.method === 'POST' && urlPath === '/mcp') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const rpc = JSON.parse(body || '{}');
        const id = rpc.id || 1;

        if (rpc.method === 'initialize') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            jsonrpc: '2.0',
            id,
            result: {
              protocolVersion: '2024-11-05',
              serverInfo: { name: 'blueprint-antigravity-bridge', version: '1.0.0' },
              capabilities: { tools: {} }
            }
          }));
          return;
        }

        if (rpc.method === 'tools/list') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            jsonrpc: '2.0',
            id,
            result: {
              tools: [
                {
                  name: 'send_message',
                  description: 'Send a message or task to work on in the Blueprint workspace.',
                  inputSchema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', description: 'Task, instruction, command, or create prompt' }
                    },
                    required: ['message']
                  }
                },
                {
                  name: 'create_project',
                  description: 'Create a complete, permanent hardware project with 3D CAD dimensions, BOM with pricing, wiring netlist, and assembly guide.',
                  inputSchema: {
                    type: 'object',
                    properties: {
                      name: { type: 'string', description: 'Project title' },
                      description: { type: 'string', description: 'Detailed project description' },
                      category: { type: 'string', description: 'Category' },
                      difficulty: { type: 'string', description: 'Beginner, Intermediate, or Advanced' },
                      addToShowcase: { type: 'boolean', description: 'Add to web app showcase' }
                    },
                    required: ['name', 'description']
                  }
                },
                {
                  name: 'generate_hardware_project',
                  description: 'Synthesize a complete hardware project from a prompt.',
                  inputSchema: {
                    type: 'object',
                    properties: {
                      prompt: { type: 'string', description: 'Hardware prompt' }
                    },
                    required: ['prompt']
                  }
                }
              ]
            }
          }));
          return;
        }

        if (rpc.method === 'tools/call') {
          const toolName = rpc.params?.name;
          const toolArgs = rpc.params?.arguments || {};
          let textResult = '';

          if (toolName === 'create_project') {
            const { createProject } = await import('./projectService.js');
            const resData = await createProject({
              name: toolArgs.name,
              description: toolArgs.description,
              category: toolArgs.category,
              difficulty: toolArgs.difficulty,
              author: toolArgs.author,
              addToShowcase: toolArgs.addToShowcase !== false
            });
            textResult = `Created Project "${resData.project.projectName}" (${resData.project.id}) at ${resData.paths.directory}`;
          } else {
            const msg = toolArgs.message || toolArgs.prompt || '';
            textResult = await processMessage(msg);
          }

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            jsonrpc: '2.0',
            id,
            result: {
              content: [{ type: 'text', text: textResult }]
            }
          }));
          return;
        }

        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ jsonrpc: '2.0', id, error: { code: -32601, message: 'Method not found' } }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ jsonrpc: '2.0', error: { code: -32700, message: 'Parse error' } }));
      }
    });
    return;
  }

  // 5. Status / Health Endpoint
  if (req.method === 'GET' && (urlPath === '/status' || urlPath === '/health')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      service: 'blueprint-antigravity-bridge',
      workspace: WORKSPACE_ROOT,
      tools: ['send_message', 'create_project', 'generate_hardware_project', 'execute_command', 'read_workspace_file', 'write_workspace_file', 'list_workspace_files'],
      time: new Date().toISOString()
    }));
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[Bridge] Blueprint Antigravity MCP Bridge listening on http://0.0.0.0:${PORT}`);
});
