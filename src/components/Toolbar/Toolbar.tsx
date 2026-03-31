import './Toolbar.css';

interface ToolbarProps {
  dateRangeLabel: string;
  isAnalyticsActive: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onAddTaskClick: () => void;
  onAddProjectsClick: () => void;
}

export function Toolbar({
  dateRangeLabel,
  isAnalyticsActive,
  onPrev,
  onNext,
  onToday,
  onAddTaskClick,
  onAddProjectsClick,
}: ToolbarProps) {
  return (
    <div className="toolbar">
      <div className="toolbar__left">
        {!isAnalyticsActive && (
          <>
            <button className="toolbar__btn toolbar__btn--primary" onClick={onToday}>Today</button>
            <button className="toolbar__btn toolbar__btn--icon" onClick={onPrev} aria-label="Previous">&#8249;</button>
            <button className="toolbar__btn toolbar__btn--icon" onClick={onNext} aria-label="Next">&#8250;</button>
          </>
        )}
        <span className="toolbar__date-label">
          {isAnalyticsActive ? 'Analytics' : dateRangeLabel}
        </span>
      </div>

      <div className="toolbar__right">
        <button className="toolbar__btn toolbar__btn--add-task" onClick={onAddTaskClick}>
          + Task
        </button>
        <button className="toolbar__btn toolbar__btn--add-projects" onClick={onAddProjectsClick}>
          + Projects
        </button>
      </div>
    </div>
  );
}
