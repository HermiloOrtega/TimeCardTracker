import type { TimeEntry, Project, CategoryDef } from '../../models/types';
import { TimeGrid } from '../TimeGrid/TimeGrid';

interface DailyViewProps {
  day: Date;
  hourSlots: number[];
  entries: TimeEntry[];
  projects: Project[];
  categories: CategoryDef[];
  onSlotClick: (date: string, hour: number) => void;
  onEntryClick: (entry: TimeEntry) => void;
  onTodoDrop?: (todoId: string, date: string, hour: number) => void;
  onEntryDrop?: (entryId: string, date: string, hour: number) => void;
}

export function DailyView({ day, hourSlots, entries, projects, categories, onSlotClick, onEntryClick, onTodoDrop, onEntryDrop }: DailyViewProps) {
  return (
    <TimeGrid
      days={[day]}
      hourSlots={hourSlots}
      entries={entries}
      projects={projects}
      categories={categories}
      onSlotClick={onSlotClick}
      onEntryClick={onEntryClick}
      onTodoDrop={onTodoDrop}
      onEntryDrop={onEntryDrop}
    />
  );
}
