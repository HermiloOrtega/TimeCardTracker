import { useMemo } from 'react';
import type { TimeEntry, Project, CategoryDef } from '../../models/types';

interface TimelineProps {
  entries: TimeEntry[];
  projects: Project[];
  categories: CategoryDef[];
  groupBy: 'project' | 'category';
}

export function Timeline({ entries, projects, categories, groupBy }: TimelineProps) {
  const { rows, dates, cellMap, maxPerRow, totalsPerRow, totalsPerDate, grandTotal } = useMemo(() => {
    // Count entries per slot to split time fairly
    const slotCount = new Map<string, number>();
    for (const e of entries) {
      const k = `${e.date}:${e.startHour}`;
      slotCount.set(k, (slotCount.get(k) ?? 0) + 1);
    }

    const cellAccum = new Map<string, number>(); // 'rowKey:date' → hours
    const dateSet   = new Set<string>();

    for (const entry of entries) {
      dateSet.add(entry.date);
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
      for (const key of groupKeys) {
        const cell = `${key}:${entry.date}`;
        cellAccum.set(cell, (cellAccum.get(cell) ?? 0) + share);
      }
    }

    const sortedDates = [...dateSet].sort();

    // Build row list
    const activeKeys = new Set<string>();
    for (const [cell] of cellAccum) activeKeys.add(cell.split(':')[0]);

    let rowItems: { id: string; name: string; color: string }[] = [];
    if (groupBy === 'project') {
      rowItems = projects
        .filter(p => activeKeys.has(p.id))
        .map(p => ({ id: p.id, name: p.name, color: categories.find(c => c.id === p.categoryId)?.color ?? '#9E9E9E' }));
      if (activeKeys.has('__none__')) rowItems.push({ id: '__none__', name: '(unassigned)', color: '#9E9E9E' });
    } else {
      rowItems = categories
        .filter(c => activeKeys.has(c.id))
        .map(c => ({ id: c.id, name: c.name, color: c.color }));
      if (activeKeys.has('__none__')) rowItems.push({ id: '__none__', name: '(unassigned)', color: '#9E9E9E' });
    }

    // Max per row (for opacity scaling)
    const maxPerRow = new Map<string, number>();
    for (const [cell, hours] of cellAccum) {
      const key = cell.split(':')[0];
      maxPerRow.set(key, Math.max(maxPerRow.get(key) ?? 0, hours));
    }

    // Totals per row (sum across all dates)
    const totalsPerRow = new Map<string, number>();
    for (const row of rowItems) {
      totalsPerRow.set(row.id, sortedDates.reduce((s, d) => s + (cellAccum.get(`${row.id}:${d}`) ?? 0), 0));
    }

    // Totals per date (sum across all rows)
    const totalsPerDate = new Map<string, number>();
    for (const d of sortedDates) {
      totalsPerDate.set(d, rowItems.reduce((s, r) => s + (cellAccum.get(`${r.id}:${d}`) ?? 0), 0));
    }

    const grandTotal = [...totalsPerDate.values()].reduce((s, v) => s + v, 0);

    return { rows: rowItems, dates: sortedDates, cellMap: cellAccum, maxPerRow, totalsPerRow, totalsPerDate, grandTotal };
  }, [entries, projects, categories, groupBy]);

  if (dates.length === 0 || rows.length === 0) {
    return <div className="analytics-empty">No data for the selected range.</div>;
  }

  const fmt = (h: number) => h === 0 ? '' : h % 1 === 0 ? `${h}h` : `${h.toFixed(1)}h`;

  return (
    <div className="timeline-wrap">
      <div className="timeline">

        {/* Header row */}
        <div className="timeline__row">
          <div className="timeline__label-cell timeline__label-cell--header">
            {groupBy === 'project' ? 'Project' : 'Category'}
          </div>
          {dates.map(d => (
            <div key={d} className="timeline__date-cell">{d.slice(5)}</div>
          ))}
          <div className="timeline__date-cell timeline__date-cell--total">Total</div>
        </div>

        {/* Data rows */}
        {rows.map(row => {
          const maxH     = maxPerRow.get(row.id) ?? 1;
          const rowTotal = totalsPerRow.get(row.id) ?? 0;
          return (
            <div key={row.id} className="timeline__row">
              <div className="timeline__label-cell" title={row.name}>{row.name}</div>
              {dates.map(d => {
                const hours   = cellMap.get(`${row.id}:${d}`) ?? 0;
                const opacity = hours > 0 ? Math.min(0.25 + (hours / maxH) * 0.75, 1) : 1;
                return (
                  <div
                    key={d}
                    className={`timeline__cell${hours > 0 ? ' timeline__cell--active' : ''}`}
                    style={{ background: hours > 0 ? row.color : undefined, opacity: hours > 0 ? opacity : 1 }}
                    title={hours > 0 ? `${row.name} · ${d}: ${fmt(hours)}` : undefined}
                  >
                    {hours > 0 && <span className="timeline__cell-label">{fmt(hours)}</span>}
                  </div>
                );
              })}
              {/* Row total */}
              <div className="timeline__cell timeline__cell--total">
                {rowTotal > 0 && <span className="timeline__cell-label timeline__cell-label--total">{fmt(rowTotal)}</span>}
              </div>
            </div>
          );
        })}

        {/* Totals row */}
        <div className="timeline__row timeline__row--total">
          <div className="timeline__label-cell timeline__label-cell--total">Total</div>
          {dates.map(d => {
            const total = totalsPerDate.get(d) ?? 0;
            return (
              <div key={d} className="timeline__cell timeline__cell--total">
                {total > 0 && <span className="timeline__cell-label timeline__cell-label--total">{fmt(total)}</span>}
              </div>
            );
          })}
          <div className="timeline__cell timeline__cell--total timeline__cell--grand">
            <span className="timeline__cell-label timeline__cell-label--total">{fmt(grandTotal)}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
