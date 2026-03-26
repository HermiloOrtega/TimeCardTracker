import { useProjects } from './hooks/useProjects';
import { useTimeEntries } from './hooks/useTimeEntries';
import { useCategories } from './hooks/useCategories';
import { migrateIfNeeded } from './services/storageService';
import { CalendarShell } from './components/Calendar/CalendarShell';
import './App.css';

// Run migration once before any hooks initialise state
migrateIfNeeded();

export default function App() {
  const { categories, addCategory, deleteCategory } = useCategories();
  const { projects, addProject, deleteProject }     = useProjects();
  const { entries, addEntry, updateEntry, deleteEntry, scrubProjectId } = useTimeEntries();

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
        onAddEntry={addEntry}
        onUpdateEntry={updateEntry}
        onDeleteEntry={deleteEntry}
        onAddProject={addProject}
        onDeleteProject={handleDeleteProject}
        onAddCategory={addCategory}
        onDeleteCategory={deleteCategory}
      />
    </div>
  );
}
