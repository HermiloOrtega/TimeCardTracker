import { useMemo, useState } from 'react';
import type { TimeEntry, Project, CategoryDef } from '../../models/types';
import {
  SLOT_HEIGHT_PX,
  toDateString,
  formatHour,
  formatDayHeader,
  isWeekend,
} from '../../utils/dateUtils';
import { deriveBlockColor } from '../../utils/colorUtils';
import { TimeEntryBlock } from '../TimeEntryBlock/TimeEntryBlock';
import './TimeGrid.css';

interface TimeGridProps {
  days: Date[];
  hourSlots: number[];
  entries: TimeEntry[];
  projects: Project[];
  categories: CategoryDef[];
  onSlotClick: (date: string, hour: number) => void;
  onEntryClick: (entry: TimeEntry) => void;
  onTodoDrop?: (todoId: string, date: string, hour: number) => void;
}

interface SlotStripProps {
  entry: TimeEntry;
  projects: Project[];
  categories: CategoryDef[];
  onClick: (entry: TimeEntry) => void;
}

function SlotStrip({ entry, projects, categories, onClick }: SlotStripProps) {
  const color = deriveBlockColor(entry.projectIds, projects, categories);
  const names = projects
    .filter(p => entry.projectIds.includes(p.id))
    .map(p => p.name)
    .join(', ');

  return (
    <div
      className="time-grid__strip"
      style={{ borderLeftColor: color }}
      onClick={e => { e.stopPropagation(); onClick(entry); }}
      title={`${entry.description}${names ? ` — ${names}` : ''}`}
    >
      <span className="time-grid__strip-desc">{entry.description}</span>
      {names && <span className="time-grid__strip-projects">{names}</span>}
    </div>
  );
}

export function TimeGrid({
  days,
  hourSlots,
  entries,
  projects,
  categories,
  onSlotClick,
  onEntryClick,
  onTodoDrop,
}: TimeGridProps) {
  const [hoveredSlot, setHoveredSlot]   = useState<{ date: string; hour: number } | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<{ date: string; hour: number } | null>(null);

  const firstHour = hourSlots[0];

  const entriesByDate = useMemo(() => {
    const map = new Map<string, TimeEntry[]>();
    for (const entry of entries) {
      const list = map.get(entry.date) ?? [];
      list.push(entry);
      map.set(entry.date, list);
    }
    return map;
  }, [entries]);

  const totalHeight = hourSlots.length * SLOT_HEIGHT_PX;

  return (
    <div className="time-grid">
      {/* Header */}
      <div className="time-grid__header">
        <div className="time-grid__time-gutter" />
        {days.map(day => {
          const { weekday, date, isToday } = formatDayHeader(day);
          const weekend = isWeekend(day);
          return (
            <div
              key={toDateString(day)}
              className={`time-grid__day-header${isToday ? ' time-grid__day-header--today' : ''}${weekend ? ' time-grid__day-header--weekend' : ''}`}
            >
              <span className="time-grid__weekday">{weekday}</span>
              <span className={`time-grid__date-num${isToday ? ' time-grid__date-num--today' : ''}`}>
                {date}
              </span>
            </div>
          );
        })}
      </div>

      {/* Scrollable body */}
      <div className="time-grid__body" style={{ height: `${totalHeight}px` }}>
        {/* Time gutter */}
        <div className="time-grid__time-gutter">
          {hourSlots.map(hour => (
            <div key={hour} className="time-grid__time-label" style={{ height: `${SLOT_HEIGHT_PX}px` }}>
              {formatHour(hour)}
            </div>
          ))}
        </div>

        {/* Day columns */}
        {days.map(day => {
          const dateStr    = toDateString(day);
          const dayEntries = entriesByDate.get(dateStr) ?? [];
          const weekend    = isWeekend(day);

          const singleHour = new Map<number, TimeEntry[]>();
          const multiHour: TimeEntry[] = [];

          for (const entry of dayEntries) {
            if (entry.endHour - entry.startHour === 1) {
              const list = singleHour.get(entry.startHour) ?? [];
              list.push(entry);
              singleHour.set(entry.startHour, list);
            } else {
              multiHour.push(entry);
            }
          }

          return (
            <div
              key={dateStr}
              className={`time-grid__day-col${weekend ? ' time-grid__day-col--weekend' : ''}`}
              style={{ height: `${totalHeight}px` }}
            >
              {/* Slot rows */}
              {hourSlots.map(hour => {
                const strips      = singleHour.get(hour) ?? [];
                const isHovered   = hoveredSlot?.date === dateStr && hoveredSlot?.hour === hour;
                const isDragOver  = dragOverSlot?.date === dateStr && dragOverSlot?.hour === hour;

                return (
                  <div
                    key={hour}
                    className={[
                      'time-grid__slot',
                      isHovered  ? 'time-grid__slot--hovered'   : '',
                      isDragOver ? 'time-grid__slot--drag-over' : '',
                    ].join(' ').trim()}
                    style={{ height: `${SLOT_HEIGHT_PX}px` }}
                    onMouseEnter={() => setHoveredSlot({ date: dateStr, hour })}
                    onMouseLeave={() => setHoveredSlot(null)}
                    onClick={() => onSlotClick(dateStr, hour)}
                    onDragOver={onTodoDrop ? e => { e.preventDefault(); setDragOverSlot({ date: dateStr, hour }); } : undefined}
                    onDragLeave={onTodoDrop ? () => setDragOverSlot(null) : undefined}
                    onDrop={onTodoDrop ? e => {
                      e.preventDefault();
                      setDragOverSlot(null);
                      const todoId = e.dataTransfer.getData('todoId');
                      if (todoId) onTodoDrop(todoId, dateStr, hour);
                    } : undefined}
                  >
                    {isHovered && !isDragOver && (
                      <button
                        className="time-grid__slot-add-btn"
                        onClick={e => { e.stopPropagation(); onSlotClick(dateStr, hour); }}
                        aria-label="Add entry"
                        title="Add entry"
                      >
                        +
                      </button>
                    )}
                    {strips.map(entry => (
                      <SlotStrip
                        key={entry.id}
                        entry={entry}
                        projects={projects}
                        categories={categories}
                        onClick={onEntryClick}
                      />
                    ))}
                  </div>
                );
              })}

              {/* Multi-hour blocks */}
              {multiHour.map(entry => (
                <TimeEntryBlock
                  key={entry.id}
                  entry={entry}
                  firstHour={firstHour}
                  projects={projects}
                  categories={categories}
                  onClick={onEntryClick}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
