import { useState, useEffect } from 'react';
import type { Project } from '../models/types';
import { generateId } from '../utils/uuidUtils';
import { apiGetProjects, apiAddProject, apiDeleteProject } from '../services/apiService';

export function useProjects() {
  const [projects, setProjectsState] = useState<Project[]>([]);

  useEffect(() => {
    apiGetProjects().then(setProjectsState).catch(console.error);
  }, []);

  async function addProject(name: string, categoryId: string): Promise<void> {
    const p: Project = { id: generateId(), name: name.trim(), categoryId };
    await apiAddProject(p);
    setProjectsState(prev => [...prev, p]);
  }

  async function deleteProject(id: string): Promise<void> {
    await apiDeleteProject(id);
    setProjectsState(prev => prev.filter(p => p.id !== id));
  }

  return { projects, addProject, deleteProject };
}
