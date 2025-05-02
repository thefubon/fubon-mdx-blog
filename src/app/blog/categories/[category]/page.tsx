import Link from 'next/link'
import FormattedDate from '@/components/FormattedDate'
import { getPostsByCategory, getAllCategories } from '@/lib/mdx' // Добавлен импорт getAllCategories
import Pagination from '@/components/Pagination'

interface PageProps {
  params: Promise<{ category: string }>
  searchParams: Promise<{ page?: string }>
}

export function generateStaticParams() {
  const categories = getAllCategories()
  return categories.map(({ category }) => ({
    category: encodeURIComponent(category),
  }))
}

export default async function CategoryPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const category = decodeURIComponent(params.category)
  const currentPage = searchParams.page ? parseInt(searchParams.page, 10) : 1
  const POSTS_PER_PAGE = 5

  const {
    posts,
    totalPages,
    currentPage: validatedPage,
  } = getPostsByCategory(category, currentPage, POSTS_PER_PAGE)

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-2">Категория: {category}</h1>
      <p className="text-gray-600 mb-8">
        {posts.length}{' '}
        {posts.length === 1 ? 'статья' : posts.length < 5 ? 'статьи' : 'статей'}
      </p>

      <div className="space-y-8">
        {posts.map((post) => {
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

              <p className="text-gray-700">{description}</p>

              <Link
                href={`/blog/${slug}`}
                className="mt-4 inline-block text-blue-600 hover:underline">
                Читать далее →
              </Link>
            </article>
          )
        })}
      </div>

      {totalPages > 1 && (
        <div className="mt-12">
          <Pagination
            currentPage={validatedPage}
            totalPages={totalPages}
            basePath={`/blog/categories/${encodeURIComponent(category)}`}
          />
        </div>
      )}

      <div className="mt-10">
        <Link
          href="/blog/categories"
          className="text-blue-600 hover:underline">
          ← Все категории
        </Link>
      </div>
    </div>
  )
}
