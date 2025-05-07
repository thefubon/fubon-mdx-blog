// src/app/blog/[slug]/page.tsx
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'
import { getAllPostSlugs, getPostBySlug, getRelatedPosts, getAllPosts } from '@/lib/mdx'
import MDXComponents from '@/components/MDXComponents'
import FormattedDate from '@/components/blog/FormattedDate'
import Tags from '@/components/blog/Tags'
import RelatedPosts from '@/components/blog/RelatedPosts'
import TableOfContents from '@/components/blog/TableOfContents'
import Link from 'next/link'
import Container from '@/components/ui/Container'

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
    const allPosts = getAllPosts();

    return (
      <Container className="py-10">
        <header className="mb-8 max-w-3xl mx-auto">
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

        <div className="flex flex-col lg:flex-row lg:gap-8 relative">
          {/* Add a fixed width div for TableOfContents to reserve space */}
          <div className="lg:w-64 lg:flex-shrink-0" style={{ position: 'relative', height: 'auto' }}>
            <TableOfContents readingTime={frontmatter.readingTime} />
          </div>
          
          <article className="prose lg:prose-lg max-w-none lg:flex-1 mx-auto lg:mx-0">
            <MDXRemote
              source={content}
              components={MDXComponents}
            />
          </article>
        </div>

        <div className="max-w-3xl mx-auto mt-12">
          <RelatedPosts 
            posts={relatedPosts} 
            currentSlug={slug}
            allPosts={allPosts}
            currentTags={frontmatter.tags}
          />
        </div>
      </Container>
    )
  } catch (error) {
    console.error('Ошибка при рендеринге страницы блога:', error)
    return notFound()
  }
}
