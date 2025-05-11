import Link from 'next/link'
import { getAllCategories } from '@/lib/mdx' // Убедитесь, что импорт есть

export default function CategoriesPage() {
  const categories = getAllCategories()

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8">Все категории</h1>

      <div className="space-y-4">
        {categories.map(({ category, count }) => (
          <div
            key={category}
            className="border-b pb-4">
            <Link
              href={`/blog/categories/${encodeURIComponent(category)}`}
              className="text-2xl font-semibold hover:text-blue-600 transition-colors">
              {category}
            </Link>
            <p className="text-gray-600 mt-1">
              {count} {count === 1 ? 'статья' : count < 5 ? 'статьи' : 'статей'}
            </p>
          </div>
        ))}
      </div>

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
