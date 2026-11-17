// Browser side of AI generation. Talks to the local bridge through the Vite
// proxy (/api -> :4000). Any failure resolves with project: null so callers
// can fall back to the offline template or planner.
export async function requestAiProject(prompt, baseProject) {
  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, project: baseProject || undefined }),
      signal: AbortSignal.timeout(130000)
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.project) return { project: data.project, reason: null };
    if (data.code === 'no_key') return { project: null, reason: 'no_key' };
    return { project: null, reason: data.error || `HTTP ${res.status}` };
  } catch (err) {
    return { project: null, reason: 'bridge_offline' };
  }
}

export function describeReason(reason) {
  if (reason === 'no_key') return 'Offline template used: set ANTHROPIC_API_KEY on the bridge to enable AI generation.';
  if (reason === 'bridge_offline') return 'Offline template used: the bridge server is not running (npm run bridge).';
  return reason ? `Offline template used (AI error: ${reason}).` : '';
}
