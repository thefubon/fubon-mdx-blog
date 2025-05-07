import { getPostsByCategory, getAllCategories, getAllPosts } from '@/lib/mdx'
import Container from '@/components/ui/Container'
import CategoryPosts from '@/components/blog/CategoryPosts'

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
      <CategoryPosts 
        posts={posts}
        category={category}
        totalPages={totalPages}
        currentPage={validatedPage}
        basePath={`/blog/categories/${encodeURIComponent(category)}`}
        categories={allCategories}
        allTags={allTags}
      />
    </Container>
  )
}
