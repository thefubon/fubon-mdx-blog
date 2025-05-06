'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import FormattedDate from '@/components/blog/FormattedDate'
import { ViewMode, SortMode } from '@/components/blog/BlogFilters'
import type { Post } from '@/lib/types'
import { Star } from 'lucide-react'
import { filterPosts } from '@/lib/blog-client'

// Экспортируем тип пропсов для внешнего использования
export interface BlogPostGridProps {
  posts: Post[]
  onFilteredCountChange?: (count: number) => void
}

export default function BlogPostGrid({ posts, onFilteredCountChange }: BlogPostGridProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid4')
  const [sortMode, setSortMode] = useState<SortMode>('new')
  
  // Сортировка постов в зависимости от режима
  const sortedPosts = useMemo(() => {
    const sortBy = sortMode === 'popular' ? 'popular' : 'date';
    return filterPosts(posts, { sortBy });
  }, [posts, sortMode])
  
  // Обновляем информацию о количестве постов в родительском компоненте
  useEffect(() => {
    if (onFilteredCountChange && sortedPosts.length > 0) {
      // Используем setTimeout, чтобы убедиться, что это происходит после гидратации
      const timer = setTimeout(() => {
        onFilteredCountChange(sortedPosts.length);
      }, 0);
      
      return () => clearTimeout(timer);
    }
  }, [sortedPosts, onFilteredCountChange]);
  
  // Загружаем режимы из localStorage при инициализации и в ответ на события
  const updateFromLocalStorage = useCallback(() => {
    if (typeof window !== 'undefined') {
      const savedViewMode = localStorage.getItem('blogViewMode') as ViewMode
      const savedSortMode = localStorage.getItem('blogSortMode') as SortMode
      
      if (savedViewMode && savedViewMode !== viewMode) {
        setViewMode(savedViewMode)
      }
      
      if (savedSortMode && savedSortMode !== sortMode) {
        setSortMode(savedSortMode)
      }
    }
  }, [viewMode, sortMode]);
  
  // При первоначальной загрузке
  useEffect(() => {
    updateFromLocalStorage()
    
    // Настраиваем слушатель события хранилища
    if (typeof window !== 'undefined') {
      const handleStorageChange = () => {
        updateFromLocalStorage()
      }
      
      // Обработчик изменения размера окна
      const handleResize = () => {
        updateFromLocalStorage()
      }
      
      window.addEventListener('storage', handleStorageChange)
      window.addEventListener('resize', handleResize)
      
      // Также проверяем изменения каждые 500 мс для большей надежности
      const interval = setInterval(updateFromLocalStorage, 500)
      
      return () => {
        window.removeEventListener('storage', handleStorageChange)
        window.removeEventListener('resize', handleResize)
        clearInterval(interval)
      }
    }
  }, [updateFromLocalStorage])

  // Рендер поста в виде карточки
  const renderPostCard = (post: Post, isCompact = false) => {
    const {
      title,
      description,
      publishedAt,
      slug,
      readingTime,
      tags,
      cover,
      category,
      favorite
    } = post.frontmatter
    
    const grid2Classes = isCompact ? 'md:col-span-1' : 'md:col-span-2'

    return (
      <article
        key={slug}
        className={`flex flex-col border dark:border-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer h-full ${viewMode === 'grid2' ? grid2Classes : ''}`}>
        <Link href={`/blog/${slug}`} className="block overflow-hidden aspect-video relative">
          {cover ? (
            <Image
              src={cover}
              alt={title}
              width={800}
              height={450}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              priority={true}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex flex-col items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="40" 
                height="40" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor"
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-gray-400 dark:text-gray-500 mb-2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">Нет изображения</span>
            </div>
          )}
          
          {favorite && (
            <div className="absolute top-2 right-2 text-yellow-500 bg-black/30 p-1.5 rounded-full">
              <Star size={16} fill="currentColor" />
            </div>
          )}
        </Link>

        <div className="flex flex-col flex-grow p-4">
          <div className="mb-2">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              <FormattedDate date={publishedAt} /> • {readingTime}
            </div>
            
            {/* Категория */}
            {category && (
              <Link
                href={`/blog/categories/${encodeURIComponent(category)}`}
                className="inline-block bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full transition-colors mr-1">
                {category}
              </Link>
            )}
          </div>

          <Link href={`/blog/${slug}`} className="block mb-2">
            <h3 className="font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2">
              {title}
            </h3>
          </Link>

          {description && (
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 line-clamp-3">
              {description}
            </p>
          )}

          {/* Теги */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-auto mb-2">
              {tags.slice(0, 3).map((tag) => (
                <Link
                  key={tag}
                  href={`/blog/tags/${tag}`}
                  className="inline-block bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-2 py-0.5 rounded-full transition-colors">
                  #{tag}
                </Link>
              ))}
              {tags.length > 3 && (
                <span className="text-xs text-gray-500 dark:text-gray-400 px-1">
                  +{tags.length - 3}
                </span>
              )}
            </div>
          )}

          <Link
            href={`/blog/${slug}`}
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm mt-auto inline-block">
            Читать далее →
          </Link>
        </div>
      </article>
    )
  }

  if (viewMode === 'list') {
    // Отображение в виде списка
    return (
      <div className="space-y-6">
        {sortedPosts.map((post) => {
          const {
            title,
            description,
            publishedAt,
            slug,
            readingTime,
            tags,
            cover,
            category,
            favorite
          } = post.frontmatter

          return (
            <article
              key={slug}
              className="flex flex-col sm:flex-row border dark:border-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer">
              
              {/* Изображение слева только для планшетов и больше */}
              <div className="sm:w-[280px] shrink-0 relative">
                <Link href={`/blog/${slug}`} className="block h-full overflow-hidden">
                  {cover ? (
                    <Image
                      src={cover}
                      alt={title}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 sm:aspect-[4/3]"
                      priority={true}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex flex-col items-center justify-center aspect-video sm:aspect-[4/3]">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="36" 
                        height="36" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor"
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="text-gray-400 dark:text-gray-500 mb-2"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">Нет изображения</span>
                    </div>
                  )}
                </Link>
                
                {favorite && (
                  <div className="absolute top-2 right-2 text-yellow-500 bg-black/30 p-1.5 rounded-full">
                    <Star size={16} fill="currentColor" />
                  </div>
                )}
              </div>

              <div className="flex flex-col p-4 flex-grow">
                <div className="mb-2 flex justify-between">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    <FormattedDate date={publishedAt} /> • {readingTime}
                  </div>
                  
                  {/* Категория */}
                  {category && (
                    <Link
                      href={`/blog/categories/${encodeURIComponent(category)}`}
                      className="inline-block bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full transition-colors">
                      {category}
                    </Link>
                  )}
                </div>

                <Link href={`/blog/${slug}`} className="block mb-2">
                  <h3 className="font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {title}
                  </h3>
                </Link>

                {description && (
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                    {description}
                  </p>
                )}

                <div className="flex items-center justify-between mt-auto">
                  {/* Теги */}
                  {tags && tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {tags.slice(0, 3).map((tag) => (
                        <Link
                          key={tag}
                          href={`/blog/tags/${tag}`}
                          className="inline-block bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-2 py-0.5 rounded-full transition-colors">
                          #{tag}
                        </Link>
                      ))}
                      {tags.length > 3 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 px-1">
                          +{tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <Link
                    href={`/blog/${slug}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm inline-block ml-auto">
                    Читать далее →
                  </Link>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    )
  }
  
  if (viewMode === 'grid2') {
    // Отображение в виде сетки 2x2
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedPosts.map((post) => renderPostCard(post, true))}
      </div>
    )
  }
  
  // Отображение в виде сетки 4x4 (по умолчанию)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {sortedPosts.map((post) => renderPostCard(post))}
    </div>
  )
} 