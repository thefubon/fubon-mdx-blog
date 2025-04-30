import Link from 'next/link'
import { getAllPosts } from '@/lib/mdx'

export default function TagsPage() {
  const allPosts = getAllPosts()

  // Собираем все теги и считаем количество статей с каждым тегом
  const tagCounts: Record<string, number> = {}

  allPosts.forEach((post) => {
    const postTags = post.frontmatter.tags || []
    postTags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })

  // Сортируем теги по популярности (количеству статей)
  const sortedTags = Object.keys(tagCounts).sort(
    (a, b) => tagCounts[b] - tagCounts[a]
  )

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8">Все теги</h1>

      <div className="flex flex-wrap gap-3">
        {sortedTags.map((tag) => {
          const count = tagCounts[tag]
          const fontSize = Math.max(1, Math.min(2, 1 + count / 10)) // Размер шрифта от 1rem до 2rem

          return (
            <Link
              key={tag}
              href={`/blog/tags/${encodeURIComponent(tag)}`}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition-colors"
              style={{ fontSize: `${fontSize}rem` }}>
              {tag}
              <span className="ml-2 text-gray-500 text-sm">({count})</span>
            </Link>
          )
        })}
      </div>

      {sortedTags.length === 0 && (
        <p className="text-gray-600">Теги пока не созданы.</p>
      )}

      <div className="mt-10">
        <Link
          href="/blog"
          className="text-blue-600 hover:underline">
          ← Вернуться к блогу
        </Link>
      </div>
    </div>
  )
}
