import { spawn } from 'node:child_process';

const child = spawn('node', [new URL('./index.js', import.meta.url).pathname]);

let buffer = '';

child.stdout.on('data', (data) => {
  buffer += data.toString();
  console.log('[Client received MCP stdout]:', data.toString());
});

child.stderr.on('data', (data) => {
  console.log('[Server stderr log]:', data.toString().trim());
});

// Send initialize request
const initReq = JSON.stringify({
  jsonrpc: '2.0',
  id: 1,
  method: 'initialize',
  params: {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: { name: 'test-client', version: '1.0.0' }
  }
}) + '\n';

child.stdin.write(initReq);

setTimeout(() => {
  // Send tools/list request
  const listReq = JSON.stringify({
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/list',
    params: {}
  }) + '\n';
  child.stdin.write(listReq);
}, 500);

setTimeout(() => {
  // Call send_message tool
  const callReq = JSON.stringify({
    jsonrpc: '2.0',
    id: 3,
    method: 'tools/call',
    params: {
      name: 'send_message',
      arguments: {
        message: 'cmd: ls -lh'
      }
    }
  }) + '\n';
  child.stdin.write(callReq);
}, 1000);

setTimeout(() => {
  // Call create_project tool
  const createReq = JSON.stringify({
    jsonrpc: '2.0',
    id: 4,
    method: 'tools/call',
    params: {
      name: 'create_project',
      arguments: {
        name: 'Autonomous Delivery Drone',
        description: 'Heavy-lift delivery quadcopter with GPS telemetry, collision avoidance lidar, and automated payload drop mechanism.',
        category: 'Robotics',
        difficulty: 'Advanced',
        addToShowcase: true
      }
    }
  }) + '\n';
  child.stdin.write(createReq);
}, 1600);

setTimeout(() => {
  child.kill();
  process.exit(0);
}, 3200);
