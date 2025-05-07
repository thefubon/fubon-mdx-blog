// src/app/blog/[slug]/page.tsx
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'
import { getAllPostSlugs, getPostBySlug, getRelatedPosts, getAllPosts } from '@/lib/mdx'
import MDXComponents from '@/components/MDXComponents'
import FormattedDate from '@/components/blog/FormattedDate'
import RelatedPosts from '@/components/blog/RelatedPosts'
import TableOfContents from '@/components/blog/TableOfContents'
import Link from 'next/link'
import Container from '@/components/ui/Container'
import Image from 'next/image'

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
      <Container
        padding={true}
        className="py-6 md:py-10">
        {/* Hero section with cover image */}
        {frontmatter.cover && (
          <div className="relative w-full h-[40vh] md:h-[50vh] mb-10">
            <div className="absolute inset-0 overflow-hidden rounded-xl">
              <Image
                src={frontmatter.cover}
                alt={frontmatter.title}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/40 to-transparent" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-10">
              <div className="mx-auto max-w-full">
                {/* Category badge */}
                {frontmatter.category && (
                  <Link
                    href={`/blog/categories/${encodeURIComponent(
                      frontmatter.category
                    )}`}
                    className="inline-block bg-blue-600 text-white text-sm px-4 py-1.5 rounded-full transition-colors mb-4 font-medium">
                    {frontmatter.category}
                  </Link>
                )}

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-sm">
                  {frontmatter.title}
                </h1>

                <div className="flex flex-wrap items-center text-white/90 mb-2 gap-2">
                  <FormattedDate
                    date={frontmatter.publishedAt}
                    className="font-medium"
                  />
                  <span className="inline-block">•</span>
                  <span className="inline-flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M12 7V12L15 15"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    {frontmatter.readingTime}
                  </span>
                </div>

                {/* Tags */}
                {frontmatter.tags && frontmatter.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {frontmatter.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/blog/tags/${encodeURIComponent(tag)}`}
                        className="text-white hover:text-blue-200 bg-white/20 backdrop-blur-sm text-sm px-3 py-1 rounded-full transition-colors">
                        #{tag}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Standard header without cover */}
        {!frontmatter.cover && (
          <header className="mb-10 w-full mx-auto">
            <div className="text-center">
              {frontmatter.category && (
                <Link
                  href={`/blog/categories/${encodeURIComponent(
                    frontmatter.category
                  )}`}
                  className="inline-block bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm px-3 py-1 rounded-full transition-colors mb-4">
                  {frontmatter.category}
                </Link>
              )}

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                {frontmatter.title}
              </h1>

              <div className="flex items-center justify-center text-gray-500 mb-4 gap-2">
                <FormattedDate date={frontmatter.publishedAt} />
                <span>•</span>
                <span className="inline-flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M12 7V12L15 15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  {frontmatter.readingTime}
                </span>
              </div>

              {/* Tags */}
              {frontmatter.tags && frontmatter.tags.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {frontmatter.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog/tags/${encodeURIComponent(tag)}`}
                      className="text-gray-700 hover:text-blue-700 bg-gray-100 hover:bg-gray-200 text-sm px-3 py-1 rounded-full transition-colors">
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {frontmatter.description && (
              <p className="text-xl text-gray-700 mt-6 text-center">
                {frontmatter.description}
              </p>
            )}
          </header>
        )}

        <div className="flex flex-col lg:flex-row lg:gap-8 relative w-full">
          {/* TableOfContents с чистыми инлайн-стилями */}
          <div className="lg:w-64 lg:flex-none">
            <TableOfContents readingTime={frontmatter.readingTime} />
          </div>
          
          <article className="prose lg:prose-lg max-w-full lg:flex-1 mx-auto lg:mx-0 overflow-hidden prose-img:max-w-full prose-img:mx-auto prose-pre:overflow-x-auto prose-pre:max-w-full">
            {/* If we have a description and a cover, show description at the start of the article */}
            {frontmatter.cover && frontmatter.description && (
              <p className="text-xl text-gray-700 font-medium mb-8">
                {frontmatter.description}
              </p>
            )}

            <MDXRemote
              source={content}
              components={MDXComponents}
            />
          </article>
        </div>

        <div className="w-full mx-auto mt-12 max-w-3xl">
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
