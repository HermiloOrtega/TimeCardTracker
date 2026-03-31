import { useState } from 'react';
import ReactDOM from 'react-dom';
import type { TimeEntry, Project, CategoryDef } from '../../models/types';
import { HOUR_SLOTS, formatHour } from '../../utils/dateUtils';
import { getCategoryColor } from '../../utils/colorUtils';
import './EntryModal.css';

interface AddMode {
  mode: 'add';
  date: string;
  startHour: number;
}

interface EditMode {
  mode: 'edit';
  entry: TimeEntry;
}

type EntryModalProps = (AddMode | EditMode) & {
  projects: Project[];
  categories: CategoryDef[];
  onSave: (payload: Omit<TimeEntry, 'id'>) => void;
  onDuplicate?: (payload: Omit<TimeEntry, 'id'>) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
};

export function EntryModal(props: EntryModalProps) {
  const { projects, categories, onSave, onDuplicate, onDelete, onClose } = props;

  const isEdit  = props.mode === 'edit';
  const initial = isEdit ? props.entry : null;

  const [description, setDescription]         = useState(initial?.description ?? '');
  const [startHour, setStartHour]             = useState(initial?.startHour ?? (props.mode === 'add' ? props.startHour : 9));
  const [selectedProjectIds, setSelectedIds]  = useState<string[]>(initial?.projectIds ?? []);
  const [error, setError]                     = useState('');

  const date = isEdit ? initial!.date : props.date;

  function toggleProject(id: string) {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  }

  function buildPayload(): Omit<TimeEntry, 'id'> | null {
    if (!description.trim()) { setError('Description is required.'); return null; }
    return { date, startHour, endHour: startHour + 1, description: description.trim(), projectIds: selectedProjectIds };
  }

  function handleSave() {
    const payload = buildPayload();
    if (!payload) return;
    onSave(payload);
    onClose();
  }

  function handleDuplicate() {
    const payload = buildPayload();
    if (!payload || !onDuplicate) return;
    onDuplicate(payload);
    onClose();
  }

  function handleDelete() {
    if (isEdit && onDelete) { onDelete(initial!.id); onClose(); }
  }

  const content = (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">{isEdit ? 'Edit Entry' : 'New Entry'}</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close">&#x2715;</button>
        </div>

        <div className="modal__body">
          <div className="modal__field">
            <label className="modal__label">Date</label>
            <div className="modal__static">{date}</div>
          </div>

          <div className="modal__field">
            <label className="modal__label">Hour</label>
            <select className="modal__select" value={startHour} onChange={e => setStartHour(Number(e.target.value))}>
              {HOUR_SLOTS.map(h => <option key={h} value={h}>{formatHour(h)}</option>)}
            </select>
          </div>

          <div className="modal__field">
            <label className="modal__label">Description</label>
            <input
              className="modal__input"
              type="text"
              placeholder="What are you working on?"
              value={description}
              onChange={e => setDescription(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              autoFocus
            />
          </div>

          {projects.length > 0 && (
            <div className="modal__field">
              <label className="modal__label">Projects</label>
              <div className="modal__project-list">
                {projects.map(p => (
                  <label key={p.id} className="modal__project-item">
                    <input
                      type="checkbox"
                      checked={selectedProjectIds.includes(p.id)}
                      onChange={() => toggleProject(p.id)}
                    />
                    <span
                      className="modal__project-dot"
                      style={{ background: getCategoryColor(p.categoryId, categories) }}
                    />
                    <span className="modal__project-name">{p.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {error && <div className="modal__error">{error}</div>}
        </div>

        <div className="modal__footer">
          {isEdit && (
            <button className="modal__btn modal__btn--danger" onClick={handleDelete}>Delete</button>
          )}
          <div className="modal__footer-right">
            {isEdit && onDuplicate && (
              <button className="modal__btn modal__btn--secondary" onClick={handleDuplicate} title="Duplicate this entry">
                Duplicate
              </button>
            )}
            <button className="modal__btn modal__btn--secondary" onClick={onClose}>Cancel</button>
            <button className="modal__btn modal__btn--primary" onClick={handleSave}>
              {isEdit ? 'Save' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(content, document.body);
}
