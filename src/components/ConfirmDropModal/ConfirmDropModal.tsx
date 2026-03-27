import { useState } from 'react';
import type { TodoItem, TimeEntry, Project, CategoryDef } from '../../models/types';
import { formatHour, fromDateString } from '../../utils/dateUtils';
import './ConfirmDropModal.css';

interface ConfirmDropModalProps {
  todo: TodoItem;
  date: string;
  startHour: number;
  projects: Project[];
  categories: CategoryDef[];
  onConfirm: (payload: Omit<TimeEntry, 'id'>) => void;
  onCancel: () => void;
}

export function ConfirmDropModal({
  todo,
  date,
  startHour,
  projects,
  categories,
  onConfirm,
  onCancel,
}: ConfirmDropModalProps) {
  const [description, setDescription] = useState(todo.title);
  const [start, setStart]             = useState(startHour);
  const [end, setEnd]                 = useState(startHour + 1);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

  const dateLabel = fromDateString(date).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });

  // Build hour options 0–23
  const hourOptions = Array.from({ length: 24 }, (_, i) => i);

  function toggleProject(id: string) {
    setSelectedProjects(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  }

  function handleConfirm() {
    if (!description.trim() || end <= start) return;
    onConfirm({
      date,
      startHour: start,
      endHour: end,
      description: description.trim(),
      projectIds: selectedProjects,
    });
  }

  return (
    <div className="confirm-drop-overlay" onClick={onCancel}>
      <div className="confirm-drop-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal>
        <div className="confirm-drop-modal__header">
          <h3 className="confirm-drop-modal__title">Schedule Task</h3>
          <button className="confirm-drop-modal__close" onClick={onCancel} aria-label="Close">×</button>
        </div>

        <p className="confirm-drop-modal__date">{dateLabel}</p>

        <div className="confirm-drop-modal__field">
          <label className="confirm-drop-modal__label">Description</label>
          <input
            className="confirm-drop-modal__input"
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            autoFocus
          />
        </div>

        <div className="confirm-drop-modal__row">
          <div className="confirm-drop-modal__field">
            <label className="confirm-drop-modal__label">Start</label>
            <select
              className="confirm-drop-modal__select"
              value={start}
              onChange={e => {
                const v = Number(e.target.value);
                setStart(v);
                if (end <= v) setEnd(v + 1);
              }}
            >
              {hourOptions.map(h => (
                <option key={h} value={h}>{formatHour(h)}</option>
              ))}
            </select>
          </div>

          <div className="confirm-drop-modal__field">
            <label className="confirm-drop-modal__label">End</label>
            <select
              className="confirm-drop-modal__select"
              value={end}
              onChange={e => setEnd(Number(e.target.value))}
            >
              {hourOptions.filter(h => h > start).map(h => (
                <option key={h} value={h}>{formatHour(h)}</option>
              ))}
            </select>
          </div>
        </div>

        {projects.length > 0 && (
          <div className="confirm-drop-modal__field">
            <label className="confirm-drop-modal__label">Projects (optional)</label>
            <div className="confirm-drop-modal__projects">
              {projects.map(p => {
                const cat = categories.find(c => c.id === p.categoryId);
                const checked = selectedProjects.includes(p.id);
                return (
                  <label key={p.id} className="confirm-drop-modal__project-chip">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleProject(p.id)}
                    />
                    <span
                      className="confirm-drop-modal__project-dot"
                      style={{ background: cat?.color ?? '#9E9E9E' }}
                    />
                    {p.name}
                  </label>
                );
              })}
            </div>
          </div>
        )}

        <div className="confirm-drop-modal__actions">
          <button className="confirm-drop-modal__cancel" onClick={onCancel}>Cancel</button>
          <button
            className="confirm-drop-modal__confirm"
            onClick={handleConfirm}
            disabled={!description.trim() || end <= start}
          >
            Add to Calendar
          </button>
        </div>
      </div>
    </div>
  );
}
