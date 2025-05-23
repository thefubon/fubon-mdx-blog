import Link from 'next/link'
import Image from 'next/image'
import { getAllPosts, getPaginatedPosts, getAllCategories } from '@/lib/mdx'
import FormattedDate from '@/components/blog/FormattedDate'
import Pagination from '@/components/blog/Pagination'
import PageWrapper from '@/components/PageWrapper'
import Container from '@/components/ui/Container'
import { ChevronRight, Home, ArrowRight, Star } from 'lucide-react'
import BlogComponents from '@/components/blog/BlogComponents'
import PaginationVisibilityHandler from '@/components/blog/PaginationVisibilityHandler'
import { Suspense } from 'react'
import type { Metadata } from 'next'

// Константа для количества постов на странице
const POSTS_PER_PAGE = 12

// Функция для страницы блога с учетом номера страницы в параметрах
interface PageProps {
  searchParams?: Promise<{ page?: string }>
}

// Компонент для динамического контента, который поддерживает как серверный, так и клиентский рендеринг
async function BlogContent({ page }: { page: number }) {
  // Получаем все посты для отображения героя
  const allPosts = getAllPosts()
  const latestPost = allPosts[0] // Первый пост - самый новый

  // Получаем посты для текущей страницы с пагинацией (исключая последний пост, если мы на первой странице)
  const {
    posts,
    totalPages,
    currentPage: validatedPage,
  } = page === 1
      ? getPaginatedPosts(page, POSTS_PER_PAGE, [latestPost.frontmatter.slug])
      : getPaginatedPosts(page, POSTS_PER_PAGE)

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
    <>
      {/* Hero section с последним постом - показываем только на первой странице */}
      {page === 1 && latestPost && (
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
                  <span>{latestPost.frontmatter.readingTime.replace('min read', 'мин. чтения')}</span>
                  
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
          </Container>
        </div>
      )}
      
      <Container padding space className={page === 1 ? "py-8" : "py-16"}>
        {/* Если мы на странице > 1, добавляем breadcrumbs */}
        {page > 1 && (
          <nav className="flex items-center text-sm mb-6 text-gray-500 dark:text-gray-400">
            <Link href="/" className="flex items-center hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              <Home className="w-4 h-4 mr-1" />
              <span>Главная</span>
            </Link>
            <ChevronRight className="w-4 h-4 mx-1" />
            <Link href="/blog" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Блог</Link>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="text-gray-900 dark:text-gray-200 font-medium">Страница {page}</span>
          </nav>
        )}
        
        {/* Компоненты фильтров и постов */}
        <Suspense fallback={<div>Loading blog content...</div>}>
          <BlogComponents 
            posts={posts}
            categories={allCategories}
            tags={allTags}
          />
        </Suspense>

        {/* Компонент пагинации */}
        <div id="server-pagination" className="mt-12">
          <Pagination
            currentPage={validatedPage}
            totalPages={totalPages}
            basePath="/blog"
          />
        </div>
      </Container>
    </>
  )
}

export default async function BlogPage(props: PageProps) {
  const searchParams = await props.searchParams;
  // Получаем номер текущей страницы из query параметров, если есть
  const currentPage = searchParams?.page ? parseInt(searchParams.page, 10) : 1

  return (
    <PageWrapper>
      {/* Рендерим контент напрямую, без Suspense и скелетонов */}
      <BlogContent page={currentPage} />
      
      {/* Используем клиентский компонент для управления видимостью пагинации */}
      <Suspense fallback={null}>
        <PaginationVisibilityHandler />
      </Suspense>
    </PageWrapper>
  )
}

export const metadata: Metadata = {
  title: 'Блог',
  description: 'Статьи и новости о дизайне, разработке и технологиях от команды Fubon',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    url: '/blog',
    title: 'Блог Fubon - Статьи о дизайне и разработке',
    description: 'Полезные материалы, обзоры технологий и практические советы от экспертов креативного агентства Fubon',
  },
}
