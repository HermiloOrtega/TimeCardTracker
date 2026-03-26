import type { Project, CategoryDef } from '../models/types';

export const MIXED_COLOR = '#9E9E9E';

export const PRESET_COLORS: string[] = [
  '#F44336', '#E91E63', '#9C27B0', '#673AB7',
  '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',
  '#009688', '#4CAF50', '#8BC34A', '#FFC107',
];

export function getCategoryColor(categoryId: string, categories: CategoryDef[]): string {
  return categories.find(c => c.id === categoryId)?.color ?? MIXED_COLOR;
}

export function deriveBlockColor(
  projectIds: string[],
  projects: Project[],
  categories: CategoryDef[]
): string {
  if (projectIds.length === 0) return MIXED_COLOR;

  const found = projects.filter(p => projectIds.includes(p.id));
  if (found.length === 0) return MIXED_COLOR;

  const categoryIds = [...new Set(found.map(p => p.categoryId))];
  if (categoryIds.length === 1) {
    return getCategoryColor(categoryIds[0], categories);
  }

  // Mixed categories → grey
  return MIXED_COLOR;
}
