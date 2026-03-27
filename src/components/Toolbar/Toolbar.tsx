import type { ViewMode, Theme, TimeRange } from '../../models/types';
import './Toolbar.css';

interface ToolbarProps {
  viewMode: ViewMode;
  dateRangeLabel: string;
  isAnalyticsActive: boolean;
  theme: Theme;
  timeRange: TimeRange;
  onViewChange: (mode: ViewMode) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onAddProjectsClick: () => void;
  onAnalyticsClick: () => void;
  onExportClick: () => void;
  onToggleTheme: () => void;
  onTimeRangeChange: (range: TimeRange) => void;
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

export function Toolbar({
  viewMode,
  dateRangeLabel,
  isAnalyticsActive,
  theme,
  timeRange,
  onViewChange,
  onPrev,
  onNext,
  onToday,
  onAddProjectsClick,
  onAnalyticsClick,
  onExportClick,
  onToggleTheme,
  onTimeRangeChange,
}: ToolbarProps) {
  return (
    <div className="toolbar">
      <div className="toolbar__left">
        {!isAnalyticsActive && (
          <>
            <button className="toolbar__btn toolbar__btn--primary" onClick={onToday}>Today</button>
            <button className="toolbar__btn toolbar__btn--icon" onClick={onPrev} aria-label="Previous">&#8249;</button>
            <button className="toolbar__btn toolbar__btn--icon" onClick={onNext} aria-label="Next">&#8250;</button>
            <span className="toolbar__date-label">{dateRangeLabel}</span>
          </>
        )}
        {isAnalyticsActive && <span className="toolbar__date-label">Analytics</span>}
      </div>

      <div className="toolbar__center">
        {!isAnalyticsActive && VIEW_OPTIONS.map(({ mode, label }) => (
          <button
            key={mode}
            className={`toolbar__btn toolbar__view-btn${viewMode === mode ? ' toolbar__view-btn--active' : ''}`}
            onClick={() => onViewChange(mode)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="toolbar__right">
        {/* Time range selector */}
        {!isAnalyticsActive && (
          <select
            className="toolbar__select"
            value={timeRange}
            onChange={e => onTimeRangeChange(e.target.value as TimeRange)}
            title="Time slot range"
            aria-label="Time slot range"
          >
            {TIME_RANGE_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        )}

        {/* Theme toggle */}
        <button
          className="toolbar__btn toolbar__btn--icon toolbar__theme-btn"
          onClick={onToggleTheme}
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          title={theme === 'light' ? 'Dark mode' : 'Light mode'}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        <button
          className={`toolbar__btn${isAnalyticsActive ? ' toolbar__btn--active' : ''}`}
          onClick={onAnalyticsClick}
        >
          Analytics
        </button>
        <button className="toolbar__btn" onClick={onExportClick}>
          Export
        </button>
        <button className="toolbar__btn toolbar__btn--add-projects" onClick={onAddProjectsClick}>
          + Projects
        </button>
      </div>
    </div>
  );
}
