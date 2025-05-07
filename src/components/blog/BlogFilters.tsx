'use client'

import { useState, useEffect } from 'react'
import { Grid2X2, Grid3X3, List } from 'lucide-react'

export type ViewMode = 'grid3' | 'grid2' | 'list'
export type SortMode = 'date' | 'popular'

interface BlogFiltersProps {
  showFavorites: boolean
  onShowFavoritesChange: (show: boolean) => void
  onViewModeChange?: (mode: ViewMode) => void
}

export default function BlogFilters({
  showFavorites,
  onShowFavoritesChange,
  onViewModeChange
}: BlogFiltersProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid3')

  // Загрузка состояния из localStorage при инициализации
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedViewMode = localStorage.getItem('blogViewMode') as ViewMode
      const savedShowFavorites = localStorage.getItem('blogShowFavorites') === 'true'
      
      if (savedViewMode) {
        setViewMode(savedViewMode)
      }
      if (savedShowFavorites !== showFavorites) {
        onShowFavoritesChange(savedShowFavorites)
      }
    }
  }, [showFavorites, onShowFavoritesChange])

  const updateViewMode = (mode: ViewMode) => {
    setViewMode(mode)
    if (typeof window !== 'undefined') {
      localStorage.setItem('blogViewMode', mode)
      if (onViewModeChange) {
        onViewModeChange(mode)
      }
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onShowFavoritesChange(false)}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            !showFavorites
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Все посты
        </button>
        <button
          onClick={() => onShowFavoritesChange(true)}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            showFavorites
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Избранное
        </button>
      </div>

      <div className="flex items-center gap-2">
        {/* Переключатель вида */}
        <div className="hidden sm:flex border rounded-lg dark:border-gray-700 overflow-hidden">
          <button 
            className={`p-2 transition-colors ${
              viewMode === 'grid3' 
                ? 'bg-gray-800 dark:bg-gray-700 text-white' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            } border-r dark:border-gray-700`}
            onClick={() => updateViewMode('grid3')}
            aria-label="Сетка 3x3"
          >
            <Grid3X3 size={18} />
          </button>
          <button 
            className={`p-2 transition-colors ${
              viewMode === 'grid2' 
                ? 'bg-gray-800 dark:bg-gray-700 text-white' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            } border-r dark:border-gray-700`}
            onClick={() => updateViewMode('grid2')}
            aria-label="Сетка 2x2"
          >
            <Grid2X2 size={18} />
          </button>
          <button 
            className={`p-2 transition-colors ${
              viewMode === 'list' 
                ? 'bg-gray-800 dark:bg-gray-700 text-white' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
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