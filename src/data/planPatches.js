// Offline "refine" planner. Builds a concrete, reviewable change set for a few
// common requests and returns the modified project; nothing mutates the input.
// Requests it cannot handle return { changes: [] } with an honest explanation.
import { recomputeTotals, validateProject } from './validateProject.js';

const clone = (o) => JSON.parse(JSON.stringify(o));

function findMcu(p) {
  return p.nodes.find(n => n.type === 'microcontroller');
}

function usedPins(p, nodeId) {
  const used = new Set();
  for (const c of p.electricalConnections || []) {
    if (c.fromNode === nodeId) used.add(c.fromPin);
    if (c.toNode === nodeId) used.add(c.toPin);
  }
  return used;
}

function freeGpio(p, mcu) {
  const used = usedPins(p, mcu.id);
  return (mcu.pins || []).find(x => (x.type === 'gpio' || x.type === 'pwm') && !used.has(x.name));
}

// Find a pin by its name or by its signal label (e.g. GPIO5 carries SDA).
function pinFor(node, label) {
  const hit = (node.pins || []).find(x => x.name === label || x.signal === label);
  return hit ? hit.name : null;
}

function nextWireId(p) {
  return 'ai-w' + ((p.electricalConnections || []).length + 1) + '-' + Math.random().toString(36).slice(2, 5);
}

function addPart(p, node, wires) {
  p.nodes.push(node);
  for (const w of wires) p.electricalConnections.push({ id: nextWireId(p), ...w });
}

