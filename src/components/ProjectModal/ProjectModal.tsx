import { useState } from 'react';
import ReactDOM from 'react-dom';
import type { Project, CategoryDef } from '../../models/types';
import { PRESET_COLORS } from '../../utils/colorUtils';
import './ProjectModal.css';

interface ProjectModalProps {
  projects: Project[];
  categories: CategoryDef[];
  onAdd: (name: string, categoryId: string) => void;
  onDelete: (id: string) => void;
  onAddCategory: (name: string, color: string) => void;
  onDeleteCategory: (id: string) => void;
  onClose: () => void;
}

export function ProjectModal({
  projects,
  categories,
  onAdd,
  onDelete,
  onAddCategory,
  onDeleteCategory,
  onClose,
}: ProjectModalProps) {
  // Category form state
  const [catName, setCatName]   = useState('');
  const [catColor, setCatColor] = useState(PRESET_COLORS[5]); // default blue
  const [catError, setCatError] = useState('');

  // Project form state
  const [projName, setProjName]       = useState('');
  const [projCatId, setProjCatId]     = useState('');
  const [projError, setProjError]     = useState('');

  function handleAddCategory() {
    const trimmed = catName.trim();
    if (!trimmed) { setCatError('Name is required.'); return; }
    const duplicate = categories.some(c => c.name.toLowerCase() === trimmed.toLowerCase());
    if (duplicate) { setCatError('A category with this name already exists.'); return; }
    onAddCategory(trimmed, catColor);
    setCatName('');
    setCatError('');
  }

  function handleDeleteCategory(id: string) {
    const usedBy = projects.filter(p => p.categoryId === id).length;
    if (usedBy > 0) {
      setCatError(`Cannot delete — ${usedBy} project${usedBy > 1 ? 's' : ''} use this category.`);
      return;
    }
    setCatError('');
    onDeleteCategory(id);
  }

  function handleAddProject() {
    const trimmed = projName.trim();
    if (!trimmed) { setProjError('Name is required.'); return; }
    if (!projCatId) { setProjError('Select a category.'); return; }
    const duplicate = projects.some(p => p.name.toLowerCase() === trimmed.toLowerCase());
    if (duplicate) { setProjError('A project with this name already exists.'); return; }
    onAdd(trimmed, projCatId);
    setProjName('');
    setProjError('');
  }

  const content = (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal project-modal" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">Manage Projects</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close">&#x2715;</button>
        </div>

        <div className="modal__body">
          {/* ── Categories section ── */}
          <section className="project-modal__section">
            <div className="project-modal__section-title">Categories</div>

            <div className="modal__field">
              <label className="modal__label">Category Name</label>
              <input
                className="modal__input"
                type="text"
                placeholder="e.g. Client A"
                value={catName}
                onChange={e => setCatName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
              />
            </div>

            <div className="modal__field">
              <label className="modal__label">Color</label>
              <div className="project-modal__swatches">
                {PRESET_COLORS.map(color => (
                  <button
                    key={color}
                    type="button"
                    className={`project-modal__swatch${catColor === color ? ' project-modal__swatch--selected' : ''}`}
                    style={{ background: color }}
                    onClick={() => setCatColor(color)}
                    aria-label={color}
                  />
                ))}
              </div>
            </div>

            {catError && <div className="modal__error">{catError}</div>}

            <button className="modal__btn modal__btn--primary project-modal__add-btn" onClick={handleAddCategory}>
              Add Category
            </button>

            {categories.length > 0 && (
              <div className="project-modal__list">
                {categories.map(cat => {
                  const usedBy = projects.filter(p => p.categoryId === cat.id).length;
                  return (
                    <div key={cat.id} className="project-modal__list-item">
                      <span className="modal__project-dot" style={{ background: cat.color }} />
                      <span className="project-modal__item-name">{cat.name}</span>
                      {usedBy > 0 && (
                        <span className="project-modal__item-cat">{usedBy} project{usedBy > 1 ? 's' : ''}</span>
                      )}
                      <button
                        className={`project-modal__delete-btn${usedBy > 0 ? ' project-modal__delete-btn--disabled' : ''}`}
                        onClick={() => handleDeleteCategory(cat.id)}
                        aria-label={`Delete ${cat.name}`}
                        title={usedBy > 0 ? `${usedBy} project(s) use this category` : 'Delete category'}
                      >
                        &#x2715;
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* ── Projects section ── */}
          <section className="project-modal__section">
            <div className="project-modal__section-title">Projects</div>

            {categories.length === 0 ? (
              <div className="project-modal__empty-hint">
                Create at least one category before adding projects.
              </div>
            ) : (
              <>
                <div className="modal__field">
                  <label className="modal__label">Project Name</label>
                  <input
                    className="modal__input"
                    type="text"
                    placeholder="e.g. Website Redesign"
                    value={projName}
                    onChange={e => setProjName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddProject()}
                  />
                </div>

                <div className="modal__field">
                  <label className="modal__label">Category</label>
                  <div className="project-modal__cat-pills">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        className={`project-modal__cat-pill${projCatId === cat.id ? ' project-modal__cat-pill--selected' : ''}`}
                        style={projCatId === cat.id ? { background: cat.color, borderColor: cat.color, color: '#fff' } : { borderColor: cat.color }}
                        onClick={() => setProjCatId(cat.id)}
                      >
                        <span className="modal__project-dot" style={{ background: projCatId === cat.id ? '#fff' : cat.color }} />
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {projError && <div className="modal__error">{projError}</div>}

                <button className="modal__btn modal__btn--primary project-modal__add-btn" onClick={handleAddProject}>
                  Add Project
                </button>
              </>
            )}

            {projects.length > 0 && (
              <div className="project-modal__list">
                {projects.map(p => {
                  const cat = categories.find(c => c.id === p.categoryId);
                  return (
                    <div key={p.id} className="project-modal__list-item">
                      <span className="modal__project-dot" style={{ background: cat?.color ?? '#9E9E9E' }} />
                      <span className="project-modal__item-name">{p.name}</span>
                      <span className="project-modal__item-cat">{cat?.name ?? '—'}</span>
                      <button
                        className="project-modal__delete-btn"
                        onClick={() => onDelete(p.id)}
                        aria-label={`Delete ${p.name}`}
                      >
                        &#x2715;
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
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
