// src/app/search/page.tsx
import { Link } from 'next-view-transitions'
import FormattedDate from '@/components/FormattedDate'
import SearchBar from '@/components/SearchBar'
import { getAllPosts } from '@/lib/mdx'

export default async function SearchPage(
  props: {
    searchParams: Promise<{ q: string }>
  }
) {
  const searchParams = await props.searchParams;
  const searchQuery = searchParams.q || ''

  // Получаем все посты
  const allPosts = getAllPosts()

  // Фильтруем посты по поисковому запросу
  const filteredPosts = searchQuery
    ? allPosts.filter((post) => {
        const { title, description, content } = {
          title: post.frontmatter.title.toLowerCase(),
          description: (post.frontmatter.description || '').toLowerCase(),
          content: post.content.toLowerCase(),
        }

        const query = searchQuery.toLowerCase()

        return (
          title.includes(query) ||
          description.includes(query) ||
          content.includes(query)
        )
      })
    : []

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8">
        {searchQuery ? `Результаты поиска: "${searchQuery}"` : 'Поиск'}
      </h1>

      {/* SearchBar компонент уже содержит свой собственный Suspense */}
      <div className="mb-8">
        <SearchBar />
      </div>

      {searchQuery && (
        <p className="text-gray-600 mb-8">
          {filteredPosts.length === 0
            ? `По запросу "${searchQuery}" ничего не найдено`
            : `Найдено ${filteredPosts.length} ${
                filteredPosts.length === 1
                  ? 'статья'
                  : filteredPosts.length >= 2 && filteredPosts.length <= 4
                  ? 'статьи'
                  : 'статей'
              }`}
        </p>
      )}

      {!searchQuery && (
        <p className="text-gray-600 mb-8">
          Введите поисковый запрос в форму поиска вверху страницы
        </p>
      )}

      {filteredPosts.length > 0 && (
        <div className="space-y-8">
          {filteredPosts.map((post) => {
            const { title, description, publishedAt, slug, readingTime, tags } =
              post.frontmatter

            return (
              <article
                key={slug}
                className="border-b pb-6">
                <Link href={`/blog/${slug}`}>
                  <h2 className="text-2xl font-bold hover:text-blue-600 transition-colors mb-2">
                    {title}
                  </h2>
                </Link>

                <div className="text-sm text-gray-500 mb-3">
                  <FormattedDate date={publishedAt} /> • {readingTime}
                </div>

                {/* Показываем теги для статьи */}
                {tags && tags.length > 0 && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Link
                          key={tag}
                          href={`/tags/${tag}`}
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
      )}
    </div>
  )
}
