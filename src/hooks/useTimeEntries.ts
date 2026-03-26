import { useState } from 'react';
import type { TimeEntry } from '../models/types';
import { getEntries, setEntries } from '../services/storageService';
import { generateId } from '../utils/uuidUtils';

type EntryPayload = Omit<TimeEntry, 'id'>;

export function useTimeEntries() {
  const [entries, setEntriesState] = useState<TimeEntry[]>(() => getEntries());

  function addEntry(payload: EntryPayload): void {
    const next: TimeEntry[] = [...entries, { ...payload, id: generateId() }];
    setEntriesState(next);
    setEntries(next);
  }

  function updateEntry(id: string, payload: EntryPayload): void {
    const next = entries.map(e => (e.id === id ? { ...payload, id } : e));
    setEntriesState(next);
    setEntries(next);
  }

  function deleteEntry(id: string): void {
    const next = entries.filter(e => e.id !== id);
    setEntriesState(next);
    setEntries(next);
  }

  function scrubProjectId(projectId: string): void {
    const next = entries.map(e => ({
      ...e,
      projectIds: e.projectIds.filter(pid => pid !== projectId),
    }));
    setEntriesState(next);
    setEntries(next);
  }

  return { entries, addEntry, updateEntry, deleteEntry, scrubProjectId };
}
