'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Star } from 'lucide-react'
import FormattedDate from '@/components/blog/FormattedDate'
import type { Post } from '@/lib/types'
import type { ViewMode } from './BlogFilters'
import { translateReadingTime } from '@/lib/utils'

interface BlogPostGridProps {
  posts: Post[]
  viewMode: ViewMode
}

export default function BlogPostGrid({ posts, viewMode }: BlogPostGridProps) {
  // Рендер поста в виде карточки
  const renderPostCard = (post: Post) => {
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
        className="flex flex-col rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer h-full">
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
              <FormattedDate date={publishedAt} /> • {translateReadingTime(readingTime)}
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
        {posts.map((post) => {
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
              className="flex flex-col sm:flex-row rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer">
              
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
                  
                  {favorite && (
                    <div className="absolute top-2 right-2 text-yellow-500 bg-black/30 p-1.5 rounded-full">
                      <Star size={16} fill="currentColor" />
                    </div>
                  )}
                </Link>
              </div>

              <div className="flex flex-col flex-grow p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <FormattedDate date={publishedAt} /> • {translateReadingTime(readingTime)}
                    </div>
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
                  <h3 className="text-xl font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {title}
                  </h3>
                </Link>
                
                {description && (
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                    {description}
                  </p>
                )}
                
                <div className="flex justify-between items-center mt-auto">
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
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm ml-auto inline-block">
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
  
  // Для сетки определяем класс в зависимости от количества колонок
  const gridClass = viewMode === 'grid3'
    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
    : viewMode === 'grid2' 
      ? 'grid-cols-1 sm:grid-cols-2' 
      : 'grid-cols-1';
  
  // Отображение в виде сетки
  return (
    <div className={`grid ${gridClass} gap-6`}>
      {posts.map(renderPostCard)}
    </div>
  )
} 