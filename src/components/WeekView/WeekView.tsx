import type { TimeEntry, Project, CategoryDef } from '../../models/types';
import { TimeGrid } from '../TimeGrid/TimeGrid';

interface WeekViewProps {
  days: Date[];
  entries: TimeEntry[];
  projects: Project[];
  categories: CategoryDef[];
  onSlotClick: (date: string, hour: number) => void;
  onEntryClick: (entry: TimeEntry) => void;
}

export function WeekView({ days, entries, projects, categories, onSlotClick, onEntryClick }: WeekViewProps) {
  return (
    <TimeGrid
      days={days}
      entries={entries}
      projects={projects}
      categories={categories}
      onSlotClick={onSlotClick}
      onEntryClick={onEntryClick}
    />
  );
}