export function buildPlan(request, project) {
  const text = String(request || '').toLowerCase();
  const next = clone(project);
  next.nodes = next.nodes || [];
  next.electricalConnections = next.electricalConnections || [];
  const mcu = findMcu(next);
  const changes = [];
  let summary = '';

  const decline = (why) => ({ summary: why, changes: [], next: project });

  if (!mcu) return decline('This project has no microcontroller node, so the offline planner cannot wire new parts.');

  const wantsBuzzer = /buzzer|alarm|beep|sound/.test(text);
  const wantsLed = /\bled\b|indicator|status light/.test(text);
  const wantsSensor = /sensor|detect|light|uv|temperature|humidity/.test(text) && !wantsBuzzer;
  const wantsBattery = /battery|power|runtime|longer/.test(text);

  if (wantsBuzzer || wantsLed) {
    const pin = freeGpio(next, mcu);
    if (!pin) return decline(`No free GPIO left on ${mcu.name}. Remove a connection first.`);
    const isBuzzer = wantsBuzzer;
    const id = isBuzzer ? 'node-buzzer' : 'node-status-led';
    if (next.nodes.some(n => n.id === id)) return decline(`${isBuzzer ? 'A buzzer' : 'A status LED'} is already in this project.`);
    const part = isBuzzer
      ? { id, name: 'Active buzzer (3.3 V)', productName: '3.3 V active piezo buzzer', type: 'buzzer', price: 1, weightG: 1.0, dim: { width: 12, height: 9, depth: 9 } }
      : { id, name: 'Status LED + resistor', productName: '3 mm LED with 330 ohm resistor', type: 'led', price: 0.2, weightG: 0.1, dim: { width: 3, height: 3, depth: 5 } };
    addPart(next, {
      id: part.id, name: part.name, productName: part.productName, category: 'electrical', type: part.type,
      vendor: 'Generic', vendor_sku: '', price: part.price, quantity: 1, priceEstimate: true,
      ...(project.nodes.every(n => typeof n.weightG === 'number') ? { weightG: part.weightG } : {}),
      pins: [{ name: isBuzzer ? 'SIG' : 'A', type: 'gpio', signal: pin.name }, { name: 'GND', type: 'ground', signal: 'GND' }],
      dimensions: part.dim
    }, [
      { fromNode: mcu.id, fromPin: pin.name, toNode: id, toPin: isBuzzer ? 'SIG' : 'A', color: '#eab308', label: `${part.name} signal` },
      { fromNode: mcu.id, fromPin: pinFor(mcu, 'GND') || 'GND', toNode: id, toPin: 'GND', color: '#1f2937', label: 'GND' }
    ]);
    summary = `Add ${part.name} on ${pin.name}.`;
    changes.push(`New part: ${part.name}`, `New wires: ${pin.name} to signal, GND to GND`);
  } else if (wantsSensor) {
    const sda = pinFor(mcu, 'SDA'), scl = pinFor(mcu, 'SCL'), v33 = pinFor(mcu, '3V3'), gnd = pinFor(mcu, 'GND');
    const missing = [['SDA', sda], ['SCL', scl], ['3V3', v33], ['GND', gnd]].filter(x => !x[1]).map(x => x[0]);
    if (missing.length) {
      return decline(`${mcu.name} has no ${missing.join(', ')} pin in this project, so the I2C sensor cannot be wired automatically.`);
    }
    if (next.nodes.some(n => n.id === 'node-light-sensor')) return decline('An ambient light / UV sensor is already in this project.');
    addPart(next, {
      id: 'node-light-sensor', name: 'Ambient light & UV sensor (I2C)', productName: 'LTR-390 breakout', category: 'electrical',
      type: 'sensor', vendor: 'Generic', vendor_sku: '', price: 6, quantity: 1, priceEstimate: true,
      ...(project.nodes.every(n => typeof n.weightG === 'number') ? { weightG: 0.5 } : {}),
      pins: [
        { name: 'VCC', type: 'power', signal: '3.3V' }, { name: 'GND', type: 'ground', signal: 'GND' },
        { name: 'SDA', type: 'i2c', signal: 'SDA' }, { name: 'SCL', type: 'i2c', signal: 'SCL' }
      ],
      dimensions: { width: 18, height: 14, depth: 3 }
    }, [
      { fromNode: mcu.id, fromPin: v33, toNode: 'node-light-sensor', toPin: 'VCC', color: '#f59e0b', label: 'Sensor power' },
      { fromNode: mcu.id, fromPin: gnd, toNode: 'node-light-sensor', toPin: 'GND', color: '#1f2937', label: 'GND' },
      { fromNode: mcu.id, fromPin: sda, toNode: 'node-light-sensor', toPin: 'SDA', color: '#3b82f6', label: 'I2C SDA' },
      { fromNode: mcu.id, fromPin: scl, toNode: 'node-light-sensor', toPin: 'SCL', color: '#10b981', label: 'I2C SCL' }
    ]);
    summary = 'Add an LTR-390 light/UV sensor on the shared I2C bus.';
    changes.push('New part: LTR-390 breakout', 'New wires: 3V3, GND, SDA, SCL (shared bus)');
  } else if (wantsBattery) {
    const bat = next.nodes.find(n => n.type === 'battery');
    if (!bat) return decline('No battery node found.');
    if (typeof bat.weightG === 'number' && bat.weightG < 10) {
      return decline('A bigger cell adds a lot of mass for a light airframe. Pick a specific cell and weight yourself, or raise the mass target first.');
    }
    bat.name = '3.7V 3500mAh 18650 Li-Ion + TP4056 USB-C charger';
    bat.productName = '18650 cell with protected holder and charger';
    bat.price = 9;
    bat.priceEstimate = true;
    summary = 'Upgrade the battery to a 3500 mAh 18650 cell with USB-C charging.';
    changes.push('Battery changed to 18650 3500 mAh', 'Price updated (estimate)');
  } else {
    return decline('The offline planner handles: add buzzer, add LED, add sensor, bigger battery. For free-form edits, connect the AI backend (see README).');
  }

  const checked = validateProject(recomputeTotals(next));
  if (!checked.ok) return decline('The generated change failed validation: ' + checked.errors[0]);
  return { summary, changes, next: checked.project };
}
