import type { TimeEntry, Project, CategoryDef } from '../../models/types';
import { TimeGrid } from '../TimeGrid/TimeGrid';

interface WeekViewProps {
  days: Date[];
  hourSlots: number[];
  entries: TimeEntry[];
  projects: Project[];
  categories: CategoryDef[];
  onSlotClick: (date: string, hour: number) => void;
  onEntryClick: (entry: TimeEntry) => void;
  onTodoDrop?: (todoId: string, date: string, hour: number) => void;
}

export function WeekView({ days, hourSlots, entries, projects, categories, onSlotClick, onEntryClick, onTodoDrop }: WeekViewProps) {
  return (
    <TimeGrid
      days={days}
      hourSlots={hourSlots}
      entries={entries}
      projects={projects}
      categories={categories}
      onSlotClick={onSlotClick}
      onEntryClick={onEntryClick}
      onTodoDrop={onTodoDrop}
    />
  );
}
