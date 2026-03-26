import type { TimeEntry, Project, CategoryDef } from '../../models/types';
import { TimeGrid } from '../TimeGrid/TimeGrid';

interface DailyViewProps {
  day: Date;
  entries: TimeEntry[];
  projects: Project[];
  categories: CategoryDef[];
  onSlotClick: (date: string, hour: number) => void;
  onEntryClick: (entry: TimeEntry) => void;
}

export function DailyView({ day, entries, projects, categories, onSlotClick, onEntryClick }: DailyViewProps) {
  return (
    <TimeGrid
      days={[day]}
      entries={entries}
      projects={projects}
      categories={categories}
      onSlotClick={onSlotClick}
      onEntryClick={onEntryClick}
    />
  );
}
