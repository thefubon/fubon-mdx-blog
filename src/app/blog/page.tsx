// src/app/blog/page.tsx
import Link from 'next/link'
import Image from 'next/image'
import { getAllPosts, getPaginatedPosts } from '@/lib/mdx'
import FormattedDate from '@/components/FormattedDate'
import SearchBar from '@/components/SearchBar'
import Pagination from '@/components/Pagination'
import CustomCursor from '@/components/CustomCursor'

// Константа для количества постов на странице
const POSTS_PER_PAGE = 10

// Функция для страницы блога с учетом номера страницы в параметрах
interface PageProps {
  searchParams?: Promise<{ page?: string }>
}

export default async function BlogPage(props: PageProps) {
  const searchParams = await props.searchParams;
  // Получаем номер текущей страницы из query параметров, если есть
  const currentPage = searchParams?.page ? parseInt(searchParams.page, 10) : 1

  // Получаем посты для текущей страницы с пагинацией
  const {
    posts,
    totalPages,
    currentPage: validatedPage,
  } = getPaginatedPosts(currentPage, POSTS_PER_PAGE)

  // Собираем все уникальные теги из всех постов
  const allTags = Array.from(
    new Set(
      getAllPosts()
        .flatMap((post) => post.frontmatter.tags || [])
        .filter(Boolean)
    )
  ).sort()

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-6">Блог</h1>

      {/* Компонент поиска уже содержит свой собственный Suspense */}
      <div className="mb-6">
        <SearchBar />
      </div>

      {/* Список всех тегов */}
      {allTags.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Все теги</h2>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Link
                key={tag}
                href={`/blog/tags/${tag}`}
                className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full transition-colors">
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-8">
        {posts.map((post) => {
          const {
            title,
            description,
            publishedAt,
            slug,
            readingTime,
            tags,
            cover,
          } = post.frontmatter

          return (
            <article
              key={slug}
              className="border-b pb-6 hover-cursor">
              <CustomCursor />
              <Link href={`/blog/${slug}`}>
                {cover && (
                  <div className="mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={cover}
                      alt={title}
                      width={800}
                      height={450}
                      className="w-full h-auto object-cover"
                      priority={true} // или true для первого изображения
                    />
                  </div>
                )}
              </Link>

              <Link href={`/blog/${slug}`}>
                <h2 className="text-2xl font-bold hover:text-blue-600 transition-colors mb-2">
                  {title}
                </h2>
              </Link>

              <div className="text-sm text-gray-500 mb-3">
                <FormattedDate date={publishedAt} /> • {readingTime}
              </div>

              {/* Показываем теги для каждой статьи */}
              {tags && tags.length > 0 && (
                <div className="mb-3">
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/blog/tags/${tag}`}
                        className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full transition-colors">
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {description && <p className="text-gray-700">{description}</p>}

              <Link
                href={`/blog/${slug}`}
                className="mt-4 inline-block text-blue-600 hover:underline">
                Читать далее →
              </Link>
            </article>
          )
        })}
      </div>

      {/* Компонент пагинации */}
      <div className="mt-12">
        <Pagination
          currentPage={validatedPage}
          totalPages={totalPages}
          basePath="/blog"
        />
      </div>
    </div>
  )
}
