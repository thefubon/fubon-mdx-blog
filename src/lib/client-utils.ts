'use client';

import { SortMode } from '@/components/blog/BlogFilters';

// Получить режим сортировки из localStorage
export function getSavedSortMode(): SortMode {
  if (typeof window === 'undefined') return 'new';
  
  try {
    const saved = localStorage.getItem('blogSortMode');
    return (saved === 'popular' || saved === 'new') ? saved as SortMode : 'new';
  } catch {
    return 'new';
  }
}

// Сохранить режим сортировки в localStorage
export function saveSortMode(mode: SortMode): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('blogSortMode', mode);
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.error('Failed to save sort mode to localStorage', e);
  }
} 