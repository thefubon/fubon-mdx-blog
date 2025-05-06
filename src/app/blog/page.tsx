import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react'
import { getAllPosts, getPaginatedPosts, getAllCategories } from '@/lib/mdx'
import FormattedDate from '@/components/blog/FormattedDate'
import Pagination from '@/components/blog/Pagination'
import PageWrapper from '@/components/PageWrapper'
import Container from '@/components/ui/Container'
import { ChevronRight, Home, ArrowRight, Star } from 'lucide-react'
import BlogSkeleton from '@/components/blog/skeletons/BlogSkeleton'
import BlogComponents from '@/components/blog/BlogComponents'

// Константа для количества постов на странице
const POSTS_PER_PAGE = 8

// Функция для страницы блога с учетом номера страницы в параметрах
interface PageProps {
  searchParams?: Promise<{ page?: string }>
}

export default async function BlogPage(props: PageProps) {
  const searchParams = await props.searchParams;
  // Получаем номер текущей страницы из query параметров, если есть
  const currentPage = searchParams?.page ? parseInt(searchParams.page, 10) : 1

  // Получаем все посты для отображения героя
  const allPosts = getAllPosts()
  const latestPost = allPosts[0] // Первый пост - самый новый

  // Получаем посты для текущей страницы с пагинацией (исключая последний пост, если мы на первой странице)
  const {
    posts,
    totalPages,
    currentPage: validatedPage,
  } = currentPage === 1
      ? getPaginatedPosts(currentPage, POSTS_PER_PAGE, [latestPost.frontmatter.slug])
      : getPaginatedPosts(currentPage, POSTS_PER_PAGE)

  // Собираем все уникальные теги из всех постов
  const allTags = Array.from(
    new Set(
      getAllPosts()
        .flatMap((post) => post.frontmatter.tags || [])
        .filter(Boolean)
    )
  ).sort()

  // Получаем все категории с количеством постов
  const allCategories = getAllCategories()

  return (
    <PageWrapper>
      {/* Hero section с последним постом */}
      <div className="py-16">
        <Container>
          {/* Breadcrumbs */}
          <nav className="flex items-center text-sm mb-6 text-gray-500 dark:text-gray-400">
            <Link href="/" className="flex items-center hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              <Home className="w-4 h-4 mr-1" />
              <span>Главная</span>
            </Link>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="text-gray-900 dark:text-gray-200 font-medium">Блог</span>
          </nav>
          
          {currentPage === 1 && latestPost && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-8 items-center">
              <div>
                {latestPost.frontmatter.category && (
                  <Link
                    href={`/blog/categories/${encodeURIComponent(latestPost.frontmatter.category)}`}
                    className="inline-block bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs px-3 py-1.5 rounded-full transition-colors mb-4">
                    {latestPost.frontmatter.category}
                  </Link>
                )}
                
                <h1 className="font-bold mb-4 text-gray-900 dark:text-white leading-tight">
                  {latestPost.frontmatter.title}
                </h1>
                
                <div className="flex items-center mb-4 text-sm text-gray-600 dark:text-gray-300">
                  <FormattedDate date={latestPost.frontmatter.publishedAt} /> 
                  <span className="mx-2">•</span> 
                  <span>{latestPost.frontmatter.readingTime}</span>
                  
                  {latestPost.frontmatter.favorite && (
                    <>
                      <span className="mx-2">•</span>
                      <span className="text-yellow-500 flex items-center">
                        <Star size={14} fill="currentColor" className="mr-1" />
                        Избранное
                      </span>
                    </>
                  )}
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                  {latestPost.frontmatter.description}
                </p>
                
                <Link
                  href={`/blog/${latestPost.frontmatter.slug}`}
                  className="inline-flex items-center bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg transition-colors">
                  Читать статью <ArrowRight size={18} className="ml-2" />
                </Link>
              </div>
              
              <div className="relative rounded-2xl overflow-hidden aspect-square md:aspect-auto shadow-xl">
                {latestPost.frontmatter.cover ? (
                  <Image
                    src={latestPost.frontmatter.cover}
                    alt={latestPost.frontmatter.title}
                    width={800}
                    height={600}
                    className="w-full h-full object-cover"
                    priority={true}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex flex-col items-center justify-center min-h-[300px]">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="64" 
                      height="64" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor"
                      strokeWidth="1.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="text-gray-400 dark:text-gray-500 mb-3"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <span className="text-gray-500 dark:text-gray-400 text-base font-medium">Нет изображения</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </Container>
      </div>
      
      <Container padding space className="py-8">
        {/* Categories */}
        <div className="mb-8 overflow-x-auto scrollbar-hide">
          <div className="flex space-x-1 border-b dark:border-gray-800 mb-4 pb-1 whitespace-nowrap">
            <p className="px-4 py-2 rounded-t-lg font-medium bg-gray-900 text-white cursor-default">
              Все статьи
            </p>
            
            {allCategories.map(({ category, count }) => (
              <Link
                key={category}
                href={`/blog/categories/${encodeURIComponent(category)}`}
                className="px-4 py-2 rounded-t-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {category} <span className="text-xs ml-1 text-gray-500 dark:text-gray-400">({count})</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Tags */}
        {allTags.length > 0 && (
          <div className="mb-8 overflow-x-auto scrollbar-hide pb-2">
            <div className="flex gap-2 whitespace-nowrap">
              <p className="inline-flex items-center justify-center h-9 px-4 bg-gray-900 text-white text-sm font-medium rounded-full cursor-default">
                Все
              </p>
              
              {allTags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog/tags/${tag}`}
                  className="inline-flex items-center justify-center h-9 px-4 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Компоненты фильтров и постов с использованием Suspense */}
        <Suspense fallback={<BlogSkeleton />}>
          {/* Клиентский компонент с фильтрами и сеткой постов */}
          <BlogComponents 
            posts={posts} 
          />
        </Suspense>

        {/* Компонент пагинации */}
        <div className="mt-12">
          <Pagination
            currentPage={validatedPage}
            totalPages={totalPages}
            basePath="/blog"
          />
        </div>
      </Container>
    </PageWrapper>
  )
}
