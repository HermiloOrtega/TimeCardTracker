import { useMemo, useState } from 'react';
import type { TimeEntry, Project, CategoryDef } from '../../models/types';
import { toDateString } from '../../utils/dateUtils';
import { getCategoryColor } from '../../utils/colorUtils';
import './TimeDistribution.css';

interface TimeDistributionProps {
  entries: TimeEntry[];
  projects: Project[];
  categories: CategoryDef[];
  days: Date[];
}

function formatHours(h: number): string {
  const rounded = Math.round(h * 10) / 10;
  return `${rounded}h`;
}

export function TimeDistribution({ entries, projects, categories, days }: TimeDistributionProps) {
  const [collapsed, setCollapsed] = useState(false);

  const weekDateStrings = useMemo(() => new Set(days.map(d => toDateString(d))), [days]);

  const categoryHours = useMemo(() => {
    const weekEntries = entries.filter(e => weekDateStrings.has(e.date));

    // Group single-hour entries by (date, startHour) to split the hour among them
    const slotGroups = new Map<string, TimeEntry[]>();
    for (const e of weekEntries) {
      if (e.endHour - e.startHour === 1) {
        const key = `${e.date}:${e.startHour}`;
        const list = slotGroups.get(key) ?? [];
        list.push(e);
        slotGroups.set(key, list);
      }
    }

    const hours = new Map<string, number>(); // categoryId → hours
    function addHours(catId: string, amount: number) {
      hours.set(catId, (hours.get(catId) ?? 0) + amount);
    }

    for (const e of weekEntries) {
      const duration = e.endHour - e.startHour;
      let effectiveDuration = duration;
      if (duration === 1) {
        const key = `${e.date}:${e.startHour}`;
        const count = slotGroups.get(key)?.length ?? 1;
        effectiveDuration = 1 / count;
      }

      const entryProjects = projects.filter(p => e.projectIds.includes(p.id));
      if (entryProjects.length === 0) {
        addHours('__none__', effectiveDuration);
        continue;
      }

      const catIds = [...new Set(entryProjects.map(p => p.categoryId))];
      const hoursEach = effectiveDuration / catIds.length;
      for (const catId of catIds) {
        addHours(catId, hoursEach);
      }
    }

    return hours;
  }, [entries, projects, weekDateStrings]);

  // Build rows: categories with weeklyHours > 0 first, then others with logged hours
  const rows = useMemo(() => {
    const withTarget = categories
      .filter(c => c.weeklyHours > 0)
      .map(c => ({
        id: c.id,
        name: c.name,
        color: getCategoryColor(c.id, categories),
        logged: categoryHours.get(c.id) ?? 0,
        target: c.weeklyHours,
      }));

    const withTargetIds = new Set(withTarget.map(r => r.id));
    const noTarget = categories
      .filter(c => !withTargetIds.has(c.id) && (categoryHours.get(c.id) ?? 0) > 0)
      .map(c => ({
        id: c.id,
        name: c.name,
        color: getCategoryColor(c.id, categories),
        logged: categoryHours.get(c.id) ?? 0,
        target: null as number | null,
      }));

    return [...withTarget, ...noTarget];
  }, [categories, categoryHours]);

  const totalTarget = useMemo(
    () => categories.reduce((s, c) => s + c.weeklyHours, 0),
    [categories]
  );

  const totalLogged = useMemo(
    () => Array.from(categoryHours.values()).reduce((s, v) => s + v, 0),
    [categoryHours]
  );

  // Work-only summary: exclude categories marked as personal
  const workTarget = useMemo(
    () => categories.filter(c => !c.isPersonal).reduce((s, c) => s + (Number(c.weeklyHours) || 0), 0),
    [categories]
  );

  const workLogged = useMemo(() => {
    const personalIds = new Set(categories.filter(c => c.isPersonal).map(c => c.id));
    return Array.from(categoryHours.entries())
      .filter(([id]) => !personalIds.has(id))
      .reduce((s, [, v]) => s + v, 0);
  }, [categories, categoryHours]);

  const weekLabel = useMemo(() => {
    if (days.length === 0) return '';
    const first = days[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const last = days[days.length - 1].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return days.length === 1 ? first : `${first} – ${last}`;
  }, [days]);

  const workSummary = useMemo(() => {
    if (!workTarget || isNaN(workTarget) || workTarget <= 0) return null;
    const isOver = workLogged > workTarget;
    return { label: `${formatHours(workLogged)} / ${formatHours(workTarget)}`, isOver };
  }, [workLogged, workTarget]);

  return (
    <div className="time-dist">
      <div className={`time-dist__header${collapsed ? ' time-dist__header--collapsed' : ''}`}>
        <span className="time-dist__title">Time Distribution</span>
        {workSummary && (
          <span className={`time-dist__work-summary${workSummary.isOver ? ' time-dist__work-summary--over' : ''}`}>
            ({workSummary.label})
          </span>
        )}
        <button
          className="time-dist__toggle"
          onClick={() => setCollapsed(c => !c)}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          <svg
            className={`time-dist__toggle-chevron${!collapsed ? ' time-dist__toggle-chevron--down' : ''}`}
            viewBox="0 0 10 6"
            width="10"
            height="6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="0,5 5,1 10,5" />
          </svg>
        </button>
        <span className="time-dist__week-label">{weekLabel}</span>
      </div>

      {!collapsed && (
        <>
          <div className="time-dist__rows">
            {rows.map(row => {
              const pct = row.target != null && row.target > 0 ? Math.min(row.logged / row.target, 1) : 0;
              const over = row.target != null && row.target > 0 && row.logged > row.target;
              const warn = row.target != null && row.target > 0 && !over && row.logged / row.target >= 0.75;
              const excess = over && row.target != null ? row.logged - row.target : 0;

              let barClass = 'time-dist__bar-track';
              if (over) barClass += ' time-dist__bar-track--over';
              else if (warn) barClass += ' time-dist__bar-track--warn';

              return (
                <div key={row.id} className="time-dist__row">
                  <div className="time-dist__row-meta">
                    <span className="time-dist__dot" style={{ background: row.color }} />
                    <span className="time-dist__cat-name">{row.name}</span>
                    <span className="time-dist__hours">
                      {formatHours(row.logged)}
                      {row.target != null && row.target > 0 && (
                        <> / <span className={over ? 'time-dist__hours--over' : ''}>{formatHours(row.target)}</span></>
                      )}
                      {over && (
                        <span className="time-dist__excess"> (+{formatHours(excess)} over)</span>
                      )}
                    </span>
                  </div>
                  {row.target != null && row.target > 0 && (
                    <div className={barClass}>
                      <div
                        className="time-dist__bar-fill"
                        style={{ width: `${pct * 100}%`, background: row.color }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {totalTarget > 0 && (
            <div className="time-dist__footer">
              <span>Total this week:</span>
              <span className={totalLogged > totalTarget ? 'time-dist__hours--over' : ''}>
                {formatHours(totalLogged)} / {formatHours(totalTarget)}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
