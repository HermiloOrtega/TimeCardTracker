import { useState, useMemo } from 'react';
import type { ViewMode, TimeEntry, Project, CategoryDef, AppSettings, TodoItem, Theme, TimeRange } from '../../models/types';
import { getWeekDays, addDays, getMonday, formatDateRange, getHourSlots, toDateString } from '../../utils/dateUtils';
import { Toolbar } from '../Toolbar/Toolbar';
import { WeekView } from '../WeekView/WeekView';
import { DailyView } from '../DailyView/DailyView';
import { EntryModal } from '../EntryModal/EntryModal';
import { ProjectModal } from '../ProjectModal/ProjectModal';
import { AnalyticsPanel } from '../Analytics/AnalyticsPanel';
import { ExportModal } from '../ExportModal/ExportModal';
import { TodoSidebar } from '../TodoSidebar/TodoSidebar';
import { ConfirmDropModal } from '../ConfirmDropModal/ConfirmDropModal';
import './CalendarShell.css';

type EntryModalState =
  | { mode: 'add'; date: string; startHour: number }
  | { mode: 'edit'; entry: TimeEntry }
  | null;

type DropPending = { todoId: string; date: string; hour: number } | null;

type AppView = 'calendar' | 'analytics';

interface CalendarShellProps {
  entries: TimeEntry[];
  projects: Project[];
  categories: CategoryDef[];
  settings: AppSettings;
  todos: TodoItem[];
  onAddEntry: (payload: Omit<TimeEntry, 'id'>) => void;
  onUpdateEntry: (id: string, payload: Omit<TimeEntry, 'id'>) => void;
  onDeleteEntry: (id: string) => void;
  onAddProject: (name: string, categoryId: string) => void;
  onDeleteProject: (id: string) => void;
  onAddCategory: (name: string, color: string) => void;
  onDeleteCategory: (id: string) => void;
  onSetTheme: (theme: Theme) => void;
  onSetTimeRange: (range: TimeRange) => void;
  onAddTodo: (title: string, note?: string) => void;
  onUpdateTodo: (id: string, title: string, note?: string) => void;
  onDeleteTodo: (id: string) => void;
  onDuplicateTodo: (id: string) => void;
  onClearAllTodos: () => void;
}

export function CalendarShell({
  entries,
  projects,
  categories,
  settings,
  todos,
  onAddEntry,
  onUpdateEntry,
  onDeleteEntry,
  onAddProject,
  onDeleteProject,
  onAddCategory,
  onDeleteCategory,
  onSetTheme,
  onSetTimeRange,
  onAddTodo,
  onUpdateTodo,
  onDeleteTodo,
  onDuplicateTodo,
  onClearAllTodos,
}: CalendarShellProps) {
  const [appView, setAppView]                   = useState<AppView>('calendar');
  const [viewMode, setViewMode]                 = useState<ViewMode>('week-without-weekends');
  const [anchorDate, setAnchorDate]             = useState<Date>(() => getMonday(new Date()));
  const [entryModalState, setEntryModalState]   = useState<EntryModalState>(null);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen]   = useState(false);
  const [dropPending, setDropPending]           = useState<DropPending>(null);

  const hourSlots = useMemo(() => getHourSlots(settings.timeRange), [settings.timeRange]);

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

  function handleAddTaskClick() {
    const today = toDateString(new Date());
    const hour  = new Date().getHours();
    const startHour = hourSlots.includes(hour) ? hour : hourSlots[0];
    setEntryModalState({ mode: 'add', date: today, startHour });
  }

  function handleEntryClick(entry: TimeEntry) {
    setEntryModalState({ mode: 'edit', entry });
  }

  function handleSave(payload: Omit<TimeEntry, 'id'>) {
    if (entryModalState?.mode === 'edit') onUpdateEntry(entryModalState.entry.id, payload);
    else onAddEntry(payload);
  }

  function handleDuplicateEntry(payload: Omit<TimeEntry, 'id'>) {
    onAddEntry(payload);
  }

  function handleToggleTheme() {
    onSetTheme(settings.theme === 'light' ? 'dark' : 'light');
  }

  function handleTodoDrop(todoId: string, date: string, hour: number) {
    setDropPending({ todoId, date, hour });
  }

  function handleEntryDrop(entryId: string, date: string, startHour: number) {
    const entry = entries.find(e => e.id === entryId);
    if (!entry) return;
    if (entry.date === date && entry.startHour === startHour) return;
    const ok = window.confirm(
      `Move "${entry.description}" to ${date} at ${startHour}:00?`
    );
    if (!ok) return;
    const duration = entry.endHour - entry.startHour;
    onUpdateEntry(entryId, {
      ...entry,
      date,
      startHour,
      endHour: startHour + duration,
    });
  }

  function handleDropConfirm(payload: Omit<TimeEntry, 'id'>) {
    onAddEntry(payload);
    if (dropPending) onDeleteTodo(dropPending.todoId);
    setDropPending(null);
  }

  const pendingTodo = dropPending
    ? todos.find(t => t.id === dropPending.todoId) ?? null
    : null;

  return (
    <div className="calendar-shell">
      <Toolbar
        viewMode={viewMode}
        dateRangeLabel={dateRangeLabel}
        isAnalyticsActive={appView === 'analytics'}
        theme={settings.theme}
        timeRange={settings.timeRange}
        onViewChange={handleViewChange}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        onAddTaskClick={handleAddTaskClick}
        onAddProjectsClick={() => setProjectModalOpen(true)}
        onAnalyticsClick={() => setAppView(v => v === 'analytics' ? 'calendar' : 'analytics')}
        onExportClick={() => setExportModalOpen(true)}
        onToggleTheme={handleToggleTheme}
        onTimeRangeChange={onSetTimeRange}
      />

      <div className="calendar-shell__body">
        <TodoSidebar
          todos={todos}
          onAdd={onAddTodo}
          onUpdate={onUpdateTodo}
          onDelete={onDeleteTodo}
          onDuplicate={onDuplicateTodo}
          onClearAll={onClearAllTodos}
        />

        <div className="calendar-shell__main">
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
              hourSlots={hourSlots}
              entries={entries}
              projects={projects}
              categories={categories}
              onSlotClick={handleSlotClick}
              onEntryClick={handleEntryClick}
              onTodoDrop={handleTodoDrop}
              onEntryDrop={handleEntryDrop}
            />
          ) : (
            <WeekView
              days={days}
              hourSlots={hourSlots}
              entries={entries}
              projects={projects}
              categories={categories}
              onSlotClick={handleSlotClick}
              onEntryClick={handleEntryClick}
              onTodoDrop={handleTodoDrop}
              onEntryDrop={handleEntryDrop}
            />
          )}
        </div>
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
            onDuplicate={handleDuplicateEntry}
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

      {dropPending && pendingTodo && (
        <ConfirmDropModal
          todo={pendingTodo}
          date={dropPending.date}
          startHour={dropPending.hour}
          projects={projects}
          categories={categories}
          onConfirm={handleDropConfirm}
          onCancel={() => setDropPending(null)}
        />
      )}
    </div>
  );
}
