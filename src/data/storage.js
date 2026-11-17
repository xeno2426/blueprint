// Saved projects live in the browser (localStorage). Every call is wrapped in
// try/catch because storage can be blocked (private mode) or full.
const KEY = 'blueprint.projects.v1';
const MAX_PROJECTS = 30;

export function loadProjects() {
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function saveProject(project) {
  if (!project || !project.id) return false;
  try {
    const rest = loadProjects().filter(p => p.id !== project.id);
    const next = [{ ...project, savedAt: new Date().toISOString() }, ...rest].slice(0, MAX_PROJECTS);
    localStorage.setItem(KEY, JSON.stringify(next));
    return true;
  } catch {
    return false;
  }
}

export function deleteProject(id) {
  try {
    const next = loadProjects().filter(p => p.id !== id);
    localStorage.setItem(KEY, JSON.stringify(next));
    return true;
  } catch {
    return false;
  }
}
