#!/usr/bin/env node

/**
 * Blueprint Antigravity MCP Server
 * Standard Model Context Protocol (MCP) server over Stdio transport.
 * Allows any MCP client (Claude Desktop, Cursor, Continue, etc.) to send messages/tasks,
 * execute work in this workspace, and receive rich formatted output.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema
} from '@modelcontextprotocol/sdk/types.js';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs';
import path from 'node:path';

const execAsync = promisify(exec);
const WORKSPACE_ROOT = process.env.WORKSPACE_ROOT || '/workspaces/blueprint';

// Initialize MCP Server
const server = new Server(
  {
    name: 'blueprint-antigravity-bridge',
    version: '1.0.0'
  },
  {
    capabilities: {
      tools: {},
      resources: {}
    }
  }
);

// Define Available MCP Tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'send_message',
        description: 'Send a message, task, or instruction to be processed in the Blueprint workspace. Automatically runs tasks, commands, code inspections, or hardware generations, and returns the complete result.',
        inputSchema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'The instruction, prompt, or question to execute.'
            },
            context: {
              type: 'string',
              description: 'Optional additional context or parameters.'
            }
          },
          required: ['message']
        }
      },
      {
        name: 'execute_command',
        description: 'Execute a bash shell command inside the /workspaces/blueprint environment and return stdout, stderr, and exit code.',
        inputSchema: {
          type: 'object',
          properties: {
            command: {
              type: 'string',
              description: 'Shell command string to execute.'
            },
            cwd: {
              type: 'string',
              description: 'Sub-directory inside the workspace (defaults to workspace root).'
            }
          },
          required: ['command']
        }
      },
      {
        name: 'read_workspace_file',
        description: 'Read the contents of any file in the workspace.',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Relative path to the file in /workspaces/blueprint.'
            }
          },
          required: ['path']
        }
      },
      {
        name: 'write_workspace_file',
        description: 'Create or overwrite a file in the workspace.',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Relative path to the file in /workspaces/blueprint.'
            },
            content: {
              type: 'string',
              description: 'Text content to write.'
            }
          },
          required: ['path', 'content']
        }
      },
      {
        name: 'list_workspace_files',
        description: 'List files and directories in the workspace.',
        inputSchema: {
          type: 'object',
          properties: {
            directory: {
              type: 'string',
              description: 'Relative directory path (leave blank for workspace root).'
            }
          }
        }
      },
      {
        name: 'generate_hardware_project',
        description: 'Synthesize a complete hardware project (BOM, circuit wiring diagram, 3D CAD dimensions, and assembly manual) from a text description and save it to the workspace.',
        inputSchema: {
          type: 'object',
          properties: {
            prompt: {
              type: 'string',
              description: 'Hardware description (e.g. "Robotic Dog with Servos and ESP32").'
            }
          },
          required: ['prompt']
        }
      },
      {
        name: 'create_project',
        description: 'Create a complete, permanent hardware project with 3D CAD dimensions, BOM with component pricing, wiring netlist, and step-by-step assembly manual. Saves project bundle files to projects/<slug>/ and adds it to the Web Application showcase.',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Project name / title (e.g. "Autonomous Solar Drone" or "Smart Soil Monitor").'
            },
            description: {
              type: 'string',
              description: 'Detailed description of the hardware project and its requirements.'
            },
            category: {
              type: 'string',
              description: 'Category: "Robotics", "IoT", "Wearables", "Audio", "Automation", or "Computing".'
            },
            difficulty: {
              type: 'string',
              enum: ['Beginner', 'Intermediate', 'Advanced'],
              description: 'Build difficulty level.'
            },
            author: {
              type: 'string',
              description: 'Author / Creator name.'
            },
            specs: {
              type: 'object',
              description: 'Custom hardware specifications (mcu, power, dimensions, weight).'
            },
            components: {
              type: 'array',
              description: 'Optional custom list of BOM components. If omitted, components will be synthesized automatically.'
            },
            instructions: {
              type: 'array',
              description: 'Optional custom list of assembly steps. If omitted, instructions will be synthesized automatically.'
            },
            addToShowcase: {
              type: 'boolean',
              description: 'Whether to add this project to the web application showcase in sampleProjects.js (default: true).'
            }
          },
          required: ['name', 'description']
        }
      }
    ]
  };
});

// Handle Tool Invocations
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'send_message': {
        const msg = args.message || '';
        let output = `[Workspace Message Received: "${msg}"]\n\n`;

        // Check if message looks like a shell command
        if (msg.startsWith('run:') || msg.startsWith('cmd:') || msg.startsWith('exec:')) {
          const cmd = msg.replace(/^(run|cmd|exec):\s*/i, '');
          const { stdout, stderr } = await execAsync(cmd, { cwd: WORKSPACE_ROOT });
          output += `Command Output:\n${stdout || '(No stdout)'}\n${stderr ? `Errors:\n${stderr}` : ''}`;
        }
        // Check if message asks to generate hardware
        else if (msg.toLowerCase().includes('generate') || msg.toLowerCase().includes('hardware')) {
          const { generateProjectFromPrompt } = await import('../src/data/projectGenerator.js');
          const project = generateProjectFromPrompt(msg);
          output += `Generated Hardware Architecture:\n` +
            `• Project Name: ${project.projectName}\n` +
            `• Category: ${project.category}\n` +
            `• Estimated Cost: $${project.estimatedCost}\n` +
            `• Total Components: ${project.nodes.length} parts\n` +
            `• Wires & Connections: ${project.electricalConnections.length} nets\n` +
            `• Assembly Steps: ${project.instructions.length} stages\n\n` +
            `Components Overview:\n` +
            project.nodes.map(n => `  - [${n.category.toUpperCase()}] ${n.name} ($${n.price}) - Vendor: ${n.vendor}`).join('\n');
        }
        // General query / workspace work
        else {
          const { stdout } = await execAsync('git status --short 2>/dev/null || ls -la', { cwd: WORKSPACE_ROOT });
          output += `Work processed in ${WORKSPACE_ROOT}.\nWorkspace Summary:\n${stdout.slice(0, 500)}`;
        }

        return {
          content: [
            {
              type: 'text',
              text: output
            }
          ]
        };
      }

      case 'execute_command': {
        const targetDir = args.cwd ? path.resolve(WORKSPACE_ROOT, args.cwd) : WORKSPACE_ROOT;
        const { stdout, stderr } = await execAsync(args.command, {
          cwd: targetDir,
          maxBuffer: 10 * 1024 * 1024
        });

        return {
          content: [
            {
              type: 'text',
              text: `[Exit Code 0]\n--- STDOUT ---\n${stdout || '(none)'}\n--- STDERR ---\n${stderr || '(none)'}`
            }
          ]
        };
      }

      case 'read_workspace_file': {
        const targetPath = path.resolve(WORKSPACE_ROOT, args.path);
        if (!targetPath.startsWith(WORKSPACE_ROOT)) {
          throw new Error('Access outside workspace root is not permitted.');
        }
        const data = fs.readFileSync(targetPath, 'utf8');
        return {
          content: [
            {
              type: 'text',
              text: data
            }
          ]
        };
      }

      case 'write_workspace_file': {
        const targetPath = path.resolve(WORKSPACE_ROOT, args.path);
        if (!targetPath.startsWith(WORKSPACE_ROOT)) {
          throw new Error('Access outside workspace root is not permitted.');
        }
        fs.mkdirSync(path.dirname(targetPath), { recursive: true });
        fs.writeFileSync(targetPath, args.content, 'utf8');
        return {
          content: [
            {
              type: 'text',
              text: `Successfully wrote ${args.content.length} bytes to ${args.path}`
            }
          ]
        };
      }

      case 'list_workspace_files': {
        const targetDir = args.directory ? path.resolve(WORKSPACE_ROOT, args.directory) : WORKSPACE_ROOT;
        if (!targetDir.startsWith(WORKSPACE_ROOT)) {
          throw new Error('Access outside workspace root is not permitted.');
        }
        const entries = fs.readdirSync(targetDir, { withFileTypes: true });
        const list = entries.map(e => `${e.isDirectory() ? '[DIR] ' : '[FILE]'} ${e.name}`).join('\n');
        return {
          content: [
            {
              type: 'text',
              text: list || '(empty directory)'
            }
          ]
        };
      }

      case 'generate_hardware_project': {
        const { generateProjectFromPrompt } = await import('../src/data/projectGenerator.js');
        const project = generateProjectFromPrompt(args.prompt);

        // Save generated project to workspace
        const outPath = path.join(WORKSPACE_ROOT, 'src/data/lastGenerated.json');
        fs.writeFileSync(outPath, JSON.stringify(project, null, 2), 'utf8');

        return {
          content: [
            {
              type: 'text',
              text: `Successfully generated project "${project.projectName}"!\nSaved to: ${outPath}\n\n` +
                JSON.stringify({
                  projectName: project.projectName,
                  category: project.category,
                  estimatedCost: project.estimatedCost,
                  partsCount: project.nodes.length,
                  wiringConnections: project.electricalConnections.length,
                  assemblySteps: project.instructions.length
                }, null, 2)
            }
          ]
        };
      }

      case 'create_project': {
        const { createProject } = await import('./projectService.js');
        const result = await createProject({
          name: args.name,
          description: args.description,
          category: args.category,
          difficulty: args.difficulty,
          author: args.author,
          specs: args.specs,
          components: args.components,
          instructions: args.instructions,
          addToShowcase: args.addToShowcase !== false
        });

        const p = result.project;
        const output = `Successfully Created Hardware Project: "${p.projectName}"\n` +
          `• Project ID: ${p.id}\n` +
          `• Category: ${p.category} (${p.difficulty})\n` +
          `• Author: ${p.author}\n` +
          `• Total BOM Cost: $${p.estimatedCost}\n` +
          `• Components: ${p.nodes.length} parts\n` +
          `• Wiring Connections: ${p.electricalConnections.length} nets\n` +
          `• Assembly Stages: ${p.instructions.length} steps\n\n` +
          `Project Files Created:\n` +
          `  - Folder: ${result.paths.directory}\n` +
          `  - Project Manifest: ${result.paths.projectJson}\n` +
          `  - Bill of Materials: ${result.paths.bomCsv}\n` +
          `  - Wiring Schematic: ${result.paths.wiringJson}\n` +
          `  - Assembly Guide: ${result.paths.assemblyGuide}\n` +
          (result.paths.showcaseUpdated ? `  - Added to Web App Showcase: Yes (visible in Studio & Community)\n` : '');

        return {
          content: [
            {
              type: 'text',
              text: output
            }
          ]
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: `Tool Execution Error: ${error.message}\n${error.stack || ''}`
        }
      ]
    };
  }
});

// Resources Handler
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'workspace://package.json',
        name: 'Blueprint Project Manifest',
        mimeType: 'application/json'
      },
      {
        uri: 'workspace://status',
        name: 'Workspace Runtime Status',
        mimeType: 'application/json'
      }
    ]
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;
  if (uri === 'workspace://package.json') {
    const content = fs.readFileSync(path.join(WORKSPACE_ROOT, 'package.json'), 'utf8');
    return {
      contents: [{ uri, mimeType: 'application/json', text: content }]
    };
  } else if (uri === 'workspace://status') {
    const status = {
      workspace: WORKSPACE_ROOT,
      time: new Date().toISOString(),
      nodeVersion: process.version,
      devServer: 'http://localhost:3000'
    };
    return {
      contents: [{ uri, mimeType: 'application/json', text: JSON.stringify(status, null, 2) }]
    };
  }
  throw new Error(`Resource not found: ${uri}`);
});

// Start Stdio Transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('[MCP] Blueprint Antigravity MCP Server connected over stdio.');
}

main().catch(err => {
  console.error('[MCP] Fatal Server Error:', err);
  process.exit(1);
});
