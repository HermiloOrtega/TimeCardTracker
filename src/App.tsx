import { useProjects } from './hooks/useProjects';
import { useTimeEntries } from './hooks/useTimeEntries';
import { useCategories } from './hooks/useCategories';
import { useSettings } from './hooks/useSettings';
import { useTodos } from './hooks/useTodos';
import { CalendarShell } from './components/Calendar/CalendarShell';
import './App.css';

export default function App() {
  const { categories, addCategory, updateCategory, deleteCategory }          = useCategories();
  const { projects, addProject, deleteProject }                              = useProjects();
  const { entries, addEntry, updateEntry, deleteEntry, scrubProjectId }      = useTimeEntries();
  const { settings, setTheme, setTimeRange }                                 = useSettings();
  const { todos, addTodo, updateTodo, deleteTodo, duplicateTodo, clearAllTodos } = useTodos();

  function handleDeleteProject(id: string) {
    scrubProjectId(id);
    deleteProject(id);
  }

  return (
    <div className="app">
      <CalendarShell
        entries={entries}
        projects={projects}
        categories={categories}
        settings={settings}
        todos={todos}
        onAddEntry={addEntry}
        onUpdateEntry={updateEntry}
        onDeleteEntry={deleteEntry}
        onAddProject={addProject}
        onDeleteProject={handleDeleteProject}
        onAddCategory={addCategory}
        onUpdateCategory={updateCategory}
        onDeleteCategory={deleteCategory}
        onSetTheme={setTheme}
        onSetTimeRange={setTimeRange}
        onAddTodo={addTodo}
        onUpdateTodo={updateTodo}
        onDeleteTodo={deleteTodo}
        onDuplicateTodo={duplicateTodo}
        onClearAllTodos={clearAllTodos}
      />
    </div>
  );
}
