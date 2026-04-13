import { useState, useEffect } from 'react';
import type { CategoryDef } from '../models/types';
import { generateId } from '../utils/uuidUtils';
import { apiGetCategories, apiAddCategory, apiUpdateCategory, apiDeleteCategory } from '../services/apiService';

export function useCategories() {
  const [categories, setCategoriesState] = useState<CategoryDef[]>([]);

  useEffect(() => {
    apiGetCategories().then(setCategoriesState).catch(console.error);
  }, []);

  async function addCategory(name: string, color: string, weeklyHours = 0): Promise<void> {
    const trimmed = name.trim();
    const isDuplicate = categories.some(c => c.name.toLowerCase() === trimmed.toLowerCase());
    if (!trimmed || isDuplicate) return;
    const cat: CategoryDef = { id: generateId(), name: trimmed, color, weeklyHours };
    await apiAddCategory(cat);
    setCategoriesState(prev => [...prev, cat]);
  }

  async function updateCategory(id: string, name: string, color: string, weeklyHours: number): Promise<void> {
    const trimmed = name.trim();
    if (!trimmed) return;
    const cat = categories.find(c => c.id === id);
    if (!cat) return;
    const updated: CategoryDef = { ...cat, name: trimmed, color, weeklyHours };
    await apiUpdateCategory(updated);
    setCategoriesState(prev => prev.map(c => c.id === id ? updated : c));
  }

  async function deleteCategory(id: string): Promise<void> {
    await apiDeleteCategory(id);
    setCategoriesState(prev => prev.filter(c => c.id !== id));
  }

  return { categories, addCategory, updateCategory, deleteCategory };
}
