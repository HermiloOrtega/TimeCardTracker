import { useState, useEffect } from 'react';
import type { TimeEntry } from '../models/types';
import { generateId } from '../utils/uuidUtils';
import { apiGetEntries, apiAddEntry, apiUpdateEntry, apiDeleteEntry } from '../services/apiService';

type EntryPayload = Omit<TimeEntry, 'id'>;

export function useTimeEntries() {
  const [entries, setEntriesState] = useState<TimeEntry[]>([]);

  useEffect(() => {
    apiGetEntries().then(setEntriesState).catch(console.error);
  }, []);

  async function addEntry(payload: EntryPayload): Promise<void> {
    const entry: TimeEntry = { ...payload, id: generateId() };
    await apiAddEntry(entry);
    setEntriesState(prev => [...prev, entry]);
  }

  async function updateEntry(id: string, payload: EntryPayload): Promise<void> {
    const entry: TimeEntry = { ...payload, id };
    await apiUpdateEntry(entry);
    setEntriesState(prev => prev.map(e => e.id === id ? entry : e));
  }

  async function deleteEntry(id: string): Promise<void> {
    await apiDeleteEntry(id);
    setEntriesState(prev => prev.filter(e => e.id !== id));
  }

  async function scrubProjectId(projectId: string): Promise<void> {
    const affected = entries.filter(e => e.projectIds.includes(projectId));
    await Promise.all(affected.map(e =>
      apiUpdateEntry({ ...e, projectIds: e.projectIds.filter(pid => pid !== projectId) })
    ));
    setEntriesState(prev => prev.map(e => ({
      ...e,
      projectIds: e.projectIds.filter(pid => pid !== projectId),
    })));
  }

  return { entries, addEntry, updateEntry, deleteEntry, scrubProjectId };
}
