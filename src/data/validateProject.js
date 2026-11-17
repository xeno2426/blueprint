// Structural checks for a project object (from the template generator or from an AI).
// Returns { ok, errors, project } where project has derived totals filled in.
export function validateProject(p) {
  const errors = [];
  if (!p || typeof p !== 'object') return { ok: false, errors: ['Not an object'], project: null };
  if (!p.projectName) errors.push('Missing projectName');
  if (!Array.isArray(p.nodes) || p.nodes.length === 0) errors.push('nodes must be a non-empty array');

  const ids = new Set();
  const pinsByNode = {};
  for (const n of p.nodes || []) {
    if (!n.id) { errors.push('A node has no id'); continue; }
    if (ids.has(n.id)) errors.push(`Duplicate node id ${n.id}`);
    ids.add(n.id);
    pinsByNode[n.id] = new Set((n.pins || []).map(x => x.name));
  }

  for (const c of p.electricalConnections || []) {
    if (!ids.has(c.fromNode) || !ids.has(c.toNode)) {
      errors.push(`Wire ${c.id || '?'} references an unknown node`);
      continue;
    }
    if (!pinsByNode[c.fromNode].has(c.fromPin)) errors.push(`Wire ${c.id || '?'}: ${c.fromNode} has no pin ${c.fromPin}`);
    if (!pinsByNode[c.toNode].has(c.toPin)) errors.push(`Wire ${c.id || '?'}: ${c.toNode} has no pin ${c.toPin}`);
  }
  for (const m of p.mechanicalConnections || []) {
    if (!ids.has(m.parentNode) || !ids.has(m.childNode)) errors.push('A mechanical connection references an unknown node');
  }

  if (errors.length) return { ok: false, errors, project: null };
  return { ok: true, errors: [], project: recomputeTotals(p) };
}

// Keep derived numbers honest: cost always equals the sum of the parts,
// and mass is only reported when every part has a weight.
export function recomputeTotals(p) {
  const nodes = p.nodes || [];
  const cost = nodes.reduce((a, n) => a + (Number(n.price) || 0) * (Number(n.quantity) || 1), 0);
  const allWeighed = nodes.length > 0 && nodes.every(n => typeof n.weightG === 'number');
  const grams = allWeighed ? nodes.reduce((a, n) => a + n.weightG * (Number(n.quantity) || 1), 0) : null;
  const next = {
    ...p,
    estimatedCost: parseFloat(cost.toFixed(2)),
    specs: { ...(p.specs || {}) }
  };
  if (grams !== null) next.specs.weight = `~${grams.toFixed(1)} g (estimate)`;
  next.massG = grams;
  const warnings = (p.warnings || []).filter(w => !w.startsWith('[auto]'));
  if (grams !== null && typeof p.targetMassG === 'number' && grams > p.targetMassG) {
    warnings.push(`[auto] Estimated mass ${grams.toFixed(1)} g exceeds the ${p.targetMassG} g target.`);
  }
  next.warnings = warnings;
  return next;
}
