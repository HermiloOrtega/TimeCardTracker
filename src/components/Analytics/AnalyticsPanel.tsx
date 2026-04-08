import { useState, useMemo } from 'react';
import type { TimeEntry, Project, CategoryDef } from '../../models/types';
import { toDateString, addDays } from '../../utils/dateUtils';
import { BarChart } from './BarChart';
import { Timeline } from './Timeline';
import './AnalyticsPanel.css';

interface AnalyticsPanelProps {
  entries: TimeEntry[];
  projects: Project[];
  categories: CategoryDef[];
  onBack: () => void;
}

type Tab = 'bar' | 'timeline';

function defaultStart(): string {
  return toDateString(addDays(new Date(), -6)); // last 7 days
}

function defaultEnd(): string {
  return toDateString(new Date());
}

export function AnalyticsPanel({ entries, projects, categories, onBack }: AnalyticsPanelProps) {
  const [tab, setTab]           = useState<Tab>('timeline');
  const [startDate, setStart]   = useState(defaultStart);
  const [endDate, setEnd]       = useState(defaultEnd);

  const isValidRange = startDate <= endDate;

  const filteredEntries = useMemo(() => {
    if (!isValidRange) return [];
    return entries.filter(e => e.date >= startDate && e.date <= endDate);
  }, [entries, startDate, endDate, isValidRange]);

  return (
    <div className="analytics-panel">
      <div className="analytics-panel__header">
        <button className="analytics-panel__back" onClick={onBack}>&#8592; Back</button>

        <div className="analytics-panel__range">
          <label className="analytics-panel__range-label">
            From
            <input
              type="date"
              className="analytics-panel__date-input"
              value={startDate}
              max={endDate}
              onChange={e => setStart(e.target.value)}
            />
          </label>
          <label className="analytics-panel__range-label">
            To
            <input
              type="date"
              className="analytics-panel__date-input"
              value={endDate}
              min={startDate}
              onChange={e => setEnd(e.target.value)}
            />
          </label>
        </div>
      </div>

      <div className="analytics-panel__tabs">
        <button
          className={`analytics-panel__tab${tab === 'bar' ? ' analytics-panel__tab--active' : ''}`}
          onClick={() => setTab('bar')}
        >
          Bar Chart
        </button>
        <button
          className={`analytics-panel__tab${tab === 'timeline' ? ' analytics-panel__tab--active' : ''}`}
          onClick={() => setTab('timeline')}
        >
          Timeline
        </button>
      </div>

      <div className="analytics-panel__body">
        {!isValidRange ? (
          <div className="analytics-empty">Start date must be before end date.</div>
        ) : tab === 'bar' ? (
          <>
            <div className="analytics-section">
              <h3 className="analytics-section__title">By Project</h3>
              <BarChart entries={filteredEntries} projects={projects} categories={categories} groupBy="project" />
            </div>
            <div className="analytics-section">
              <h3 className="analytics-section__title">By Category</h3>
              <BarChart entries={filteredEntries} projects={projects} categories={categories} groupBy="category" />
            </div>
          </>
        ) : (
          <>
            <div className="analytics-section">
              <h3 className="analytics-section__title">By Project</h3>
              <Timeline entries={filteredEntries} projects={projects} categories={categories} groupBy="project" />
            </div>
            <div className="analytics-section">
              <h3 className="analytics-section__title">By Category</h3>
              <Timeline entries={filteredEntries} projects={projects} categories={categories} groupBy="category" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
