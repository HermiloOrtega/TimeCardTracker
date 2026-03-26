import { useState } from 'react';
import type { CategoryDef } from '../models/types';
import { getCategories, setCategories } from '../services/storageService';
import { generateId } from '../utils/uuidUtils';

export function useCategories() {
  const [categories, setCategoriesState] = useState<CategoryDef[]>(() => getCategories());

  function addCategory(name: string, color: string): void {
    const trimmed = name.trim();
    const isDuplicate = categories.some(
      c => c.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (!trimmed || isDuplicate) return;

    const next: CategoryDef[] = [...categories, { id: generateId(), name: trimmed, color }];
    setCategoriesState(next);
    setCategories(next);
  }

  function deleteCategory(id: string): void {
    const next = categories.filter(c => c.id !== id);
    setCategoriesState(next);
    setCategories(next);
  }

  return { categories, addCategory, deleteCategory };
}
