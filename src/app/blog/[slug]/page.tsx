// src/app/blog/[slug]/page.tsx
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'
import { getAllPostSlugs, getPostBySlug, getRelatedPosts } from '@/lib/mdx'
import MDXComponents from '@/components/MDXComponents'
import FormattedDate from '@/components/FormattedDate'
import Tags from '@/components/Tags'
import RelatedPosts from '@/components/RelatedPosts'
import Link from 'next/link'

export async function generateStaticParams() {
  const posts = getAllPostSlugs()

  return posts.map((slug) => ({
    slug,
  }))
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}) {
  const slug = (await props.params).slug
  const { frontmatter } = getPostBySlug(slug)

  return {
    title: frontmatter.title,
    description: frontmatter.description,
  }
}

export default async function BlogPost(props: {
  params: Promise<{ slug: string }>
}) {
  try {
    const slug = (await props.params).slug
    const { frontmatter, content } = getPostBySlug(slug)
    const relatedPosts = getRelatedPosts(slug, frontmatter.tags || [], 3)

    return (
      <div className="max-w-3xl mx-auto py-10 px-4">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{frontmatter.title}</h1>

          <div className="text-gray-500 mb-4">
            <FormattedDate date={frontmatter.publishedAt} /> •{' '}
            {frontmatter.readingTime}
          </div>

          {/* Добавляем категорию, если она есть */}
          {frontmatter.category && (
            <div className="mb-3">
              <Link
                href={`/blog/categories/${encodeURIComponent(
                  frontmatter.category
                )}`}
                className="inline-block bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm px-3 py-1 rounded-full transition-colors">
                {frontmatter.category}
              </Link>
            </div>
          )}

          {/* Добавляем теги, если они есть */}
          {frontmatter.tags && frontmatter.tags.length > 0 && (
            <div className="mb-4">
              <Tags tags={frontmatter.tags} />
            </div>
          )}

          {frontmatter.description && (
            <p className="text-xl text-gray-700 mt-4">
              {frontmatter.description}
            </p>
          )}
        </header>

        <article className="prose lg:prose-lg max-w-none">
          <MDXRemote
            source={content}
            components={MDXComponents}
          />
        </article>

        {/* Добавляем компонент похожих статей */}
        <RelatedPosts posts={relatedPosts} />
      </div>
    )
  } catch (error) {
    console.error('Ошибка при рендеринге страницы блога:', error)
    return notFound()
  }
}
