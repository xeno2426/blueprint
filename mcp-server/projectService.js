import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateProjectFromPrompt } from '../src/data/projectGenerator.js';

const WORKSPACE_ROOT = path.resolve(process.env.WORKSPACE_ROOT || path.join(path.dirname(fileURLToPath(import.meta.url)), '..'));

/**
 * Creates a new hardware project, generates all architecture artifacts,
 * saves to projects/<slug>/, updates lastGenerated.json, and optionally
 * adds it to the Web Application showcase in sampleProjects.js.
 */
export async function createProject({
  name,
  description,
  prompt,
  category,
  difficulty = 'Intermediate',
  author = 'Antigravity Engineer',
  specs = {},
  components = null,
  instructions = null,
  addToShowcase = true
}) {
  const projectTitle = name || prompt || 'Untitled Hardware Project';
  const projectDescription = description || prompt || projectTitle;
  
  // 1. Synthesize baseline hardware architecture
  const baseSynthesis = generateProjectFromPrompt(projectDescription);
  
  // 2. Generate unique slug and ID
  const slug = projectTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || `proj-${Date.now()}`;
  const projectId = `proj-${slug}-${Date.now().toString(36).slice(-4)}`;

  // 3. Assemble complete project object
  const nodes = (Array.isArray(components) && components.length > 0)
    ? components.map((c, i) => ({
        id: c.id || `node-${i + 1}`,
        name: c.name || `Component ${i + 1}`,
        productName: c.productName || c.name,
        category: c.category || 'electrical',
        type: c.type || 'module',
        vendor: c.vendor || 'DigiKey',
        vendor_sku: c.vendor_sku || `SKU-${i + 1}`,
        price: typeof c.price === 'number' ? c.price : 12.00,
        quantity: c.quantity || 1,
        inStock: c.inStock !== false,
        stockCount: c.stockCount || 500,
        pins: c.pins || [
          { name: 'VCC', type: 'power', signal: '3.3V' },
          { name: 'GND', type: 'ground', signal: 'GND' }
        ],
        dimensions: c.dimensions || { width: 40, height: 25, depth: 8 },
        purchaseUrl: c.purchaseUrl || 'https://www.digikey.com'
      }))
    : baseSynthesis.nodes;

  const steps = (Array.isArray(instructions) && instructions.length > 0)
    ? instructions
    : baseSynthesis.instructions;

  const totalCost = Number(
    nodes.reduce((sum, n) => sum + (n.price * (n.quantity || 1)), 0).toFixed(2)
  );

  const fullProject = {
    id: projectId,
    projectName: projectTitle,
    description: projectDescription,
    category: category || baseSynthesis.category || 'Robotics',
    stars: 1,
    author: author,
    authorAvatar: author.slice(0, 2).toUpperCase(),
    created_at: new Date().toISOString(),
    thumbnail: '/landing/images/hero-dog.webp',
    renderImage: '/landing/images/hero-dog.webp',
    estimatedCost: totalCost,
    buildTime: '4-6 hours',
    difficulty: difficulty,
    specs: {
      ...baseSynthesis.specs,
      ...specs
    },
    nodes: nodes,
    electricalConnections: baseSynthesis.electricalConnections || [],
    mechanicalConnections: baseSynthesis.mechanicalConnections || [],
    instructions: steps
  };

  // 4. Create dedicated export folder: /workspaces/blueprint/projects/<slug>/
  const projectDir = path.join(WORKSPACE_ROOT, 'projects', slug);
  fs.mkdirSync(projectDir, { recursive: true });

  // A. Save project.json
  const projectJsonPath = path.join(projectDir, 'project.json');
  fs.writeFileSync(projectJsonPath, JSON.stringify(fullProject, null, 2), 'utf8');

  // B. Save bom.csv
  const csvRows = [
    ['Part Name', 'Product SKU', 'Category', 'Vendor', 'Qty', 'Unit Price ($)', 'Subtotal ($)'].join(',')
  ];
  for (const n of nodes) {
    const qty = n.quantity || 1;
    const sub = (n.price * qty).toFixed(2);
    csvRows.push([
      `"${n.name.replace(/"/g, '""')}"`,
      `"${(n.productName || n.vendor_sku || '').replace(/"/g, '""')}"`,
      `"${n.category}"`,
      `"${n.vendor}"`,
      qty,
      n.price.toFixed(2),
      sub
    ].join(','));
  }
  const bomCsvPath = path.join(projectDir, 'bom.csv');
  fs.writeFileSync(bomCsvPath, csvRows.join('\n'), 'utf8');

  // C. Save wiring.json
  const wiringJsonPath = path.join(projectDir, 'wiring.json');
  fs.writeFileSync(wiringJsonPath, JSON.stringify(fullProject.electricalConnections, null, 2), 'utf8');

  // D. Save assembly-guide.md
  const markdownGuide = `# ${fullProject.projectName} - Hardware Manual

**Category:** ${fullProject.category} | **Difficulty:** ${fullProject.difficulty} | **Author:** ${fullProject.author}  
**Total BOM Cost:** $${fullProject.estimatedCost} | **Estimated Build Time:** ${fullProject.buildTime}

---

## 1. System Specifications
- **Core Microcontroller:** ${fullProject.specs.mcu || 'Embedded MCU'}
- **Power Budget:** ${fullProject.specs.power || 'LiPo Battery'}
- **Dimensions:** ${fullProject.specs.dimensions || 'Parametric'}
- **Weight:** ${fullProject.specs.weight || '350g'}

---

## 2. Bill of Materials (${nodes.length} Components)
| Component | SKU / Vendor | Qty | Unit Price |
| :--- | :--- | :--- | :--- |
${nodes.map(n => `| ${n.name} | ${n.vendor_sku} (${n.vendor}) | ${n.quantity || 1} | $${n.price.toFixed(2)} |`).join('\n')}

---

## 3. Assembly Instructions
${steps.map(s => `### Step ${s.step}: ${s.title}\n*Time: ${s.timeEstimate}*\n${s.description}\n\n**Tools Required:** ${(s.tools || []).join(', ')}\n`).join('\n')}
`;
  const guidePath = path.join(projectDir, 'assembly-guide.md');
  fs.writeFileSync(guidePath, markdownGuide, 'utf8');

  // 5. Update lastGenerated.json
  const lastGeneratedPath = path.join(WORKSPACE_ROOT, 'src/data/lastGenerated.json');
  fs.writeFileSync(lastGeneratedPath, JSON.stringify(fullProject, null, 2), 'utf8');

  // 6. Optionally append to sampleProjects.js
  let showcaseUpdated = false;
  if (addToShowcase) {
    try {
      const sampleProjectsPath = path.join(WORKSPACE_ROOT, 'src/data/sampleProjects.js');
      if (fs.existsSync(sampleProjectsPath)) {
        let content = fs.readFileSync(sampleProjectsPath, 'utf8');
        const lastIdx = content.lastIndexOf('];');
        if (lastIdx !== -1) {
          const formatted = JSON.stringify(fullProject, null, 2)
            .split('\n')
            .map(line => '  ' + line)
            .join('\n');
          content = content.slice(0, lastIdx).trimEnd() + ',\n' + formatted + '\n];\n';
          fs.writeFileSync(sampleProjectsPath, content, 'utf8');
          showcaseUpdated = true;
        }
      }
    } catch (err) {
      console.error('[createProject] Failed to update sampleProjects.js:', err.message);
    }
  }

  return {
    success: true,
    project: fullProject,
    paths: {
      directory: projectDir,
      projectJson: projectJsonPath,
      bomCsv: bomCsvPath,
      wiringJson: wiringJsonPath,
      assemblyGuide: guidePath,
      showcaseUpdated
    }
  };
}
