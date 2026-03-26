import { useState, useMemo } from 'react';
import type { ViewMode, TimeEntry, Project, CategoryDef } from '../../models/types';
import { getWeekDays, addDays, getMonday, formatDateRange, toDateString } from '../../utils/dateUtils';
import { Toolbar } from '../Toolbar/Toolbar';
import { WeekView } from '../WeekView/WeekView';
import { DailyView } from '../DailyView/DailyView';
import { EntryModal } from '../EntryModal/EntryModal';
import { ProjectModal } from '../ProjectModal/ProjectModal';
import { AnalyticsPanel } from '../Analytics/AnalyticsPanel';
import { ExportModal } from '../ExportModal/ExportModal';
import './CalendarShell.css';

type EntryModalState =
  | { mode: 'add'; date: string; startHour: number }
  | { mode: 'edit'; entry: TimeEntry }
  | null;

type AppView = 'calendar' | 'analytics';

interface CalendarShellProps {
  entries: TimeEntry[];
  projects: Project[];
  categories: CategoryDef[];
  onAddEntry: (payload: Omit<TimeEntry, 'id'>) => void;
  onUpdateEntry: (id: string, payload: Omit<TimeEntry, 'id'>) => void;
  onDeleteEntry: (id: string) => void;
  onAddProject: (name: string, categoryId: string) => void;
  onDeleteProject: (id: string) => void;
  onAddCategory: (name: string, color: string) => void;
  onDeleteCategory: (id: string) => void;
}

export function CalendarShell({
  entries,
  projects,
  categories,
  onAddEntry,
  onUpdateEntry,
  onDeleteEntry,
  onAddProject,
  onDeleteProject,
  onAddCategory,
  onDeleteCategory,
}: CalendarShellProps) {
  const [appView, setAppView]                   = useState<AppView>('calendar');
  const [viewMode, setViewMode]                 = useState<ViewMode>('week-without-weekends');
  const [anchorDate, setAnchorDate]             = useState<Date>(() => new Date());
  const [entryModalState, setEntryModalState]   = useState<EntryModalState>(null);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen]   = useState(false);

  const days = useMemo(() => {
    if (viewMode === 'daily') return [anchorDate];
    return getWeekDays(anchorDate, viewMode === 'week-with-weekends');
  }, [viewMode, anchorDate]);

  const dateRangeLabel = useMemo(() => formatDateRange(days), [days]);

  function handlePrev() {
    if (viewMode === 'daily') setAnchorDate(d => addDays(d, -1));
    else setAnchorDate(d => addDays(d, -7));
  }

  function handleNext() {
    if (viewMode === 'daily') setAnchorDate(d => addDays(d, 1));
    else setAnchorDate(d => addDays(d, 7));
  }

  function handleToday() {
    const today = new Date();
    setAnchorDate(viewMode === 'daily' ? today : getMonday(today));
  }

  function handleViewChange(mode: ViewMode) {
    setViewMode(mode);
    if (mode !== 'daily') setAnchorDate(d => getMonday(d));
  }

  function handleSlotClick(date: string, hour: number) {
    setEntryModalState({ mode: 'add', date, startHour: hour });
  }

  function handleEntryClick(entry: TimeEntry) {
    setEntryModalState({ mode: 'edit', entry });
  }

  function handleSave(payload: Omit<TimeEntry, 'id'>) {
    if (entryModalState?.mode === 'edit') onUpdateEntry(entryModalState.entry.id, payload);
    else onAddEntry(payload);
  }

  // Default anchor date for today on first render
  useMemo(() => {
    if (viewMode !== 'daily') setAnchorDate(getMonday(new Date()));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="calendar-shell">
      <Toolbar
        viewMode={viewMode}
        dateRangeLabel={dateRangeLabel}
        isAnalyticsActive={appView === 'analytics'}
        onViewChange={handleViewChange}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        onAddProjectsClick={() => setProjectModalOpen(true)}
        onAnalyticsClick={() => setAppView(v => v === 'analytics' ? 'calendar' : 'analytics')}
        onExportClick={() => setExportModalOpen(true)}
      />

      <div className="calendar-shell__body">
        {appView === 'analytics' ? (
          <AnalyticsPanel
            entries={entries}
            projects={projects}
            categories={categories}
            onBack={() => setAppView('calendar')}
          />
        ) : viewMode === 'daily' ? (
          <DailyView
            day={anchorDate}
            entries={entries}
            projects={projects}
            categories={categories}
            onSlotClick={handleSlotClick}
            onEntryClick={handleEntryClick}
          />
        ) : (
          <WeekView
            days={days}
            entries={entries}
            projects={projects}
            categories={categories}
            onSlotClick={handleSlotClick}
            onEntryClick={handleEntryClick}
          />
        )}
      </div>

      {entryModalState && (
        entryModalState.mode === 'add' ? (
          <EntryModal
            mode="add"
            date={entryModalState.date}
            startHour={entryModalState.startHour}
            projects={projects}
            categories={categories}
            onSave={handleSave}
            onClose={() => setEntryModalState(null)}
          />
        ) : (
          <EntryModal
            mode="edit"
            entry={entryModalState.entry}
            projects={projects}
            categories={categories}
            onSave={handleSave}
            onDelete={onDeleteEntry}
            onClose={() => setEntryModalState(null)}
          />
        )
      )}

      {projectModalOpen && (
        <ProjectModal
          projects={projects}
          categories={categories}
          onAdd={onAddProject}
          onDelete={onDeleteProject}
          onAddCategory={onAddCategory}
          onDeleteCategory={onDeleteCategory}
          onClose={() => setProjectModalOpen(false)}
        />
      )}

      {exportModalOpen && (
        <ExportModal
          entries={entries}
          projects={projects}
          categories={categories}
          onClose={() => setExportModalOpen(false)}
        />
      )}
    </div>
  );
}
