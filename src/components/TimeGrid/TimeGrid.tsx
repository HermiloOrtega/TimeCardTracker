import { useMemo, useState, useEffect } from 'react';
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
  onEntryDrop?: (entryId: string, date: string, hour: number) => void;
}

interface SlotStripProps {
  entry: TimeEntry;
  count: number;       // total entries in this slot
  projects: Project[];
  categories: CategoryDef[];
  onClick: (entry: TimeEntry) => void;
}

/**
 * Greedy column-assignment for multi-hour entries in a single day column.
 * Returns a map of entryId → { col, totalCols } so overlapping blocks
 * can be tiled side-by-side at equal widths.
 */
function assignColumnLayout(entries: TimeEntry[]): Map<string, { col: number; totalCols: number }> {
  const layout = new Map<string, { col: number; totalCols: number }>();
  if (entries.length === 0) return layout;

  const sorted = [...entries].sort((a, b) => a.startHour - b.startHour);
  const colEnds: number[] = [];          // end hour of the last entry in each column
  const entryCol = new Map<string, number>();

  for (const e of sorted) {
    const col = colEnds.findIndex(endH => endH <= e.startHour);
    const assignedCol = col === -1 ? colEnds.length : col;
    entryCol.set(e.id, assignedCol);
    colEnds[assignedCol] = e.endHour;
  }

  const totalCols = colEnds.length;
  for (const e of sorted) {
    layout.set(e.id, { col: entryCol.get(e.id)!, totalCols });
  }
  return layout;
}

function SlotStrip({ entry, count, projects, categories, onClick }: SlotStripProps) {
  const color = deriveBlockColor(entry.projectIds, projects, categories);
  const names = projects
    .filter(p => entry.projectIds.includes(p.id))
    .map(p => p.name)
    .join(', ');

  function handleDragStart(e: React.DragEvent) {
    e.stopPropagation();
    e.dataTransfer.setData('entryId', entry.id);
    e.dataTransfer.setData('entryDuration', '1');
    e.dataTransfer.effectAllowed = 'move';
  }

  return (
    <div
      className="time-grid__strip"
      style={{
        borderLeftColor: color,
        // vertical: equal height rows; after 3 entries overflow-y scrolls
        width: '100%',
        flex: count <= 3 ? '1' : `0 0 ${Math.floor(SLOT_HEIGHT_PX / 3) - 2}px`,
      }}
      draggable
      onDragStart={handleDragStart}
      onClick={e => { e.stopPropagation(); onClick(entry); }}
      title={`${entry.description}${names ? ` — ${names}` : ''}`}
    >
      <span className="time-grid__strip-desc">{entry.description}</span>
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
  onEntryDrop,
}: TimeGridProps) {
  const [hoveredSlot, setHoveredSlot]   = useState<{ date: string; hour: number } | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<{ date: string; hour: number } | null>(null);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const firstHour  = hourSlots[0];
  const totalSlots = hourSlots.length;

  const todayStr = toDateString(new Date());
  const todayVisible = days.some(d => toDateString(d) === todayStr);
  const nowTopPercent = (now.getHours() + now.getMinutes() / 60 - firstHour) / totalSlots * 100;
  const showNowLine = todayVisible && nowTopPercent >= 0 && nowTopPercent <= 100;
  const acceptsDrop = !!(onTodoDrop || onEntryDrop);

  const entriesByDate = useMemo(() => {
    const map = new Map<string, TimeEntry[]>();
    for (const entry of entries) {
      const list = map.get(entry.date) ?? [];
      list.push(entry);
      map.set(entry.date, list);
    }
    return map;
  }, [entries]);

  function handleDrop(e: React.DragEvent, dateStr: string, hour: number) {
    e.preventDefault();
    setDragOverSlot(null);
    const todoId  = e.dataTransfer.getData('todoId');
    const entryId = e.dataTransfer.getData('entryId');
    if (todoId  && onTodoDrop)  onTodoDrop(todoId, dateStr, hour);
    if (entryId && onEntryDrop) onEntryDrop(entryId, dateStr, hour);
  }

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
      <div className="time-grid__body">
        {/* Time gutter */}
        <div className="time-grid__time-gutter">
          {hourSlots.map(hour => (
            <div key={hour} className="time-grid__time-label">
              {formatHour(hour)}
            </div>
          ))}
        </div>

        {/* Day columns */}
        {days.map(day => {
          const dateStr    = toDateString(day);
          const dayEntries = entriesByDate.get(dateStr) ?? [];
          const weekend    = isWeekend(day);

          // Separate single-hour (go into slot rows) from multi-hour (absolutely positioned)
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

          // Column layout for overlapping multi-hour blocks
          const columnLayout = assignColumnLayout(multiHour);

          const isToday = dateStr === todayStr;

          return (
            <div
              key={dateStr}
              className={`time-grid__day-col${weekend ? ' time-grid__day-col--weekend' : ''}`}
            >
              {/* Now line — only on today's column */}
              {isToday && showNowLine && (
                <div
                  className="time-grid__now-line"
                  style={{ top: `${nowTopPercent}%` }}
                  aria-hidden="true"
                >
                  <span className="time-grid__now-dot" />
                </div>
              )}

              {/* Slot rows (single-hour entries side-by-side) */}
              {hourSlots.map(hour => {
                const strips     = singleHour.get(hour) ?? [];
                const count      = strips.length;
                const isHovered  = hoveredSlot?.date === dateStr && hoveredSlot?.hour === hour;
                const isDragOver = dragOverSlot?.date === dateStr && dragOverSlot?.hour === hour;

                return (
                  <div
                    key={hour}
                    className={[
                      'time-grid__slot',
                      isHovered  ? 'time-grid__slot--hovered'   : '',
                      isDragOver ? 'time-grid__slot--drag-over' : '',
                      count > 0  ? 'time-grid__slot--has-entries' : '',
                    ].join(' ').trim()}
                    onMouseEnter={() => setHoveredSlot({ date: dateStr, hour })}
                    onMouseLeave={() => setHoveredSlot(null)}
                    onClick={() => onSlotClick(dateStr, hour)}
                    onDragOver={acceptsDrop ? e => { e.preventDefault(); setDragOverSlot({ date: dateStr, hour }); } : undefined}
                    onDragLeave={acceptsDrop ? () => setDragOverSlot(null) : undefined}
                    onDrop={acceptsDrop ? e => handleDrop(e, dateStr, hour) : undefined}
                  >
                    {/* "+" add button — always on top via z-index */}
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

                    {/* Side-by-side strips in scrollable inner row */}
                    <div className="time-grid__slot-strips">
                      {strips.map(entry => (
                        <SlotStrip
                          key={entry.id}
                          entry={entry}
                          count={count}
                          projects={projects}
                          categories={categories}
                          onClick={onEntryClick}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Multi-hour blocks — absolutely positioned, tiled by column */}
              {multiHour.map(entry => {
                const { col, totalCols } = columnLayout.get(entry.id) ?? { col: 0, totalCols: 1 };
                return (
                  <TimeEntryBlock
                    key={entry.id}
                    entry={entry}
                    firstHour={firstHour}
                    totalSlots={totalSlots}
                    column={col}
                    totalColumns={totalCols}
                    projects={projects}
                    categories={categories}
                    onClick={onEntryClick}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
