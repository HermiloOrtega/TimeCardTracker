import { useState, useEffect } from 'react';
import type { CategoryDef } from '../models/types';
import { generateId } from '../utils/uuidUtils';
import { apiGetCategories, apiAddCategory, apiDeleteCategory } from '../services/apiService';

export function useCategories() {
  const [categories, setCategoriesState] = useState<CategoryDef[]>([]);

  useEffect(() => {
    apiGetCategories().then(setCategoriesState).catch(console.error);
  }, []);

  async function addCategory(name: string, color: string): Promise<void> {
    const trimmed = name.trim();
    const isDuplicate = categories.some(c => c.name.toLowerCase() === trimmed.toLowerCase());
    if (!trimmed || isDuplicate) return;
    const cat: CategoryDef = { id: generateId(), name: trimmed, color };
    await apiAddCategory(cat);
    setCategoriesState(prev => [...prev, cat]);
  }

  async function deleteCategory(id: string): Promise<void> {
    await apiDeleteCategory(id);
    setCategoriesState(prev => prev.filter(c => c.id !== id));
  }

  return { categories, addCategory, deleteCategory };
}
