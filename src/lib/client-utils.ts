'use client';

import { SortMode } from '@/components/blog/BlogFilters';

/**
 * Gets the saved sort mode from localStorage
 * @returns The stored sort mode or default 'date' mode
 */
export function getSavedSortMode(): SortMode {
  // Guard for server-side rendering
  if (typeof window === 'undefined') return 'date';
  
  try {
    const saved = localStorage.getItem('blogSortMode');
    // Use nullish coalescing to handle null value
    return (saved === 'popular' || saved === 'date') ? saved as SortMode : 'date';
  } catch {
    // Silent catch - return default value on error
    return 'date';
  }
}

/**
 * Saves the sort mode to localStorage and dispatches storage event
 * @param mode The sort mode to save
 */
export function saveSortMode(mode: SortMode): void {
  // Guard for server-side rendering
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('blogSortMode', mode);
    
    // Use CustomEvent for better compatibility
    const event = new StorageEvent('storage', {
      key: 'blogSortMode',
      newValue: mode,
      oldValue: localStorage.getItem('blogSortMode'),
      storageArea: localStorage
    });
    
    window.dispatchEvent(event);
  } catch (error) {
    // Log error but don't disrupt user experience
    console.error('Failed to save sort mode to localStorage', error);
  }
} 