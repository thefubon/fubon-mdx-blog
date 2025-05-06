import Link from 'next/link'
import FormattedDate from '@/components/blog/FormattedDate'
import SearchBar from '@/components/blog/SearchBar'
import { getAllPosts } from '@/lib/mdx'
import Tags from '@/components/blog/Tags'
import Container from '@/components/ui/Container'

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
  
  // Собираем все уникальные теги для навигации
  const allTags = Array.from(
    new Set(
      allPosts
        .flatMap((post) => post.frontmatter.tags || [])
        .filter(Boolean)
    )
  ).sort()

  return (
    <Container className="py-10">
      {/* Tags Navigation */}
      <div className="mb-8 overflow-x-auto scrollbar-hide pb-2">
        <div className="flex gap-2 whitespace-nowrap">
          <Link
            href="/blog"
            className="inline-flex items-center justify-center h-9 px-4 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Все
          </Link>
          
          {allTags.map((t) => (
            t === tag ? (
              <p 
                key={t}
                className="inline-flex items-center justify-center h-9 px-4 bg-gray-900 text-white text-sm font-medium rounded-full cursor-default"
              >
                {t}
              </p>
            ) : (
              <Link
                key={t}
                href={`/blog/tags/${t}`}
                className="inline-flex items-center justify-center h-9 px-4 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {t}
              </Link>
            )
          ))}
        </div>
      </div>

      <h1 className="text-4xl font-bold mb-2">Тег: #{tag}</h1>
      <div className="text-gray-600 dark:text-gray-400 mb-8"></div>

      <SearchBar />

      <div className="space-y-8">
        {filteredPosts.map((post) => {
          const { title, description, publishedAt, slug, readingTime, tags } =
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

              {tags && <Tags tags={tags} />}

              <Link
                href={`/blog/${slug}`}
                className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline">
                Читать далее →
              </Link>
            </article>
          )
        })}
      </div>
    </Container>
  )
}
