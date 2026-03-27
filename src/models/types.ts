export type ViewMode = 'week-with-weekends' | 'week-without-weekends' | 'daily';

export type Theme = 'light' | 'dark';

/** work = 9–5, extended = 8–6 (default), full = 6am–10pm */
export type TimeRange = 'work' | 'extended' | 'full';

export interface AppSettings {
  theme: Theme;
  timeRange: TimeRange;
}

export interface CategoryDef {
  id: string;
  name: string;
  color: string; // hex e.g. '#4CAF50'
}

export interface Project {
  id: string;
  name: string;
  categoryId: string; // references CategoryDef.id
}

export interface TimeEntry {
  id: string;
  date: string;         // 'YYYY-MM-DD'
  startHour: number;    // integer
  endHour: number;      // integer, always > startHour
  description: string;
  projectIds: string[]; // references Project.id[]
}

export interface TodoItem {
  id: string;
  title: string;
  note?: string;
  createdAt: string; // ISO timestamp
}
