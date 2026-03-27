import { SLOT_HEIGHT_PX } from '../../utils/dateUtils';
import { deriveBlockColor } from '../../utils/colorUtils';
import type { TimeEntry, Project, CategoryDef } from '../../models/types';
import './TimeEntryBlock.css';

interface TimeEntryBlockProps {
  entry: TimeEntry;
  firstHour: number;
  projects: Project[];
  categories: CategoryDef[];
  onClick: (entry: TimeEntry) => void;
}

export function TimeEntryBlock({ entry, firstHour, projects, categories, onClick }: TimeEntryBlockProps) {
  const top    = (entry.startHour - firstHour) * SLOT_HEIGHT_PX;
  const height = (entry.endHour - entry.startHour) * SLOT_HEIGHT_PX;
  const color  = deriveBlockColor(entry.projectIds, projects, categories);

  const projectNames = projects
    .filter(p => entry.projectIds.includes(p.id))
    .map(p => p.name)
    .join(', ');

  return (
    <div
      className="entry-block"
      style={{ top: `${top}px`, height: `${height - 2}px`, background: color }}
      onClick={e => { e.stopPropagation(); onClick(entry); }}
      title={`${entry.description}${projectNames ? ` — ${projectNames}` : ''}`}
    >
      <span className="entry-block__desc">{entry.description}</span>
      {projectNames && <span className="entry-block__projects">{projectNames}</span>}
    </div>
  );
}
