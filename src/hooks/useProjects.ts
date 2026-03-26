import { useState } from 'react';
import type { Project } from '../models/types';
import { getProjects, setProjects } from '../services/storageService';
import { generateId } from '../utils/uuidUtils';

export function useProjects() {
  const [projects, setProjectsState] = useState<Project[]>(() => getProjects());

  function addProject(name: string, categoryId: string): void {
    const next: Project[] = [...projects, { id: generateId(), name: name.trim(), categoryId }];
    setProjectsState(next);
    setProjects(next);
  }

  function deleteProject(id: string): void {
    const next = projects.filter(p => p.id !== id);
    setProjectsState(next);
    setProjects(next);
  }

  return { projects, addProject, deleteProject };
}
