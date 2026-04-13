import { useState } from 'react';
import ReactDOM from 'react-dom';
import type { Project, CategoryDef } from '../../models/types';
import './ProjectModal.css';

interface ProjectModalProps {
  projects: Project[];
  categories: CategoryDef[];
  onAdd: (name: string, categoryId: string) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export function ProjectModal({
  projects,
  categories,
  onAdd,
  onDelete,
  onClose,
}: ProjectModalProps) {
  const [projName, setProjName]   = useState('');
  const [projCatId, setProjCatId] = useState('');
  const [projError, setProjError] = useState('');

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
          <section className="project-modal__section">
            <div className="project-modal__section-title">Projects</div>

            {categories.length === 0 ? (
              <div className="project-modal__empty-hint">
                Create at least one category (via + Category) before adding projects.
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
