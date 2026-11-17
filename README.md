# Blueprint: AI Hardware Design Platform

> **Make Any Idea Real.** Turn a single prompt into a buildable hardware project with 3D CAD mechanical views, schematic wiring netlists, verified Bills of Materials, and step-by-step assembly manuals.

---

## ⚡ Overview

Blueprint is an end-to-end hardware engineering studio powered by AI. It bridges the gap between software prompt synthesis and physical hardware assembly, allowing creators and engineers to rapidly design, verify, and build robotics, IoT, wearables, and automation devices.

### Key Capabilities

* **3D CAD Mechanical Assembly View (Three.js):** Interactive WebGL orbit viewer featuring multi-layer PCB rendering, surface-mount components, brass standoffs, enclosure opacity toggles, camera presets (`ISO`, `Top`, `Front`, `Side`), and an **Exploded Assembly Slider** (0–60%) that expands components along their build axes.
* **Schematic Circuit Wiring Canvas:** Interactive canvas featuring draggable hardware components, categorized pinouts (Power, Ground, I2C, SPI, UART, PWM), and color-coded bezier signal nets with interactive hover highlighting.
* **Interactive Bill of Materials (BOM):** Searchable and filterable part catalogs with real-time supplier badges (DigiKey, Mouser, Adafruit, SparkFun, AliExpress), stock status, CSV export, and part detail inspection modals.
* **Physical Assembly Manual:** Step-by-step physical build instructions with task completion checkboxes, required tooling lists, time estimates, and progress tracking.
* **Community Project Showcase:** Explore preloaded designs (Robot Dog, Cyberdeck Wrist Terminal, Aeroponics Incubator, Delivery Drone, Bionic Hand) or create and publish your own.
* **Bidirectional MCP Server & HTTP Bridge:** Model Context Protocol (MCP) server allowing AI agents (Claude Desktop, Cursor, Antigravity) to execute commands, read/write workspace code, synthesize hardware, and create new projects via Stdio and HTTP REST endpoints.

---

## 🛠 Tech Stack

* **Frontend:** React 19, Vite 6, Tailwind CSS v4, Lucide Icons
* **3D Graphics:** Three.js (WebGL, OrbitControls, Parametric Geometries)
* **Design & Typography:** Authentic Montech V.02 fonts & Google Fonts (`JetBrains Mono`, `Raleway`, `Inter`)
* **MCP Server & Bridge:** `@modelcontextprotocol/sdk`, Node.js HTTP/JSON-RPC server

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/xeno2426/blueprint.git
cd blueprint
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
npm run preview
```

---

## 🤖 MCP Server & Bridge Integration

Blueprint includes a built-in MCP server in `mcp-server/`.

### Available Tools:
1. `send_message`: Unified processor for commands, tasks, and queries.
2. `create_project`: Creates full hardware projects (`project.json`, `bom.csv`, `wiring.json`, `assembly-guide.md`) and adds them to the showcase.
3. `generate_hardware_project`: Parametric hardware synthesizer from text descriptions.
4. `execute_command`: Bash command execution in the workspace.
5. `read_workspace_file`: Inspect workspace source files.
6. `write_workspace_file`: Edit or create files.
7. `list_workspace_files`: Workspace directory exploration.

### Start MCP Server & HTTP Bridge:
```bash
# Stdio Server (for Claude Desktop / Cursor)
node mcp-server/index.js

# HTTP & Web Bridge (Port 4000)
node mcp-server/bridge.js
```

---

## 📂 Project Structure

```
blueprint/
├── index.html                     # HTML shell, fonts, and dark theme
├── package.json                   # Dependencies and build scripts
├── vite.config.js                 # Vite + React + Tailwind v4 config
├── .gitignore                     # Ignored build outputs and logs
├── public/
│   ├── brand/fonts/               # Authentic MONTECH V.02 typography
│   └── landing/images/            # High-res concept renders
├── src/
│   ├── main.jsx                   # React application root
│   ├── App.jsx                    # View router (Landing, Community, Studio)
│   ├── index.css                  # Tailwind v4 styles & theme tokens
│   ├── components/                # 3D Mech, Wiring, BOM, Instructions, Modal
│   ├── views/                     # LandingPage, CommunityView, StudioView
│   └── data/                      # Project generator & sample projects
├── projects/                      # Generated hardware project bundles
└── mcp-server/                    # MCP server, HTTP bridge, and test suite
```

---

## 🔐 Bridge security (changed)

`node mcp-server/bridge.js` (or `npm run bridge`) now:

* listens on `127.0.0.1` only (override with `BRIDGE_HOST`),
* prints a random token at start (or use `BRIDGE_TOKEN`); every POST except `/api/generate` needs it in the `x-bridge-token` header,
* keeps shell commands (`run:`, `$`) **disabled** unless you start it with `BRIDGE_ALLOW_EXEC=1` and send the token,
* only accepts `localhost` hosts and origins (plus `*.app.github.dev` when running inside a Codespace),
* refuses file paths that escape the project folder.

Do not make port 4000 public in a Codespace.

## 🤖 Real AI generation (new)

Without a key the app uses a fixed offline template (plus a butterfly/ornithopter preset). To get real generation and free-form edits:

```bash
export ANTHROPIC_API_KEY=sk-ant-...      # optional: BLUEPRINT_MODEL=claude-sonnet-5-5
npm run bridge                           # terminal 1
npm run dev                              # terminal 2 (Vite proxies /api to the bridge)
```

The model reply is validated (unknown nodes, missing pins, duplicate ids) and retried once before it is accepted. Totals for cost and mass are recomputed in code, not taken from the model.

## 💾 Saved projects

Generated and edited projects are stored in the browser (localStorage) and appear first in Community. Edited sample projects are saved as copies.

---

## 📄 License

MIT License. Designed and engineered with Antigravity.
