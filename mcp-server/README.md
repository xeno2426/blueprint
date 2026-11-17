# Blueprint Antigravity MCP Server & Message Bridge

An official **Model Context Protocol (MCP)** server and HTTP/SSE message bridge for the project folder (set `WORKSPACE_ROOT` to override).

It enables any external client (Claude Desktop, Cursor, Continue, Windsurf, or custom webhooks/scripts) to **send messages, commands, or prompts**, which are **received and executed in the workspace**, and the **output is returned back**.

---

## 🛠 Available Tools

| Tool Name | Parameters | Description |
| :--- | :--- | :--- |
| **`send_message`** | `message` (string), `context` (string) | Primary tool. Processes messages, runs tasks, executes shell commands (`cmd: <command>`), generates hardware architectures (`generate <idea>`), or inspects files (`cat: <file>`). Returns complete output. |
| **`execute_command`** | `command` (string), `cwd` (string) | Executes bash commands inside the project folder (set `WORKSPACE_ROOT` to override) and returns stdout, stderr, and exit code. |
| **`read_workspace_file`** | `path` (string) | Reads file contents from the project folder (set `WORKSPACE_ROOT` to override). |
| **`write_workspace_file`** | `path` (string), `content` (string) | Writes or updates files in the project folder (set `WORKSPACE_ROOT` to override). |
| **`list_workspace_files`** | `directory` (string) | Lists workspace files and directories. |
| **`generate_hardware_project`** | `prompt` (string) | Synthesizes a full hardware project (BOM, wiring netlists, 3D CAD dimensions, and assembly manual) and saves it to the workspace. |
| **`create_project`** | `name` (string), `description` (string), `category` (string), `difficulty` (string), `specs` (object), `components` (array), `instructions` (array), `addToShowcase` (boolean) | Creates a complete, permanent hardware project with dedicated directory under `projects/<slug>/`, exporting `project.json`, `bom.csv`, `wiring.json`, `assembly-guide.md`, and automatically adding it to the Web Application showcase in `src/data/sampleProjects.js`. |

---

## 🚀 How to Connect

### 1. Claude Desktop / Cursor / Windsurf Configuration (Stdio Mode)

Add the following to your `claude_desktop_config.json` (or Cursor MCP settings):

```json
{
  "mcpServers": {
    "blueprint-workspace": {
      "command": "node",
      "args": [
        "/workspaces/blueprint/mcp-server/index.js"
      ],
      "env": {
        "WORKSPACE_ROOT": "/workspaces/blueprint"
      }
    }
  }
}
```

---

### 2. HTTP REST & Streamable Bridge (Port 4000)

The bridge is running as a daemon on `http://0.0.0.0:4000`.

#### Send a Message / Task via `curl`:
```bash
curl -X POST http://localhost:4000/message \
  -H "Content-Type: application/json" \
  -d '{"message": "cmd: git status"}'
```

#### Generate Hardware Architecture:
```bash
curl -X POST http://localhost:4000/message \
  -H "Content-Type: application/json" \
  -d '{"message": "generate autonomous underwater rov with camera"}'
```

#### Create a New Hardware Project:
```bash
# Via REST endpoint:
curl -X POST http://localhost:4000/project \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Autonomous Solar Drone",
    "description": "Long-endurance solar-powered monitoring drone with telemetry and optical camera",
    "category": "Robotics",
    "difficulty": "Advanced",
    "addToShowcase": true
  }'

# Or via message prompt:
curl -X POST http://localhost:4000/message \
  -H "Content-Type: application/json" \
  -d '{"message": "create: Smart Hydroponics Incubator | Automated nutrient dosing and LED spectrum controller"}'
```

#### Read a File:
```bash
curl -X POST http://localhost:4000/message \
  -H "Content-Type: application/json" \
  -d '{"message": "cat: package.json"}'
```

---

### 3. Interactive Web Dashboard UI

Open your browser to:
👉 **`http://localhost:4000/`**

Type any task or message into the prompt box, click **"Send to Workspace"**, and see live output returned from the workspace in real-time.
