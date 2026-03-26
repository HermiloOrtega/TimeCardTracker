import { useMemo } from 'react';
import type { TimeEntry, Project, CategoryDef } from '../../models/types';
import { getCategoryColor } from '../../utils/colorUtils';

interface BarChartProps {
  entries: TimeEntry[];
  projects: Project[];
  categories: CategoryDef[];
}

const BAR_HEIGHT_PX = 200;
const Y_LABELS      = [0, 2, 4, 6, 8];

export function BarChart({ entries, projects, categories }: BarChartProps) {
  const { dateGroups, maxDayTotal } = useMemo(() => {
    const totals = new Map<string, Map<string, number>>(); // date → projectId → hours

    for (const entry of entries) {
      const hours = entry.endHour - entry.startHour;
      let projMap = totals.get(entry.date);
      if (!projMap) { projMap = new Map(); totals.set(entry.date, projMap); }

      if (entry.projectIds.length === 0) {
        projMap.set('__none__', (projMap.get('__none__') ?? 0) + hours);
      } else {
        for (const pid of entry.projectIds) {
          projMap.set(pid, (projMap.get(pid) ?? 0) + hours);
        }
      }
    }

    const dates = [...totals.keys()].sort();
    let maxTotal = 2; // minimum axis height

    const groups = dates.map(date => {
      const projMap = totals.get(date)!;
      const segments = [...projMap.entries()].map(([projectId, hours]) => ({ projectId, hours }));
      const dayTotal = segments.reduce((s, x) => s + x.hours, 0);
      if (dayTotal > maxTotal) maxTotal = dayTotal;
      return { date, segments, dayTotal };
    });

    return { dateGroups: groups, maxDayTotal: maxTotal };
  }, [entries]);

  if (dateGroups.length === 0) {
    return <div className="analytics-empty">No data for the selected range.</div>;
  }

  // Y-axis: pick nice round max
  const yMax = Math.ceil(maxDayTotal / 2) * 2;
  const yLabels = Array.from({ length: Math.floor(yMax / 2) + 1 }, (_, i) => i * 2);

  function segColor(projectId: string): string {
    if (projectId === '__none__') return '#9E9E9E';
    const proj = projects.find(p => p.id === projectId);
    if (!proj) return '#9E9E9E';
    return getCategoryColor(proj.categoryId, categories);
  }

  function projName(projectId: string): string {
    if (projectId === '__none__') return '(no project)';
    return projects.find(p => p.id === projectId)?.name ?? 'Unknown';
  }

  return (
    <div className="bar-chart">
      {/* Y-axis */}
      <div className="bar-chart__y-axis" style={{ height: `${BAR_HEIGHT_PX}px` }}>
        {yLabels.reverse().map(h => (
          <span key={h} className="bar-chart__y-label"
            style={{ bottom: `${(h / yMax) * BAR_HEIGHT_PX}px` }}>
            {h}h
          </span>
        ))}
      </div>

      {/* Plot area */}
      <div className="bar-chart__scroll">
        <div className="bar-chart__bars">
          {dateGroups.map(({ date, segments, dayTotal }) => (
            <div key={date} className="bar-chart__col">
              <div className="bar-chart__bar-wrap" style={{ height: `${BAR_HEIGHT_PX}px` }}>
                <div
                  className="bar-chart__bar"
                  style={{ height: `${(dayTotal / yMax) * 100}%` }}
                >
                  {[...segments].reverse().map(seg => (
                    <div
                      key={seg.projectId}
                      className="bar-chart__segment"
                      style={{
                        height: `${(seg.hours / dayTotal) * 100}%`,
                        background: segColor(seg.projectId),
                      }}
                      title={`${projName(seg.projectId)}: ${seg.hours}h`}
                    />
                  ))}
                </div>
              </div>
              <div className="bar-chart__x-label">
                {date.slice(5)} {/* MM-DD */}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="bar-chart__legend">
        {projects.filter(p => entries.some(e => e.projectIds.includes(p.id))).map(p => (
          <div key={p.id} className="bar-chart__legend-item">
            <span className="bar-chart__legend-dot" style={{ background: getCategoryColor(p.categoryId, categories) }} />
            {p.name}
          </div>
        ))}
      </div>
    </div>
  );
}
