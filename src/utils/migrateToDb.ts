/**
 * migrateToDb.ts
 *
 * One-time utility: reads any existing data from localStorage
 * and POSTs it to the API (MySQL).
 *
 * Call from the browser console:
 *   import('/src/utils/migrateToDb.ts').then(m => m.migrateToDb())
 *
 * Or temporarily add migrateToDb() to App.tsx useEffect, run once, then remove.
 */

const BASE = '/api';

async function post(path: string, body: unknown) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.ok;
}

function load<T>(key: string): T[] {
  try { return JSON.parse(localStorage.getItem(key) ?? '[]') as T[]; }
  catch { return []; }
}

export async function migrateToDb(): Promise<void> {
  console.log('[migrate] Starting localStorage → MySQL migration...');

  // Categories
  const categories = load<{ id: string; name: string; color: string }>('tct_categories');
  for (const c of categories) {
    await post('/categories', { id: c.id, name: c.name, color: c.color });
  }
  console.log(`[migrate] Categories: ${categories.length}`);

  // Projects
  const projects = load<{ id: string; name: string; categoryId: string }>('tct_projects');
  for (const p of projects) {
    await post('/projects', { id: p.id, name: p.name, color: null, category_id: p.categoryId || null });
  }
  console.log(`[migrate] Projects: ${projects.length}`);

  // Time Entries
  const entries = load<{ id: string; date: string; startHour: number; endHour: number; description: string; projectIds: string[] }>('tct_entries');
  for (const e of entries) {
    await post('/entries', {
      id: e.id, date: e.date, startHour: e.startHour, endHour: e.endHour,
      description: e.description, projectIds: e.projectIds ?? [],
    });
  }
  console.log(`[migrate] Entries: ${entries.length}`);

  // Todos
  const todos = load<{ id: string; title: string; note?: string }>('tct_todos');
  for (let i = 0; i < todos.length; i++) {
    const t = todos[i];
    await post('/todos', { id: t.id, text: t.title, done: false, sort_order: i });
  }
  console.log(`[migrate] Todos: ${todos.length}`);

  // Settings
  const raw = localStorage.getItem('tct_settings');
  if (raw) {
    const s = JSON.parse(raw) as { theme?: string; timeRange?: string };
    await fetch(`${BASE}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme: s.theme ?? 'light', time_range: s.timeRange ?? 'extended', view_mode: 'week' }),
    });
    console.log('[migrate] Settings migrated');
  }

  console.log('[migrate] Done. You can now clear localStorage if desired.');
}
