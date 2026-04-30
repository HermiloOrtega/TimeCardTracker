import { useState, useEffect } from 'react';
import { useProjects } from './hooks/useProjects';
import { useTimeEntries } from './hooks/useTimeEntries';
import { useCategories } from './hooks/useCategories';
import { useSettings } from './hooks/useSettings';
import { useTodos } from './hooks/useTodos';
import { CalendarShell } from './components/Calendar/CalendarShell';
import { LoginPage } from './components/LoginPage/LoginPage';
import { setCurrentUser } from './services/apiService';
import type { User } from './models/types';
import './App.css';

const SESSION_KEY = 'tct_user';

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      return stored ? (JSON.parse(stored) as User) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) setCurrentUser(user.username);
  }, [user]);

  function handleLogin(loggedInUser: User) {
    setCurrentUser(loggedInUser.username);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(loggedInUser));
    setUser(loggedInUser);
  }

  if (!user) return <LoginPage onLogin={handleLogin} />;

  return <AppShell user={user} />;
}

function AppShell({ user }: { user: User }) {
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
        username={user.username}
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
