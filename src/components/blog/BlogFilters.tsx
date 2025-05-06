'use client'

import { useState, useEffect } from 'react'
import { Grid2X2, Grid3X3, List } from 'lucide-react'
import { getSavedSortMode, saveSortMode } from '@/lib/client-utils'

export type ViewMode = 'grid4' | 'grid2' | 'list'
export type SortMode = 'new' | 'popular'

interface BlogFiltersProps {
  onSortChange?: (mode: SortMode) => void
}

export default function BlogFilters({ onSortChange }: BlogFiltersProps) {
  const [sortMode, setSortMode] = useState<SortMode>(getSavedSortMode())
  const [viewMode, setViewMode] = useState<ViewMode>('grid4')

  // Загрузка состояния из localStorage при инициализации
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedViewMode = localStorage.getItem('blogViewMode') as ViewMode
      
      if (savedViewMode) {
        setViewMode(savedViewMode)
      }
    }
  }, [])

  // Сохранение состояния в localStorage при изменении
  const updateSortMode = (mode: SortMode) => {
    setSortMode(mode)
    
    // Сохраняем в localStorage и генерируем событие
    saveSortMode(mode);
    
    // Вызываем callback если он предоставлен
    if (onSortChange) {
      onSortChange(mode)
    }
  }
  
  const updateViewMode = (mode: ViewMode) => {
    setViewMode(mode)
    if (typeof window !== 'undefined') {
      localStorage.setItem('blogViewMode', mode)
      // Создаем и диспатчим событие для оповещения других компонентов
      window.dispatchEvent(new Event('storage'))
    }
  }

  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="font-bold text-gray-900 dark:text-white">Все статьи</h2>
      
      <div className="flex items-center space-x-2">
        {/* Сортировка */}
        <div className="flex border rounded-lg dark:border-gray-800 overflow-hidden">
          <button 
            className={`px-3 py-1 text-sm transition-colors ${
              sortMode === 'new' 
                ? 'bg-white dark:bg-gray-900 font-medium' 
                : 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
            } border-r dark:border-gray-800`}
            onClick={() => updateSortMode('new')}
          >
            Все
          </button>
          <button 
            className={`px-3 py-1 text-sm transition-colors ${
              sortMode === 'popular' 
                ? 'bg-white dark:bg-gray-900 font-medium' 
                : 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
            }`}
            onClick={() => updateSortMode('popular')}
          >
            Избранные
          </button>
        </div>
        
        {/* Переключатель вида - скрываем на мобильных устройствах */}
        <div className="hidden sm:flex border rounded-lg dark:border-gray-800 overflow-hidden">
          <button 
            className={`p-1.5 transition-colors ${
              viewMode === 'grid4' 
                ? 'bg-white dark:bg-gray-900' 
                : 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
            } border-r dark:border-gray-800`}
            onClick={() => updateViewMode('grid4')}
            aria-label="Сетка 4x4"
          >
            <Grid3X3 size={18} />
          </button>
          <button 
            className={`p-1.5 transition-colors ${
              viewMode === 'grid2' 
                ? 'bg-white dark:bg-gray-900' 
                : 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
            } border-r dark:border-gray-800`}
            onClick={() => updateViewMode('grid2')}
            aria-label="Сетка 2x2"
          >
            <Grid2X2 size={18} />
          </button>
          <button 
            className={`p-1.5 transition-colors ${
              viewMode === 'list' 
                ? 'bg-white dark:bg-gray-900' 
                : 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
            }`}
            onClick={() => updateViewMode('list')}
            aria-label="Вид списком"
          >
            <List size={18} />
          </button>
        </div>
      </div>
    </div>
  )
} 