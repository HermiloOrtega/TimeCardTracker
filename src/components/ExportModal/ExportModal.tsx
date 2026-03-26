import { useState } from 'react';
import ReactDOM from 'react-dom';
import type { TimeEntry, Project, CategoryDef } from '../../models/types';
import { toDateString, addDays, formatHour } from '../../utils/dateUtils';
import '../EntryModal/EntryModal.css';
import './ExportModal.css';

interface ExportModalProps {
  entries: TimeEntry[];
  projects: Project[];
  categories: CategoryDef[];
  onClose: () => void;
}

function defaultStart(): string {
  return toDateString(addDays(new Date(), -27));
}

function defaultEnd(): string {
  return toDateString(new Date());
}

export function ExportModal({ entries, projects, categories, onClose }: ExportModalProps) {
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate]     = useState(defaultEnd);
  const [exporting, setExporting] = useState(false);
  const [error, setError]         = useState('');

  async function handleExport() {
    if (startDate > endDate) { setError('Start date must be before end date.'); return; }
    setExporting(true);
    setError('');

    try {
      const XLSX = await import('xlsx');

      const filtered = entries
        .filter(e => e.date >= startDate && e.date <= endDate)
        .sort((a, b) => a.date.localeCompare(b.date) || a.startHour - b.startHour);

      const rows = filtered.map(e => {
        const projs    = projects.filter(p => e.projectIds.includes(p.id));
        const catNames = [...new Set(projs.map(p => categories.find(c => c.id === p.categoryId)?.name ?? ''))].join(', ');
        return {
          Date:             e.date,
          'Start Time':     formatHour(e.startHour),
          'End Time':       formatHour(e.endHour),
          'Duration (hrs)': e.endHour - e.startHour,
          Description:      e.description,
          Projects:         projs.map(p => p.name).join(', '),
          Category:         catNames,
        };
      });

      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Time Entries');
      const buf  = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `timecard-${startDate}-to-${endDate}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      onClose();
    } catch {
      setError('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  }

  const entryCount = entries.filter(e => e.date >= startDate && e.date <= endDate).length;

  const content = (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">Export to Excel</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close">&#x2715;</button>
        </div>

        <div className="modal__body">
          <div className="modal__field modal__field--row">
            <div className="modal__field">
              <label className="modal__label">From</label>
              <input
                type="date"
                className="modal__input"
                value={startDate}
                max={endDate}
                onChange={e => setStartDate(e.target.value)}
              />
            </div>
            <div className="modal__field">
              <label className="modal__label">To</label>
              <input
                type="date"
                className="modal__input"
                value={endDate}
                min={startDate}
                onChange={e => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="export-modal__info">
            {startDate <= endDate
              ? <span>{entryCount} entr{entryCount === 1 ? 'y' : 'ies'} will be exported.</span>
              : <span className="modal__error">Start date must be before end date.</span>
            }
          </div>

          <div className="export-modal__columns">
            <div className="modal__label">Columns included</div>
            <ul className="export-modal__col-list">
              <li>Date</li>
              <li>Start Time &amp; End Time</li>
              <li>Duration (hrs)</li>
              <li>Description</li>
              <li>Projects</li>
              <li>Category</li>
            </ul>
          </div>

          {error && <div className="modal__error">{error}</div>}
        </div>

        <div className="modal__footer">
          <div className="modal__footer-right">
            <button className="modal__btn modal__btn--secondary" onClick={onClose}>Cancel</button>
            <button
              className="modal__btn modal__btn--primary"
              onClick={handleExport}
              disabled={exporting || startDate > endDate || entryCount === 0}
            >
              {exporting ? 'Exporting…' : 'Download .xlsx'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(content, document.body);
}
