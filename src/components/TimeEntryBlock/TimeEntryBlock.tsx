import { SLOT_HEIGHT_PX } from '../../utils/dateUtils';
import { deriveBlockColor } from '../../utils/colorUtils';
import type { TimeEntry, Project, CategoryDef } from '../../models/types';
import './TimeEntryBlock.css';

interface TimeEntryBlockProps {
  entry: TimeEntry;
  firstHour: number;
  column?: number;
  totalColumns?: number;
  projects: Project[];
  categories: CategoryDef[];
  onClick: (entry: TimeEntry) => void;
}

export function TimeEntryBlock({ entry, firstHour, column = 0, totalColumns = 1, projects, categories, onClick }: TimeEntryBlockProps) {
  const top      = (entry.startHour - firstHour) * SLOT_HEIGHT_PX;
  const height   = (entry.endHour - entry.startHour) * SLOT_HEIGHT_PX;
  const color    = deriveBlockColor(entry.projectIds, projects, categories);
  const duration = entry.endHour - entry.startHour;

  const projectNames = projects
    .filter(p => entry.projectIds.includes(p.id))
    .map(p => p.name)
    .join(', ');

  function handleDragStart(e: React.DragEvent) {
    e.stopPropagation();
    e.dataTransfer.setData('entryId', entry.id);
    e.dataTransfer.setData('entryDuration', String(duration));
    e.dataTransfer.effectAllowed = 'move';
  }

  return (
    <div
      className="entry-block"
      style={{
        top: `${top}px`,
        height: `${height - 2}px`,
        background: color,
        left: `calc(${column} * 100% / ${totalColumns})`,
        width: `calc(100% / ${totalColumns})`,
      }}
      draggable
      onDragStart={handleDragStart}
      onClick={e => { e.stopPropagation(); onClick(entry); }}
      title={`${entry.description}${projectNames ? ` — ${projectNames}` : ''}`}
    >
      <span className="entry-block__desc">{entry.description}</span>
      {projectNames && <span className="entry-block__projects">{projectNames}</span>}
    </div>
  );
}
