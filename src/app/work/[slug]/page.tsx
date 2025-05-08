import { getWorkBySlug, getAllWorkSlugs } from '@/lib/mdx'
import { notFound } from 'next/navigation'
import Container from '@/components/ui/Container'
import Link from 'next/link'
import { ArrowLeft, ChevronRight, Home, Calendar, Clock } from 'lucide-react'
import FormattedDate from '@/components/blog/FormattedDate'
import { translateReadingTime } from '@/lib/utils'
import { MDXRemote } from 'next-mdx-remote/rsc'
import PageWrapper from '@/components/PageWrapper'
import Image from 'next/image'
import MDXComponents from '@/components/MDXComponents'
import { Post } from '@/lib/types'
import { ComponentProps } from 'react'

// Генерация статических параметров для всех доступных работ
export async function generateStaticParams() {
  const slugs = getAllWorkSlugs()
  return slugs.map((slug) => ({ slug }))
}

// Функция получения метаданных для каждой работы
export async function generateMetadata(
  props: {
    params: Promise<{ slug: string }>
  }
) {
  const params = await props.params;
  const work = getWorkBySlug(params.slug)

  if (!work) {
    return {
      title: 'Работа не найдена',
      description: 'Запрашиваемая работа не существует',
    }
  }

  return {
    title: work.frontmatter.title,
    description: work.frontmatter.description,
  }
}

// Компонент для отображения отдельной работы
export default async function WorkPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const work: Post = getWorkBySlug(params.slug)

  if (!work) {
    notFound()
  }

  const { title, description, publishedAt, readingTime, cover } = work.frontmatter

  return (
    <PageWrapper>
      <Container>
        <div className="mt-10 mb-6">
          {/* Хлебные крошки */}
          <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6">
            <Link
              href="/"
              className="flex items-center hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <Home className="w-4 h-4 mr-1" />
              <span>Главная</span>
            </Link>
            <ChevronRight className="w-4 h-4 mx-1" />
            <Link
              href="/work"
              className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              Портфолио
            </Link>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="text-gray-900 dark:text-gray-200 font-medium truncate max-w-[200px]">
              {title}
            </span>
          </nav>

          {/* Кнопка назад */}
          <Link
            href="/work"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium mb-6 group transition-colors"
          >
            <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Назад к списку работ
          </Link>
        </div>

        <article className="max-w-4xl mx-auto">
          {/* Заголовок и мета-информация */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
            
            <div className="flex flex-wrap items-center text-sm text-gray-600 dark:text-gray-300 mb-4">
              <span className="flex items-center">
                <Calendar size={16} className="mr-1" />
                <FormattedDate date={publishedAt} />
              </span>
              
              <span className="mx-3">•</span>
              
              <span className="flex items-center">
                <Clock size={16} className="mr-1" />
                <span>{translateReadingTime(readingTime)}</span>
              </span>
            </div>
            
            {description && (
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                {description}
              </p>
            )}
          </header>

          {/* Изображение обложки работы */}
          {cover && (
            <div className="relative aspect-video mb-10 rounded-xl overflow-hidden">
              <Image
                src={cover}
                alt={title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Содержимое работы */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <MDXRemote
              source={work.content}
              components={MDXComponents as ComponentProps<typeof MDXRemote>['components']}
            />
          </div>
        </article>
      </Container>
    </PageWrapper>
  )
} 