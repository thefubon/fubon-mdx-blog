// src/components/RelatedPosts.tsx
import Link from 'next/link'
import Image from 'next/image'
import FormattedDate from './FormattedDate'
import { Post } from '@/lib/mdx'

interface RelatedPostsProps {
  posts: Post[]
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (!posts || posts.length === 0) {
    return null
  }

  return (
    <div className="mt-12 pt-8 border-t">
      <h2 className="text-2xl font-bold mb-6">Похожие статьи</h2>

      <div className="grid gap-6 md:grid-cols-3">
        {posts.map((post) => {
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
              className="border rounded-md p-5 hover:shadow-md transition-shadow">
              {cover && (
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
              )}

              <div className="flex flex-col h-full">
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
