import { useMemo } from 'react';
import type { TimeEntry, Project, CategoryDef } from '../../models/types';

interface BarChartProps {
  entries: TimeEntry[];
  projects: Project[];
  categories: CategoryDef[];
  groupBy: 'project' | 'category';
}

const BAR_HEIGHT_PX = 180;

export function BarChart({ entries, projects, categories, groupBy }: BarChartProps) {
  const { dateGroups, maxDayTotal, legendItems } = useMemo(() => {
    // Count entries per slot to distribute time fairly
    const slotCount = new Map<string, number>();
    for (const e of entries) {
      const k = `${e.date}:${e.startHour}`;
      slotCount.set(k, (slotCount.get(k) ?? 0) + 1);
    }

    const totals = new Map<string, Map<string, number>>(); // date → groupKey → hours

    for (const entry of entries) {
      const slotShare = 1 / (slotCount.get(`${entry.date}:${entry.startHour}`) ?? 1);

      let groupKeys: string[];
      if (groupBy === 'project') {
        groupKeys = entry.projectIds.length === 0 ? ['__none__'] : entry.projectIds;
      } else {
        if (entry.projectIds.length === 0) {
          groupKeys = ['__none__'];
        } else {
          groupKeys = [...new Set(
            entry.projectIds.map(pid => projects.find(p => p.id === pid)?.categoryId ?? '__none__')
          )];
        }
      }

      const share = slotShare / groupKeys.length;
      let dateMap = totals.get(entry.date);
      if (!dateMap) { dateMap = new Map(); totals.set(entry.date, dateMap); }
      for (const key of groupKeys) {
        dateMap.set(key, (dateMap.get(key) ?? 0) + share);
      }
    }

    const dates = [...totals.keys()].sort();
    let maxTotal = 2;

    const groups = dates.map(date => {
      const map = totals.get(date)!;
      const segments = [...map.entries()].map(([key, hours]) => ({ key, hours }));
      const dayTotal = segments.reduce((s, x) => s + x.hours, 0);
      if (dayTotal > maxTotal) maxTotal = dayTotal;
      return { date, segments, dayTotal };
    });

    const activeKeys = new Set<string>(groups.flatMap(g => g.segments.map(s => s.key)));

    function getColor(key: string): string {
      if (key === '__none__') return '#9E9E9E';
      if (groupBy === 'project') {
        const catId = projects.find(p => p.id === key)?.categoryId;
        return categories.find(c => c.id === catId)?.color ?? '#9E9E9E';
      }
      return categories.find(c => c.id === key)?.color ?? '#9E9E9E';
    }

    const legend = groupBy === 'project'
      ? projects.filter(p => activeKeys.has(p.id)).map(p => ({ key: p.id, label: p.name, color: getColor(p.id) }))
      : categories.filter(c => activeKeys.has(c.id)).map(c => ({ key: c.id, label: c.name, color: c.color }));

    if (activeKeys.has('__none__')) legend.push({ key: '__none__', label: '(unassigned)', color: '#9E9E9E' });

    return { dateGroups: groups, maxDayTotal: maxTotal, legendItems: legend };
  }, [entries, projects, categories, groupBy]);

  if (dateGroups.length === 0) {
    return <div className="analytics-empty">No data for the selected range.</div>;
  }

  const yMax   = Math.max(Math.ceil(maxDayTotal), 2);
  const yStep  = yMax <= 4 ? 1 : 2;
  const yLabels = Array.from({ length: Math.floor(yMax / yStep) + 1 }, (_, i) => i * yStep);

  const fmt      = (h: number) => h % 1 === 0 ? `${h}h` : `${h.toFixed(1)}h`;
  const segColor = (key: string) => legendItems.find(l => l.key === key)?.color ?? '#9E9E9E';
  const segLabel = (key: string) => legendItems.find(l => l.key === key)?.label ?? key;

  return (
    <div className="bar-chart">

      {/* 1 — Legend first */}
      <div className="bar-chart__legend">
        {legendItems.map(item => (
          <div key={item.key} className="bar-chart__legend-item">
            <span className="bar-chart__legend-dot" style={{ background: item.color }} />
            {item.label}
          </div>
        ))}
      </div>

      {/* 2 — Y-axis + bars in same row */}
      <div className="bar-chart__plot">
        <div className="bar-chart__y-axis" style={{ height: BAR_HEIGHT_PX }}>
          {yLabels.map(h => (
            <span key={h} className="bar-chart__y-label" style={{ bottom: `${(h / yMax) * BAR_HEIGHT_PX}px` }}>
              {h}h
            </span>
          ))}
        </div>

        <div className="bar-chart__scroll">
          <div className="bar-chart__bars">
            {dateGroups.map(({ date, segments, dayTotal }) => (
              <div key={date} className="bar-chart__col">
                <div className="bar-chart__bar-wrap" style={{ height: BAR_HEIGHT_PX }}>
                  <div className="bar-chart__bar" style={{ height: `${(dayTotal / yMax) * 100}%` }}>
                    {[...segments].reverse().map(seg => (
                      <div
                        key={seg.key}
                        className="bar-chart__segment"
                        style={{ height: `${(seg.hours / dayTotal) * 100}%`, background: segColor(seg.key) }}
                        title={`${segLabel(seg.key)}: ${fmt(seg.hours)}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="bar-chart__x-label">{date.slice(5)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
