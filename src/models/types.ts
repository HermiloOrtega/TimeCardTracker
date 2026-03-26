export type ViewMode = 'week-with-weekends' | 'week-without-weekends' | 'daily';

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
  startHour: number;    // 7–18 (integer)
  endHour: number;      // 8–19 (integer, always > startHour)
  description: string;
  projectIds: string[]; // references Project.id[]
}
