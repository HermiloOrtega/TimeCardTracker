import type { Project, TimeEntry, CategoryDef } from '../models/types';

const PROJECTS_KEY   = 'tct_projects';
const ENTRIES_KEY    = 'tct_entries';
const CATEGORIES_KEY = 'tct_categories';

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
  quattro:  { id: 'cat-quattro',  name: 'Quattro',       color: '#4CAF50' },
  ram_ibex: { id: 'cat-ram_ibex', name: 'RAM / IbexIQ',  color: '#2196F3' },
  multi:    { id: 'cat-multi',    name: 'Multi-company',  color: '#9C27B0' },
  personal: { id: 'cat-personal', name: 'Personal',       color: '#FFC107' },
};

export function migrateIfNeeded(): void {
  if (localStorage.getItem(CATEGORIES_KEY) !== null) return; // already migrated

  const raw = localStorage.getItem(PROJECTS_KEY);
  if (!raw) {
    // Fresh install — nothing to migrate; categories start empty
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
    // Projects already have categoryId — just initialise categories key
    setCategories(getCategories());
    return;
  }

  // Determine which legacy categories are actually used
  const usedKeys = new Set(projects.map(p => p.category ?? '').filter(Boolean));
  const seededCats: CategoryDef[] = [...usedKeys]
    .filter(k => k in LEGACY_SEED)
    .map(k => LEGACY_SEED[k]);

  // Remap projects
  const migrated: Project[] = projects.map(p => {
    const { category, ...rest } = p as Project & { category?: string };
    const cat = LEGACY_SEED[category ?? ''];
    return { ...rest, categoryId: cat?.id ?? '' };
  });

  setCategories(seededCats);
  setProjects(migrated);
}
