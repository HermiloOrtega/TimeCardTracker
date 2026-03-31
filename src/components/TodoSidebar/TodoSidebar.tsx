import { useState } from 'react';
import type { TodoItem, Theme } from '../../models/types';
import './TodoSidebar.css';

interface TodoSidebarProps {
  todos: TodoItem[];
  onAdd: (title: string, note?: string) => void;
  onUpdate: (id: string, title: string, note?: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onClearAll: () => void;
  isAnalyticsActive: boolean;
  onAnalyticsClick: () => void;
  theme: Theme;
  onToggleTheme: () => void;
}

interface EditState {
  id: string;
  title: string;
  note: string;
}

export function TodoSidebar({
  todos,
  onAdd,
  onUpdate,
  onDelete,
  onDuplicate,
  onClearAll,
  isAnalyticsActive,
  onAnalyticsClick,
  theme,
  onToggleTheme,
}: TodoSidebarProps) {
  const [newTitle,     setNewTitle]     = useState('');
  const [newNote,      setNewNote]      = useState('');
  const [showAddNote,  setShowAddNote]  = useState(false);
  const [editing,      setEditing]      = useState<EditState | null>(null);
  const [collapsed,    setCollapsed]    = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  function handleAdd() {
    if (!newTitle.trim()) return;
    onAdd(newTitle.trim(), newNote.trim() || undefined);
    setNewTitle('');
    setNewNote('');
    setShowAddNote(false);
  }

  function handleEditSave() {
    if (!editing || !editing.title.trim()) return;
    onUpdate(editing.id, editing.title.trim(), editing.note.trim() || undefined);
    setEditing(null);
  }

  function startEdit(todo: TodoItem) {
    setEditing({ id: todo.id, title: todo.title, note: todo.note ?? '' });
  }

  function handleDragStart(e: React.DragEvent, todoId: string) {
    e.dataTransfer.setData('todoId', todoId);
    e.dataTransfer.effectAllowed = 'copy';
  }

  function handleClearAll() {
    if (todos.length === 0) return;
    if (window.confirm(`Delete all ${todos.length} task${todos.length > 1 ? 's' : ''}?`)) {
      onClearAll();
    }
  }

  function handleCollapse() {
    setCollapsed(v => !v);
    if (!collapsed) setSettingsOpen(false);
  }

  return (
    <aside className={`todo-sidebar${collapsed ? ' todo-sidebar--collapsed' : ''}`}>
      {/* ── Header ── */}
      <div className="todo-sidebar__header">
        {!collapsed && <h2 className="todo-sidebar__title">To-Do</h2>}
        <div className="todo-sidebar__header-actions">
          {!collapsed && todos.length > 0 && (
            <button
              className="todo-sidebar__clear-btn"
              onClick={handleClearAll}
              title="Clear all tasks"
              aria-label="Clear all tasks"
            >
              Clear all
            </button>
          )}
          {!collapsed && (
            <span className="todo-sidebar__count">{todos.length}</span>
          )}
          <button
            className="todo-sidebar__collapse-btn"
            onClick={handleCollapse}
            title={collapsed ? 'Expand' : 'Collapse'}
            aria-label={collapsed ? 'Expand To-Do' : 'Collapse To-Do'}
          >
            {collapsed ? '›' : '‹'}
          </button>
        </div>
      </div>

      {/* ── Add form ── */}
      {!collapsed && (
        <div className="todo-sidebar__add">
          <div className="todo-sidebar__add-row">
            <input
              className="todo-sidebar__input"
              type="text"
              placeholder="Add a task…"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
            />
            <button
              className="todo-sidebar__note-toggle"
              onClick={() => setShowAddNote(v => !v)}
              title="Add note"
              aria-label="Toggle note"
              type="button"
            >
              ≡
            </button>
            <button
              className="todo-sidebar__add-btn"
              onClick={handleAdd}
              disabled={!newTitle.trim()}
              aria-label="Add task"
            >
              +
            </button>
          </div>
          {showAddNote && (
            <textarea
              className="todo-sidebar__textarea"
              placeholder="Optional note…"
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
              rows={2}
            />
          )}
        </div>
      )}

      {!collapsed && (
        <div className="todo-sidebar__hint">Drag tasks onto calendar slots</div>
      )}

      {/* ── Task list ── */}
      {!collapsed && (
        <ul className="todo-sidebar__list">
          {todos.length === 0 && (
            <li className="todo-sidebar__empty">No tasks yet</li>
          )}
          {todos.map(todo => (
            <li
              key={todo.id}
              className="todo-sidebar__item"
              draggable
              onDragStart={e => handleDragStart(e, todo.id)}
              title="Drag to a calendar slot to schedule"
            >
              {editing?.id === todo.id ? (
                <div className="todo-sidebar__edit">
                  <input
                    className="todo-sidebar__input"
                    type="text"
                    value={editing.title}
                    onChange={e => setEditing(s => s ? { ...s, title: e.target.value } : s)}
                    onKeyDown={e => { if (e.key === 'Enter') handleEditSave(); if (e.key === 'Escape') setEditing(null); }}
                    autoFocus
                  />
                  <textarea
                    className="todo-sidebar__textarea"
                    placeholder="Optional note…"
                    value={editing.note}
                    onChange={e => setEditing(s => s ? { ...s, note: e.target.value } : s)}
                    rows={2}
                  />
                  <div className="todo-sidebar__edit-actions">
                    <button className="todo-sidebar__save-btn" onClick={handleEditSave}>Save</button>
                    <button className="todo-sidebar__cancel-btn" onClick={() => setEditing(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="todo-sidebar__item-drag-handle" aria-hidden>⠿</div>
                  <div className="todo-sidebar__item-body">
                    <span className="todo-sidebar__item-title">{todo.title}</span>
                    {todo.note && <span className="todo-sidebar__item-note">{todo.note}</span>}
                  </div>
                  <div className="todo-sidebar__item-actions">
                    <button
                      className="todo-sidebar__icon-btn"
                      onClick={e => { e.stopPropagation(); startEdit(todo); }}
                      aria-label="Edit task"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      className="todo-sidebar__icon-btn todo-sidebar__icon-btn--copy"
                      onClick={e => { e.stopPropagation(); onDuplicate(todo.id); }}
                      aria-label="Duplicate task"
                      title="Duplicate"
                    >
                      ⧉
                    </button>
                    <button
                      className="todo-sidebar__icon-btn todo-sidebar__icon-btn--danger"
                      onClick={e => { e.stopPropagation(); onDelete(todo.id); }}
                      aria-label="Delete task"
                      title="Delete"
                    >
                      ✕
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* ── Bottom: Analytics + Settings ── */}
      <div className="todo-sidebar__bottom">
        {/* Analytics */}
        <button
          className={`todo-sidebar__bottom-btn${isAnalyticsActive ? ' todo-sidebar__bottom-btn--active' : ''}`}
          onClick={onAnalyticsClick}
          title="Analytics"
        >
          <span className="todo-sidebar__bottom-icon">📊</span>
          {!collapsed && <span className="todo-sidebar__bottom-label">Analytics</span>}
        </button>

        {/* Settings */}
        <div className="todo-sidebar__settings-wrap">
          {settingsOpen && !collapsed && (
            <div className="todo-sidebar__settings-popup">
              <p className="todo-sidebar__settings-title">Appearance</p>
              <button className="todo-sidebar__theme-btn" onClick={onToggleTheme}>
                {theme === 'light' ? '🌙  Dark mode' : '☀️  Light mode'}
              </button>
            </div>
          )}
          <button
            className={`todo-sidebar__bottom-btn${settingsOpen ? ' todo-sidebar__bottom-btn--active' : ''}`}
            onClick={() => setSettingsOpen(v => !v)}
            title="Settings"
          >
            <span className="todo-sidebar__bottom-icon">⚙️</span>
            {!collapsed && <span className="todo-sidebar__bottom-label">Settings</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
