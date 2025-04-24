import Link from 'next/link'
import FormattedDate from '@/components/FormattedDate'
import SearchBar from '@/components/SearchBar'
import { getAllPosts } from '@/lib/mdx'
import Tags from '@/components/Tags'

export function generateStaticParams() {
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

export default async function TagPage(props: { params: Promise<{ tag: string }> }) {
  const params = await props.params;
  const tag = decodeURIComponent(params.tag)
  const allPosts = getAllPosts()

  // Фильтруем посты по тегу
  const filteredPosts = allPosts.filter((post) =>
    post.frontmatter.tags?.includes(tag)
  )

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-2">Тег: #{tag}</h1>
      <p className="text-gray-600 mb-8">
        {filteredPosts.length}{' '}
        {filteredPosts.length === 1
          ? 'статья'
          : filteredPosts.length > 1 && filteredPosts.length < 5
          ? 'статьи'
          : 'статей'}
      </p>

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

              <div className="text-sm text-gray-500 mb-3">
                <FormattedDate date={publishedAt} /> • {readingTime}
              </div>

              <p className="text-gray-700">{description}</p>

              {tags && <Tags tags={tags} />}

              <Link
                href={`/blog/${slug}`}
                className="mt-4 inline-block text-blue-600 hover:underline">
                Читать далее →
              </Link>
            </article>
          )
        })}
      </div>
    </div>
  )
}
