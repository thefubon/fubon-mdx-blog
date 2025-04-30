import Link from 'next/link'
import Image from 'next/image'
import { getAllPosts } from '@/lib/mdx'
import PageWrapper from '@/components/PageWrapper'
import CustomCursor from '@/components/CustomCursor'

export default function Home() {
  const posts = getAllPosts().slice(0, 3) // Берем только 3 последних поста

  return (
    <PageWrapper>

      <div className="container-fluid">
        <section className="text-center mb-16">
          <h1 className="text-h1 font-extrabold mb-4">
            Добро пожаловать в MDX Блог
          </h1>

          <p className="description text-gray-600 mb-8 max-w-3xl mx-auto">
            Современный блог, созданный на Next.js 15 с использованием MDX для
            удобного написания контента
          </p>

          <Link
            href="/blog"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition">
            Перейти к статьям
          </Link>
        </section>

        {posts.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold mb-8 text-center">
              Последние публикации
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {posts.map((post) => {
                const { title, description, slug, cover } = post.frontmatter

                return (
                  <Link
                    key={slug}
                    href={`/blog/${slug}`}
                    className="hover:text-blue-600 transition-colors hover-cursor">
                    <CustomCursor />
                    <div className="rounded-lg overflow-hidden">
                      {/* Добавляем обложку поста */}
                      {cover && (
                        <div className="relative aspect-video">
                          <Image
                            src={cover}
                            alt={title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority
                          />
                        </div>
                      )}

                      <div className="p-6 bg-background">
                        <h3 className="font-bold text-xl mb-2">{title}</h3>
                        <p className="text-gray-600 mb-4">{description}</p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </PageWrapper>
  )
}
