import { useMemo } from 'react';
import type { TimeEntry, Project, CategoryDef } from '../../models/types';
import { getCategoryColor } from '../../utils/colorUtils';

interface TimelineProps {
  entries: TimeEntry[];
  projects: Project[];
  categories: CategoryDef[];
}

export function Timeline({ entries, projects, categories }: TimelineProps) {
  const { activeProjects, dates, cellMap, maxPerProject } = useMemo(() => {
    const dateSet = new Set<string>();
    const cellAccum = new Map<string, number>(); // 'projId:date' → hours

    for (const entry of entries) {
      dateSet.add(entry.date);
      const hours = entry.endHour - entry.startHour;

      if (entry.projectIds.length === 0) {
        const key = `__none__:${entry.date}`;
        cellAccum.set(key, (cellAccum.get(key) ?? 0) + hours);
      } else {
        for (const pid of entry.projectIds) {
          const key = `${pid}:${entry.date}`;
          cellAccum.set(key, (cellAccum.get(key) ?? 0) + hours);
        }
      }
    }

    const sortedDates = [...dateSet].sort();

    // Active projects = those with any activity in range
    const activeProjIds = new Set<string>();
    for (const entry of entries) {
      if (entry.projectIds.length === 0) activeProjIds.add('__none__');
      else entry.projectIds.forEach(pid => activeProjIds.add(pid));
    }
    const activeProjs = projects.filter(p => activeProjIds.has(p.id));
    if (activeProjIds.has('__none__')) {
      activeProjs.push({ id: '__none__', name: '(no project)', categoryId: '' });
    }

    // Max hours per project (for opacity scaling)
    const maxPerProj = new Map<string, number>();
    for (const [key, hours] of cellAccum) {
      const [pid] = key.split(':');
      maxPerProj.set(pid, Math.max(maxPerProj.get(pid) ?? 0, hours));
    }

    return {
      activeProjects: activeProjs,
      dates: sortedDates,
      cellMap: cellAccum,
      maxPerProject: maxPerProj,
    };
  }, [entries, projects]);

  if (dates.length === 0 || activeProjects.length === 0) {
    return <div className="analytics-empty">No data for the selected range.</div>;
  }

  return (
    <div className="timeline-wrap">
      <div className="timeline">
        {/* Header */}
        <div className="timeline__row">
          <div className="timeline__label-cell timeline__label-cell--header">Project</div>
          {dates.map(d => (
            <div key={d} className="timeline__date-cell">{d.slice(5)}</div>
          ))}
        </div>

        {/* Rows */}
        {activeProjects.map(proj => {
          const color = proj.id === '__none__' ? '#9E9E9E' : getCategoryColor(proj.categoryId, categories);
          const maxH  = maxPerProject.get(proj.id) ?? 1;

          return (
            <div key={proj.id} className="timeline__row">
              <div className="timeline__label-cell" title={proj.name}>{proj.name}</div>
              {dates.map(d => {
                const hours = cellMap.get(`${proj.id}:${d}`) ?? 0;
                const opacity = hours > 0 ? Math.min(0.25 + (hours / maxH) * 0.75, 1) : 1;
                return (
                  <div
                    key={d}
                    className={`timeline__cell${hours > 0 ? ' timeline__cell--active' : ''}`}
                    style={{ background: hours > 0 ? color : undefined, opacity: hours > 0 ? opacity : 1 }}
                    title={hours > 0 ? `${proj.name} on ${d}: ${hours}h` : undefined}
                  >
                    {hours > 0 && <span className="timeline__cell-label">{hours}h</span>}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
