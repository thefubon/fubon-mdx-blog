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
      <div className="mb-10 rounded-xl bg-gray-50 dark:bg-gray-900/40 p-5 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Категории</h2>
        <div className="md:overflow-visible overflow-x-auto scrollbar-hide">
          <div className="flex space-x-2 mb-1 whitespace-nowrap md:whitespace-normal md:flex-wrap md:gap-2">
            <Link 
              href="/blog" 
              className="px-4 py-2 rounded-lg font-medium bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all hover:shadow-md"
            >
              Все статьи
            </Link>
            
            {allCategories.map(({ category: cat, count }) => (
              cat === category ? (
                <p 
                  key={cat}
                  className="px-4 py-2 rounded-lg font-medium bg-blue-600 text-white transition-all shadow-md flex items-center gap-2 cursor-default"
                >
                  {cat} <span className="inline-flex items-center justify-center bg-blue-700 text-xs rounded-full px-2 py-0.5 text-white">{count}</span>
                </p>
              ) : (
                <Link
                  key={cat}
                  href={`/blog/categories/${encodeURIComponent(cat)}`}
                  className="px-4 py-2 rounded-lg font-medium bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all hover:shadow-md flex items-center gap-2"
                >
                  {cat} <span className="inline-flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-xs rounded-full px-2 py-0.5 text-gray-600 dark:text-gray-300">{count}</span>
                </Link>
              )
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
        <h1 className="text-3xl font-bold mb-6 pb-4 border-b dark:border-gray-700">Категория: {category}</h1>
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
      </div>
    </Container>
  )
}
