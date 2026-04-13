import { useState } from 'react';
import ReactDOM from 'react-dom';
import type { CategoryDef, Project } from '../../models/types';
import { PRESET_COLORS } from '../../utils/colorUtils';
import './CategoryModal.css';

interface CategoryModalProps {
  categories: CategoryDef[];
  projects: Project[];
  onAdd: (name: string, color: string, weeklyHours: number) => void;
  onUpdate: (id: string, name: string, color: string, weeklyHours: number) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export function CategoryModal({
  categories,
  projects,
  onAdd,
  onUpdate,
  onDelete,
  onClose,
}: CategoryModalProps) {
  // Add form state
  const [name, setName]               = useState('');
  const [color, setColor]             = useState(PRESET_COLORS[5]);
  const [weeklyHours, setWeeklyHours] = useState(0);
  const [error, setError]             = useState('');

  // Edit state
  const [editingId, setEditingId]           = useState<string | null>(null);
  const [editName, setEditName]             = useState('');
  const [editColor, setEditColor]           = useState('');
  const [editWeeklyHours, setEditWeeklyHours] = useState(0);
  const [editError, setEditError]           = useState('');

  function handleAdd() {
    const trimmed = name.trim();
    if (!trimmed) { setError('Name is required.'); return; }
    const duplicate = categories.some(c => c.name.toLowerCase() === trimmed.toLowerCase());
    if (duplicate) { setError('A category with this name already exists.'); return; }
    if (weeklyHours < 0) { setError('Hours must be 0 or more.'); return; }
    onAdd(trimmed, color, weeklyHours);
    setName('');
    setWeeklyHours(0);
    setColor(PRESET_COLORS[5]);
    setError('');
  }

  function startEdit(cat: CategoryDef) {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditColor(cat.color);
    setEditWeeklyHours(cat.weeklyHours);
    setEditError('');
  }

  function handleSaveEdit() {
    if (!editingId) return;
    const trimmed = editName.trim();
    if (!trimmed) { setEditError('Name is required.'); return; }
    const duplicate = categories.some(c => c.id !== editingId && c.name.toLowerCase() === trimmed.toLowerCase());
    if (duplicate) { setEditError('A category with this name already exists.'); return; }
    if (editWeeklyHours < 0) { setEditError('Hours must be 0 or more.'); return; }
    onUpdate(editingId, trimmed, editColor, editWeeklyHours);
    setEditingId(null);
    setEditError('');
  }

  function handleDelete(cat: CategoryDef) {
    const usedBy = projects.filter(p => p.categoryId === cat.id).length;
    if (usedBy > 0) {
      setError(`Cannot delete "${cat.name}" — ${usedBy} project${usedBy > 1 ? 's' : ''} use this category.`);
      return;
    }
    const confirmed = window.confirm(`Delete category "${cat.name}"? This cannot be undone.`);
    if (!confirmed) return;
    setError('');
    onDelete(cat.id);
  }

  const content = (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal category-modal" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">Manage Categories</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close">&#x2715;</button>
        </div>

        <div className="modal__body">
          {/* ── Add form ── */}
          <section className="project-modal__section">
            <div className="project-modal__section-title">New Category</div>

            <div className="modal__field">
              <label className="modal__label">Name</label>
              <input
                className="modal__input"
                type="text"
                placeholder="e.g. Client A"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
              />
            </div>

            <div className="modal__field">
              <label className="modal__label">Weekly Hours Target</label>
              <input
                className="modal__input category-modal__hours-input"
                type="number"
                min={0}
                step={0.5}
                placeholder="0"
                value={weeklyHours}
                onChange={e => setWeeklyHours(Number(e.target.value))}
              />
            </div>

            <div className="modal__field">
              <label className="modal__label">Color</label>
              <div className="project-modal__swatches">
                {PRESET_COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    className={`project-modal__swatch${color === c ? ' project-modal__swatch--selected' : ''}`}
                    style={{ background: c }}
                    onClick={() => setColor(c)}
                    aria-label={c}
                  />
                ))}
              </div>
            </div>

            {error && <div className="modal__error">{error}</div>}

            <button className="modal__btn modal__btn--primary project-modal__add-btn" onClick={handleAdd}>
              Add Category
            </button>
          </section>

          {/* ── Category list ── */}
          {categories.length > 0 && (
            <section className="project-modal__section">
              <div className="project-modal__section-title">Existing Categories</div>
              <div className="project-modal__list">
                {categories.map(cat => {
                  const usedBy = projects.filter(p => p.categoryId === cat.id).length;
                  const isEditing = editingId === cat.id;

                  if (isEditing) {
                    return (
                      <div key={cat.id} className="category-modal__edit-row">
                        <input
                          className="modal__input category-modal__edit-name"
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          autoFocus
                        />
                        <input
                          className="modal__input category-modal__hours-input"
                          type="number"
                          min={0}
                          step={0.5}
                          value={editWeeklyHours}
                          onChange={e => setEditWeeklyHours(Number(e.target.value))}
                          title="Weekly hours target"
                        />
                        <div className="project-modal__swatches category-modal__edit-swatches">
                          {PRESET_COLORS.map(c => (
                            <button
                              key={c}
                              type="button"
                              className={`project-modal__swatch${editColor === c ? ' project-modal__swatch--selected' : ''}`}
                              style={{ background: c }}
                              onClick={() => setEditColor(c)}
                              aria-label={c}
                            />
                          ))}
                        </div>
                        {editError && <div className="modal__error">{editError}</div>}
                        <div className="category-modal__edit-actions">
                          <button className="modal__btn modal__btn--primary category-modal__save-btn" onClick={handleSaveEdit}>Save</button>
                          <button className="modal__btn modal__btn--secondary" onClick={() => setEditingId(null)}>Cancel</button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={cat.id} className="project-modal__list-item">
                      <span className="modal__project-dot" style={{ background: cat.color }} />
                      <span className="project-modal__item-name">{cat.name}</span>
                      <span className="project-modal__item-cat">{cat.weeklyHours}h/wk</span>
                      {usedBy > 0 && (
                        <span className="project-modal__item-cat">{usedBy} proj</span>
                      )}
                      <button
                        className="category-modal__edit-btn"
                        onClick={() => startEdit(cat)}
                        aria-label={`Edit ${cat.name}`}
                        title="Edit category"
                      >
                        ✎
                      </button>
                      <button
                        className="project-modal__delete-btn"
                        onClick={() => handleDelete(cat)}
                        aria-label={`Delete ${cat.name}`}
                        title="Delete category"
                      >
                        &#x2715;
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        <div className="modal__footer">
          <div className="modal__footer-right">
            <button className="modal__btn modal__btn--secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(content, document.body);
}
