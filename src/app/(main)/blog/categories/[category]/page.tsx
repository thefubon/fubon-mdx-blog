import { getPostsByCategory, getAllCategories, getAllPosts } from '@/lib/mdx'
import Container from '@/components/ui/Container'
import CategoryPosts from '@/components/blog/CategoryPosts'
import { Suspense } from 'react'
import type { Metadata } from 'next'

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

// Генерация метаданных на основе динамических данных
export async function generateMetadata(props: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const params = await props.params;
  // Декодируем категорию из URL для отображения
  const decodedCategory = decodeURIComponent(params.category)

  return {
    title: `Категория: ${decodedCategory}`,
    description: `Все статьи в категории ${decodedCategory} - Блог Fubon`,
    alternates: {
      canonical: `/blog/categories/${params.category}`,
    },
    openGraph: {
      url: `/blog/categories/${params.category}`,
      title: `Категория: ${decodedCategory} - Блог Fubon`,
      description: `Все статьи и материалы в категории ${decodedCategory} от Fubon`,
    },
  }
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
  
  // Получаем все категории для FilterDialog
  const allCategories = getAllCategories()
  
  // Собираем все уникальные теги для фильтров
  const allTags = Array.from(
    new Set(
      getAllPosts()
        .flatMap((post) => post.frontmatter.tags || [])
        .filter(Boolean)
    )
  ).sort()

  return (
    <Container className="py-10">
      <Suspense fallback={<div>Loading...</div>}>
        <CategoryPosts 
          posts={posts}
          category={category}
          totalPages={totalPages}
          currentPage={validatedPage}
          basePath={`/blog/categories/${encodeURIComponent(category)}`}
          categories={allCategories}
          allTags={allTags}
        />
      </Suspense>
    </Container>
  )
}
