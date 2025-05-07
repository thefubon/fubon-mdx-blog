'use client'

import { useState, useEffect } from 'react'
import BlogPostGrid from './BlogPostGrid'
import type { Post } from '@/lib/types'
import { ViewMode } from '@/components/blog/BlogFilters'
import { filterPosts } from '@/lib/blog-client'
import { FilterDialog } from './FilterDialog'
import FavoriteToggle from './FavoriteToggle'
import { Button } from '@/components/ui/button'
import { Grid2X2, Grid3X3, List } from 'lucide-react'

interface BlogComponentsProps {
  posts: Post[]
  categories: Array<{ category: string, count: number }>
  tags: string[]
}

// Компонент скелетона для заголовка и фильтров
function HeaderSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
      <div className="flex items-center justify-between w-full sm:w-auto">
        <div className="h-8 w-40 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
        <div className="sm:hidden w-24 h-10 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
      </div>
      <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 w-full sm:w-auto">
        <div className="h-10 w-40 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse"></div>
        <div className="hidden sm:block w-28 h-10 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
        <div className="hidden sm:block w-24 h-10 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
      </div>
    </div>
  )
}

// Клиентский компонент для синхронизации между фильтрами и сеткой постов
export default function BlogComponents({ posts, categories, tags }: BlogComponentsProps) {
  const [showFavorites, setShowFavorites] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('grid3')
  const [isSettingsLoaded, setIsSettingsLoaded] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const POSTS_PER_PAGE = 12
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE)

  // Отмечаем, что компонент смонтирован (и мы на клиенте)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Загрузка сохраненного режима отображения
  useEffect(() => {
    if (isMounted) {
      // Небольшая задержка для предотвращения мигания
      const timer = setTimeout(() => {
        const savedViewMode = localStorage.getItem('blogViewMode') as ViewMode
        const savedShowFavorites = localStorage.getItem('blogShowFavorites') === 'true'
        
        if (savedViewMode) {
          setViewMode(savedViewMode)
        }
        if (savedShowFavorites) {
          setShowFavorites(true)
        }
        
        // Отмечаем, что настройки загружены
        setIsSettingsLoaded(true)
      }, 200)
      
      return () => clearTimeout(timer)
    }
  }, [isMounted])

  // Получаем отфильтрованные посты (все, без пагинации)
  const allFilteredPosts = filterPosts(posts, {
    sortBy: 'date',
    showFavorites
  })

  // Получаем видимые посты
  const visiblePosts = allFilteredPosts.slice(0, visibleCount)

  // Сброс visibleCount при смене фильтра
  useEffect(() => {
    setVisibleCount(POSTS_PER_PAGE)
  }, [showFavorites])

  // Функция для обновления режима отображения
  const updateViewMode = (mode: ViewMode) => {
    if (isMounted) {
      setViewMode(mode)
      localStorage.setItem('blogViewMode', mode)
    }
  }

  // Функция для переключения режима избранного
  const toggleFavorites = (value: boolean) => {
    if (isMounted) {
      setShowFavorites(value)
      // Используем dispatchEvent для корректной работы слушателей
      const oldValue = localStorage.getItem('blogShowFavorites')
      localStorage.setItem('blogShowFavorites', String(value))
      
      // Dispatch event для обработки в других компонентах
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'blogShowFavorites',
        oldValue,
        newValue: String(value),
        storageArea: localStorage
      }))
      
      setVisibleCount(POSTS_PER_PAGE)
    }
  }

  // Если настройки еще не загружены, показываем скелетон
  if (!isMounted || !isSettingsLoaded) {
    // На сервере или до загрузки настроек на клиенте
    return (
      <div>
        <HeaderSkeleton />
        <BlogPostGrid 
          posts={[]} 
          viewMode={viewMode}
        />
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <div className="flex items-center justify-between w-full sm:w-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Все новости</h2>
          <div className="sm:hidden">
            <FilterDialog
              categories={categories}
              tags={tags}
              showFavorites={showFavorites}
              onShowFavoritesChange={toggleFavorites}
              viewMode={viewMode}
              onViewModeChange={updateViewMode}
            />
          </div>
        </div>
        
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 w-full sm:w-auto">
          <FavoriteToggle 
            showFavorites={showFavorites} 
            onToggle={toggleFavorites} 
          />
          
          {/* Переключатель вида отображения - только на десктопе */}
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
          
          <div className="hidden sm:block">
            <FilterDialog
              categories={categories}
              tags={tags}
              showFavorites={showFavorites}
              onShowFavoritesChange={toggleFavorites}
              viewMode={viewMode}
              onViewModeChange={updateViewMode}
            />
          </div>
        </div>
      </div>

      <BlogPostGrid 
        posts={visiblePosts} 
        viewMode={viewMode}
      />

      {visibleCount < allFilteredPosts.length && (
        <div className="mt-12 flex justify-center">
          <Button
            className="px-6 py-3"
            onClick={() => setVisibleCount((c) => c + POSTS_PER_PAGE)}
          >
            Показать ещё
          </Button>
        </div>
      )}
    </div>
  )
} 