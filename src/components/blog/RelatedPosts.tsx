'use client'

import Link from 'next/link'
import Image from 'next/image'
import FormattedDate from '@/components/blog/FormattedDate'
import { Post } from '@/lib/types'
import { getRelatedPostsClient } from '@/lib/blog-client'

interface RelatedPostsProps {
  posts: Post[]
  currentSlug?: string
  allPosts?: Post[]
  currentTags?: string[]
}

export default function RelatedPosts({ posts, currentSlug, allPosts, currentTags }: RelatedPostsProps) {
  // Если есть все необходимые данные для динамического поиска связанных постов
  let relatedPosts = posts;
  
  if (currentSlug && allPosts && currentTags && allPosts.length > 0) {
    // Используем клиентскую функцию для поиска связанных постов
    relatedPosts = getRelatedPostsClient(allPosts, currentSlug, currentTags, 3);
  }
  
  if (!relatedPosts || relatedPosts.length === 0) {
    return null
  }

  return (
    <div className="mt-12 pt-8 border-t">
      <h2 className="text-2xl font-bold mb-6">Похожие статьи</h2>

      <div className="grid gap-6 md:grid-cols-3">
        {relatedPosts.map((post) => {
          const {
            title,
            publishedAt,
            slug,
            readingTime,
            tags,
            cover,
            category,
          } = post.frontmatter

          return (
            <article
              key={slug}
              className="rounded-md p-5 hover:shadow-md transition-shadow">
              {cover ? (
                <div className="mb-4 rounded-md overflow-hidden h-40 relative">
                  <Link href={`/blog/${slug}`}>
                    <Image
                      src={cover}
                      alt={title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </Link>
                </div>
              ) : (
                <div className="mb-4 rounded-md overflow-hidden h-40 relative bg-gray-200 dark:bg-gray-800 flex flex-col items-center justify-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="32" 
                    height="32" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor"
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="text-gray-400 dark:text-gray-500 mb-1"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span className="text-gray-500 dark:text-gray-400 text-xs font-medium">Нет изображения</span>
                </div>
              )}

              <div className="flex flex-col">
                {category && (
                  <Link
                    href={`/blog/categories/${encodeURIComponent(category)}`}
                    className="text-xs font-medium text-blue-600 hover:text-blue-800 mb-2">
                    {category}
                  </Link>
                )}

                <Link href={`/blog/${slug}`}>
                  <h3 className="text-lg font-bold hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                    {title}
                  </h3>
                </Link>

                <div className="text-sm text-gray-500 mb-3">
                  <FormattedDate date={publishedAt} /> • {readingTime}
                </div>

                {tags && tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {tags.slice(0, 3).map((tag) => (
                      <Link
                        key={tag}
                        href={`/blog/tags/${tag}`}
                        className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                        #{tag}
                      </Link>
                    ))}

                    {tags.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
} 