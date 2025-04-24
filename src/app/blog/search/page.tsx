import Link from 'next/link'
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
          // Исправляем проблему с возможным undefined в description
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
      <h1 className="text-4xl font-bold mb-8">Поиск</h1>

      <SearchBar />

      {searchQuery && (
        <p className="text-gray-600 mb-8">
          {filteredPosts.length === 0
            ? `По запросу "${searchQuery}" ничего не найдено`
            : `Найдено ${filteredPosts.length} статей по запросу "${searchQuery}"`}
        </p>
      )}

      {filteredPosts.length > 0 && (
        <div className="space-y-8">
          {filteredPosts.map((post) => {
            const { title, description, publishedAt, slug, readingTime } =
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

                {/* Добавляем проверку на наличие description */}
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
