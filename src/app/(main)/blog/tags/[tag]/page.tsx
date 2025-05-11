import { getAllPosts, getAllCategories } from '@/lib/mdx'
import Container from '@/components/ui/Container'
import TagPosts from '@/components/blog/TagPosts'
import { Suspense } from 'react'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  const posts = getAllPosts()
  const tags = new Set<string>()

  // Собираем все уникальные теги
  posts.forEach((post) => {
    const postTags = post.frontmatter.tags || []
    postTags.forEach((tag) => tags.add(tag))
  })

  return Array.from(tags).map((tag) => ({
    tag: encodeURIComponent(tag),
  }))
}

// Генерация метаданных на основе динамических данных
export async function generateMetadata({ params }: { params: { tag: string } }): Promise<Metadata> {
  // Декодируем тег из URL для отображения
  const decodedTag = decodeURIComponent(params.tag)
  
  return {
    title: `Тег: #${decodedTag}`,
    description: `Все статьи с тегом #${decodedTag} - Блог Fubon`,
    alternates: {
      canonical: `/blog/tags/${params.tag}`,
    },
    openGraph: {
      url: `/blog/tags/${params.tag}`,
      title: `Тег: #${decodedTag} - Блог Fubon`,
      description: `Все статьи и материалы с тегом #${decodedTag} от Fubon`,
    },
  }
}

export default async function TagPage(props: {
  params: Promise<{ tag: string }>
}) {
  const params = await props.params
  const tag = decodeURIComponent(params.tag)
  const allPosts = getAllPosts()

  // Фильтруем посты по тегу
  const filteredPosts = allPosts.filter((post) =>
    post.frontmatter.tags?.includes(tag)
  )
  
  // Собираем все уникальные теги для фильтров
  const allTags = Array.from(
    new Set(
      allPosts
        .flatMap((post) => post.frontmatter.tags || [])
        .filter(Boolean)
    )
  ).sort()
  
  // Получаем все категории для фильтров
  const allCategories = getAllCategories()

  return (
    <Container className="py-10">
      <Suspense fallback={<div>Loading...</div>}>
        <TagPosts 
          posts={filteredPosts}
          tag={tag}
          allTags={allTags}
          categories={allCategories}
        />
      </Suspense>
    </Container>
  )
}
