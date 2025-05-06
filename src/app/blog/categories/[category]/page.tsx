import Link from 'next/link'
import FormattedDate from '@/components/blog/FormattedDate'
import { getPostsByCategory, getAllCategories } from '@/lib/mdx' // Добавлен импорт getAllCategories
import Pagination from '@/components/blog/Pagination'
import Container from '@/components/ui/Container'

interface PageProps {
  params: Promise<{ category: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateStaticParams() {
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
  
  // Получаем все категории для навигации
  const allCategories = getAllCategories()

  return (
    <Container className="py-10">
      {/* Categories navigation */}
      <div className="mb-8 overflow-x-auto scrollbar-hide">
        <div className="flex space-x-1 border-b dark:border-gray-800 mb-4 pb-1 whitespace-nowrap">
          <Link 
            href="/blog" 
            className="px-4 py-2 rounded-t-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Все статьи
          </Link>
          
          {allCategories.map(({ category: cat, count }) => (
            cat === category ? (
              <p 
                key={cat}
                className="px-4 py-2 rounded-t-lg font-medium bg-gray-900 text-white cursor-default"
              >
                {cat} <span className="text-xs ml-1 text-gray-300">({count})</span>
              </p>
            ) : (
              <Link
                key={cat}
                href={`/blog/categories/${encodeURIComponent(cat)}`}
                className="px-4 py-2 rounded-t-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {cat} <span className="text-xs ml-1 text-gray-500 dark:text-gray-400">({count})</span>
              </Link>
            )
          ))}
        </div>
      </div>

      <h1 className="text-4xl font-bold mb-2">Категория: {category}</h1>
      <div className="mb-8"></div>

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

              <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                <FormattedDate date={publishedAt} /> • {readingTime}
              </div>

              <p className="text-gray-700 dark:text-gray-300">{description}</p>

              <Link
                href={`/blog/${slug}`}
                className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline">
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
    </Container>
  )
}
