'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import FavoriteToggle from './FavoriteToggle'
import { Post } from '@/lib/types'
import Pagination from '@/components/blog/Pagination'
import BlogPostGrid from './BlogPostGrid'
import { ViewMode } from './BlogFilters'
import { Button } from '@/components/ui/button'
import { Grid2X2, Grid3X3, List, ArrowLeft } from 'lucide-react'
import { FilterDialog } from './FilterDialog'

interface CategoryPostsProps {
  posts: Post[]
  category: string
  totalPages: number
  currentPage: number
  basePath: string
  categories?: Array<{ category: string, count: number }>
  allTags?: string[]
}

export default function CategoryPosts({ 
  posts, 
  category, 
  totalPages, 
  currentPage,
  basePath,
  categories,
  allTags = []
}: CategoryPostsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [showFavorites, setShowFavorites] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('grid3')
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts)
  const POSTS_PER_PAGE = 12
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE)
  
  // Загружаем настройки при монтировании компонента
  useEffect(() => {
    // Загружаем настройки из localStorage
    const savedViewMode = localStorage.getItem('blogViewMode') as ViewMode | null
    const savedShowFavorites = localStorage.getItem('blogShowFavorites') === 'true'
    
    if (savedViewMode) {
      setViewMode(savedViewMode)
    }
    
    setShowFavorites(savedShowFavorites)
    
    if (savedShowFavorites) {
      setFilteredPosts(posts.filter(post => post.frontmatter.favorite))
    } else {
      setFilteredPosts(posts)
    }
  }, [posts])
  
  // Обработчик для переключения режима избранного
  const handleToggleFavorites = (value: boolean) => {
    setShowFavorites(value)
    
    // Сохраняем в localStorage
    const oldValue = localStorage.getItem('blogShowFavorites')
    localStorage.setItem('blogShowFavorites', String(value))
    
    // Dispatch event для обработки в других компонентах
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'blogShowFavorites',
      oldValue,
      newValue: String(value),
      storageArea: localStorage
    }))
    
    // Фильтруем посты
    if (value) {
      setFilteredPosts(posts.filter(post => post.frontmatter.favorite))
      
      // Если включили режим "Избранное" и находимся не на первой странице,
      // перенаправляем на первую страницу категории
      const page = searchParams.get('page')
      if (page) {
        const basePath = pathname.split('?')[0]
        router.push(basePath)
      }
    } else {
      setFilteredPosts(posts)
    }
    
    // Сбрасываем счетчик видимых постов
    setVisibleCount(POSTS_PER_PAGE)
  }
  
  // Функция для обновления режима отображения
  const updateViewMode = (mode: ViewMode) => {
    setViewMode(mode)
    localStorage.setItem('blogViewMode', mode)
  }
  
  // Получаем видимые посты
  const visiblePosts = filteredPosts.slice(0, visibleCount)
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/blog">
                <ArrowLeft size={20} />
              </Link>
            </Button>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Категория: {category}</h2>
          </div>
          <div className="sm:hidden">
            <FilterDialog
              categories={categories || [{ category, count: filteredPosts.length }]}
              currentCategory={category}
              tags={allTags}
              showFavorites={showFavorites}
              onShowFavoritesChange={handleToggleFavorites}
              viewMode={viewMode}
              onViewModeChange={updateViewMode}
            />
          </div>
        </div>
        
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 w-full sm:w-auto">
          <FavoriteToggle 
            showFavorites={showFavorites} 
            onToggle={handleToggleFavorites} 
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
              categories={categories || [{ category, count: filteredPosts.length }]}
              currentCategory={category}
              tags={allTags}
              showFavorites={showFavorites}
              onShowFavoritesChange={handleToggleFavorites}
              viewMode={viewMode}
              onViewModeChange={updateViewMode}
            />
          </div>
        </div>
      </div>

      {/* Блок с постами */}
      <BlogPostGrid 
        posts={visiblePosts} 
        viewMode={viewMode}
      />
      
      {visibleCount < filteredPosts.length && (
        <div className="mt-12 flex justify-center">
          <Button
            className="px-6 py-3"
            onClick={() => setVisibleCount((c) => c + POSTS_PER_PAGE)}
          >
            Показать ещё
          </Button>
        </div>
      )}
      
      {/* Пагинация, когда нет фильтра по избранному и есть несколько страниц */}
      {!showFavorites && totalPages > 1 && (
        <div id="server-pagination">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath={basePath}
          />
        </div>
      )}
    </div>
  )
} 