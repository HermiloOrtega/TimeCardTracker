import type { ViewMode, TimeRange } from '../../models/types';
import './CalendarSubHeader.css';

interface CalendarSubHeaderProps {
  viewMode: ViewMode;
  timeRange: TimeRange;
  onViewChange: (mode: ViewMode) => void;
  onTimeRangeChange: (range: TimeRange) => void;
  onExportClick: () => void;
}

const VIEW_OPTIONS: { mode: ViewMode; label: string }[] = [
  { mode: 'week-with-weekends',    label: 'Week' },
  { mode: 'week-without-weekends', label: 'Work Week' },
  { mode: 'daily',                 label: 'Day' },
];

const TIME_RANGE_OPTIONS: { value: TimeRange; label: string }[] = [
  { value: 'work',     label: 'Work Hours (9–5)' },
  { value: 'extended', label: 'Extended (8–6)' },
  { value: 'full',     label: 'Full Day (6am–10pm)' },
];

export function CalendarSubHeader({
  viewMode,
  timeRange,
  onViewChange,
  onTimeRangeChange,
  onExportClick,
}: CalendarSubHeaderProps) {
  return (
    <div className="cal-subheader">
      {/* Col 1 — Time range */}
      <div className="cal-subheader__col cal-subheader__col--left">
        <select
          className="cal-subheader__select"
          value={timeRange}
          onChange={e => onTimeRangeChange(e.target.value as TimeRange)}
          aria-label="Time slot range"
        >
          {TIME_RANGE_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Col 2 — View toggle */}
      <div className="cal-subheader__col cal-subheader__col--center">
        {VIEW_OPTIONS.map(({ mode, label }) => (
          <button
            key={mode}
            className={`cal-subheader__view-btn${viewMode === mode ? ' cal-subheader__view-btn--active' : ''}`}
            onClick={() => onViewChange(mode)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Col 3 — Export */}
      <div className="cal-subheader__col cal-subheader__col--right">
        <button className="cal-subheader__export-btn" onClick={onExportClick}>
          <svg className="cal-subheader__export-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <rect x="2" y="2" width="16" height="16" rx="2" fill="#217346"/>
            <text x="10" y="14" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fff">XLS</text>
          </svg>
          Export
        </button>
      </div>
    </div>
  );
}
