/**
 * apiService.ts — All HTTP calls to the Express API.
 * Replaces storageService.ts for data persistence.
 */

import type { Project, TimeEntry, CategoryDef, TodoItem, AppSettings, User } from '../models/types';

const BASE = '/api';

let _username: string | null = null;

/** Called once after login to attach the username to every subsequent request. */
export function setCurrentUser(username: string) {
  _username = username;
}

async function req<T>(path: string, method = 'GET', body?: unknown): Promise<T> {
  const headers: Record<string, string> = {};
  if (body) headers['Content-Type'] = 'application/json';
  if (_username) headers['X-Username'] = _username;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`API ${method} ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function apiLogin(username: string, password: string): Promise<User> {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error('Invalid credentials');
  return res.json() as Promise<User>;
}

// ─── Categories ───────────────────────────────────────────────────────────────

export const apiGetCategories  = () =>
  req<(Omit<CategoryDef, 'weeklyHours'> & { weekly_hours?: number })[]>('/categories')
    .then(rows => rows.map(r => ({ ...r, weeklyHours: r.weekly_hours ?? 0 }) as CategoryDef));
export const apiAddCategory    = (c: CategoryDef) =>
  req('/categories', 'POST', { id: c.id, name: c.name, color: c.color, weekly_hours: c.weeklyHours });
export const apiUpdateCategory = (c: CategoryDef) =>
  req(`/categories/${c.id}`, 'PUT', { name: c.name, color: c.color, weekly_hours: c.weeklyHours });
export const apiDeleteCategory = (id: string) => req(`/categories/${id}`, 'DELETE');

// ─── Projects ─────────────────────────────────────────────────────────────────

export const apiGetProjects  = () =>
  req<{ id: string; name: string; color: string | null; category_id: string | null }[]>('/projects')
    .then(rows => rows.map(r => ({ id: r.id, name: r.name, categoryId: r.category_id ?? '' }) as Project));

export const apiAddProject    = (p: Project) =>
  req('/projects', 'POST', { id: p.id, name: p.name, color: null, category_id: p.categoryId || null });
export const apiDeleteProject = (id: string) => req(`/projects/${id}`, 'DELETE');

// ─── Time Entries ─────────────────────────────────────────────────────────────

interface ApiEntry {
  id: string; date: string; start_hour: number; end_hour: number;
  description: string; projectIds: string[];
}

function toEntry(r: ApiEntry): TimeEntry {
  return {
    id: r.id,
    date: r.date,
    startHour: r.start_hour,
    endHour: r.end_hour,
    description: r.description,
    projectIds: r.projectIds ?? [],
  };
}

export const apiGetEntries = (start?: string, end?: string) => {
  const qs = start && end ? `?start=${start}&end=${end}` : '';
  return req<ApiEntry[]>(`/entries${qs}`).then(rows => rows.map(toEntry));
};

export const apiAddEntry = (e: TimeEntry) =>
  req('/entries', 'POST', {
    id: e.id, date: e.date, startHour: e.startHour, endHour: e.endHour,
    description: e.description, projectIds: e.projectIds,
  });

export const apiUpdateEntry = (e: TimeEntry) =>
  req(`/entries/${e.id}`, 'PUT', {
    date: e.date, startHour: e.startHour, endHour: e.endHour,
    description: e.description, projectIds: e.projectIds,
  });

export const apiDeleteEntry = (id: string) => req(`/entries/${id}`, 'DELETE');

// ─── Todos ────────────────────────────────────────────────────────────────────

interface ApiTodo { id: string; text: string; sort_order: number; }

function toTodo(r: ApiTodo): TodoItem {
  return { id: r.id, title: r.text, createdAt: '' };
}

export const apiGetTodos  = () =>
  req<ApiTodo[]>('/todos').then(rows => rows.map(toTodo));

export const apiAddTodo = (t: TodoItem, order: number) =>
  req('/todos', 'POST', { id: t.id, text: t.title, done: false, sort_order: order });

export const apiUpdateTodo = (t: TodoItem, order: number) =>
  req(`/todos/${t.id}`, 'PUT', { text: t.title, done: false, sort_order: order });

export const apiDeleteTodo = (id: string) => req(`/todos/${id}`, 'DELETE');

// ─── Settings ─────────────────────────────────────────────────────────────────

interface ApiSettings { theme: string; time_range: string; view_mode: string; }

export const apiGetSettings = () =>
  req<ApiSettings>('/settings').then(r => ({
    theme: r.theme as AppSettings['theme'],
    timeRange: r.time_range as AppSettings['timeRange'],
  }));

export const apiSaveSettings = (s: AppSettings) =>
  req('/settings', 'PUT', { theme: s.theme, time_range: s.timeRange, view_mode: 'week' });
