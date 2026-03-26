import type { ViewMode } from '../../models/types';
import './Toolbar.css';

interface ToolbarProps {
  viewMode: ViewMode;
  dateRangeLabel: string;
  isAnalyticsActive: boolean;
  onViewChange: (mode: ViewMode) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onAddProjectsClick: () => void;
  onAnalyticsClick: () => void;
  onExportClick: () => void;
}

const VIEW_OPTIONS: { mode: ViewMode; label: string }[] = [
  { mode: 'week-with-weekends',    label: 'Week' },
  { mode: 'week-without-weekends', label: 'Work Week' },
  { mode: 'daily',                 label: 'Day' },
];

export function Toolbar({
  viewMode,
  dateRangeLabel,
  isAnalyticsActive,
  onViewChange,
  onPrev,
  onNext,
  onToday,
  onAddProjectsClick,
  onAnalyticsClick,
  onExportClick,
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
          + Add Projects
        </button>
      </div>
    </div>
  );
}
