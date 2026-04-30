import type { Project, TimeEntry, CategoryDef, TodoItem, AppSettings } from '../models/types';

const PROJECTS_KEY   = 'tct_projects';
const ENTRIES_KEY    = 'tct_entries';
const CATEGORIES_KEY = 'tct_categories';
const TODOS_KEY      = 'tct_todos';
const SETTINGS_KEY   = 'tct_settings';

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  timeRange: 'extended',
};

// ─── Settings ─────────────────────────────────────────────────────

export function getSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } as AppSettings;
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function setSettings(settings: AppSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// ─── Todos ────────────────────────────────────────────────────────

export function getTodos(): TodoItem[] {
  try {
    const raw = localStorage.getItem(TODOS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as TodoItem[];
  } catch {
    return [];
  }
}

export function setTodos(todos: TodoItem[]): void {
  localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
}

// ─── Categories ───────────────────────────────────────────────────

export function getCategories(): CategoryDef[] {
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CategoryDef[];
  } catch {
    return [];
  }
}

export function setCategories(categories: CategoryDef[]): void {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
}

// ─── Projects ─────────────────────────────────────────────────────

export function getProjects(): Project[] {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Project[];
  } catch {
    return [];
  }
}

export function setProjects(projects: Project[]): void {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

// ─── Entries ──────────────────────────────────────────────────────

export function getEntries(): TimeEntry[] {
  try {
    const raw = localStorage.getItem(ENTRIES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as TimeEntry[];
  } catch {
    return [];
  }
}

export function setEntries(entries: TimeEntry[]): void {
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
}

// ─── Migration ────────────────────────────────────────────────────
// Converts old hardcoded category strings to user-defined CategoryDef objects.
// Runs only once (when tct_categories is absent). Idempotent.

const LEGACY_SEED: Record<string, CategoryDef> = {
  company_a: { id: 'cat-company-a', name: 'Company A',    color: '#4CAF50' },
  company_b: { id: 'cat-company-b', name: 'Company B',    color: '#2196F3' },
  multi:     { id: 'cat-multi',     name: 'Multi-company', color: '#9C27B0' },
  personal:  { id: 'cat-personal',  name: 'Personal',      color: '#FFC107' },
};

export function migrateIfNeeded(): void {
  if (localStorage.getItem(CATEGORIES_KEY) !== null) return; // already migrated

  const raw = localStorage.getItem(PROJECTS_KEY);
  if (!raw) {
    return;
  }

  let projects: (Project & { category?: string })[];
  try {
    projects = JSON.parse(raw) as (Project & { category?: string })[];
  } catch {
    return;
  }

  const hasLegacy = projects.some(p => 'category' in p);
  if (!hasLegacy) {
    setCategories(getCategories());
    return;
  }

  const usedKeys = new Set(projects.map(p => p.category ?? '').filter(Boolean));
  const seededCats: CategoryDef[] = [...usedKeys]
    .filter(k => k in LEGACY_SEED)
    .map(k => LEGACY_SEED[k]);

  const migrated: Project[] = projects.map(p => {
    const { category, ...rest } = p as Project & { category?: string };
    const cat = LEGACY_SEED[category ?? ''];
    return { ...rest, categoryId: cat?.id ?? '' };
  });

  setCategories(seededCats);
  setProjects(migrated);
}
