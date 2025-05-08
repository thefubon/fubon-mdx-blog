import Link from 'next/link'
import Image from 'next/image'
import { getAllPosts, getAllWorks } from '@/lib/mdx'
import PageWrapper from '@/components/PageWrapper'
import Container from '@/components/ui/Container'
import { ArrowRight } from 'lucide-react'

export default function Home() {
  const posts = getAllPosts().slice(0, 3) // Берем только 3 последних поста
  const works = getAllWorks().slice(0, 3) // Берем только 3 последних работы

  return (
    <PageWrapper>
      <Container padding={true} space={true}>
        <section className="text-center">
          <h1 className="text-h1 font-bold mb-4">Добро пожаловать!</h1>

          <p className="description text-gray-600 mb-8 max-w-3xl mx-auto">
            Современный блог, созданный на Next.js 15 с использованием MDX для
            удобного написания контента
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/work"
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition">
              Портфолио
            </Link>
            <Link
              href="/blog"
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 transition">
              Блог
            </Link>
          </div>
        </section>

        {/* Секция последних работ */}
        {works.length > 0 && (
          <section className="mt-16 mb-20">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">
                Последние работы
              </h2>
              <Link
                href="/work"
                className="text-blue-600 hover:text-blue-700 flex items-center transition-colors">
                Все работы <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {works.map((work) => {
                const { title, description, slug, cover } = work.frontmatter

                return (
                  <Link
                    key={slug}
                    href={`/work/${slug}`}
                    className="hover:text-blue-600 transition-colors group">
                    <div className="rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors h-full flex flex-col">
                      {/* Обложка работы */}
                      {cover && (
                        <div className="relative aspect-video">
                          <Image
                            src={cover}
                            alt={title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority
                          />
                        </div>
                      )}

                      <div className="p-6 bg-background flex-grow">
                        <span className="inline-block text-xs font-medium text-blue-600 mb-2">
                          Портфолио
                        </span>

                        <h3 className="font-bold text-xl mb-2">{title}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {description}
                        </p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* Секция последних статей блога */}
        {posts.length > 0 && (
          <section>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">
                Последние публикации
              </h2>
              <Link
                href="/blog"
                className="text-blue-600 hover:text-blue-700 flex items-center transition-colors">
                Все статьи <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {posts.map((post) => {
                const { title, description, slug, cover, category } =
                  post.frontmatter

                return (
                  <Link
                    key={slug}
                    href={`/blog/${slug}`}
                    className="hover:text-blue-600 transition-colors group">
                    <div className="rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors h-full flex flex-col">
                      {/* Добавляем обложку поста */}
                      {cover && (
                        <div className="relative aspect-video">
                          <Image
                            src={cover}
                            alt={title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority
                          />
                        </div>
                      )}

                      <div className="p-6 bg-background flex-grow">
                        {/* Добавляем категорию */}
                        {category && (
                          <span className="inline-block text-xs font-medium text-blue-600 mb-2">
                            {category}
                          </span>
                        )}

                        <h3 className="font-bold text-xl mb-2">{title}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {description}
                        </p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}
      </Container>
    </PageWrapper>
  )
}
