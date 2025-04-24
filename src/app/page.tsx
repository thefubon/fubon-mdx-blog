import Link from 'next/link'
import { getAllPosts } from '@/lib/mdx'

export default function Home() {
  const posts = getAllPosts().slice(0, 3) // Берем только 3 последних поста

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <section className="text-center mb-16">
        <h1 className="text-5xl font-extrabold mb-4">
          Добро пожаловать в MDX Блог
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
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
            {posts.map((post: any) => (
              <div
                key={post.frontmatter.slug}
                className="border rounded-lg overflow-hidden shadow-sm">
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2">
                    {post.frontmatter.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {post.frontmatter.description}
                  </p>
                  <Link
                    href={`/blog/${post.frontmatter.slug}`}
                    className="text-blue-600 hover:underline">
                    Читать далее →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/blog"
              className="inline-block text-blue-600 hover:underline">
              Посмотреть все статьи →
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}
