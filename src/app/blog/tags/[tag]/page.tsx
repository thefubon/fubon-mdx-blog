import { getAllPosts, getAllCategories } from '@/lib/mdx'
import Container from '@/components/ui/Container'
import TagPosts from '@/components/blog/TagPosts'

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
      <TagPosts 
        posts={filteredPosts}
        tag={tag}
        allTags={allTags}
        categories={allCategories}
      />
    </Container>
  )
}
