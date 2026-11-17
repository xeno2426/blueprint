# Changes

## Security (important)
- `mcp-server/bridge.js` ran any shell command sent to it over HTTP, listened on 0.0.0.0 and allowed every website (CORS `*`). Anyone who could reach port 4000, or any web page you visited, could run commands on your machine/Codespace. Now: loopback only, token required, shell off by default, host/origin allow-list, path traversal blocked.
- `mcp-server/index.js`: `startsWith` workspace checks replaced with a real relative-path check; command timeout added.
- Hardcoded `/workspaces/blueprint` defaults replaced by the project folder.

## Functions
- Real AI generation + refine through `POST /api/generate` (key stays on the server), validated and retried; offline template fallback with a visible note.
- "Apply Changes" now really changes the project (BOM, wiring, totals). Checkpoint is taken before the change, so Versions > Restore works.
- Offline planner: add buzzer / LED / light sensor / bigger battery, with pin-aware wiring and refusal when it makes no sense.
- Butterfly/ornithopter preset (pin map avoids ESP32-C3 strapping pins, mass budget with a warning when over target).
- Projects are saved in the browser and listed first in Community.
- `validateProject` checks nodes/pins/wires; cost and mass are recomputed from parts.
- Template fix: battery no longer wired straight into the 3V3 pin (now VIN).

## Honesty fixes
- Removed fake stock counts, invented SKUs, the dog photo on every project, the no-op "Re-roll render" button and the "Multimodal CAD Pipeline" claims.
- The MECH tab still shows a generic reference model (labelled as such). Building it from node dimensions is the next big task.

## UI
- Studio works on phones: dynamic viewport height, tabs wrap full width, AI panel is a slide-over, text can be selected/copied, no confetti on every open.
- BOM banner for estimated prices; INFO tab shows warnings.
