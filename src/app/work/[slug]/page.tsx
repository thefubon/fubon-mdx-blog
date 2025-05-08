import { getWorkBySlug, getAllWorkSlugs, getAllWorks } from '@/lib/mdx'
import { notFound } from 'next/navigation'
import Container from '@/components/ui/Container'
import Link from 'next/link'
import { ArrowLeft, ChevronRight, Home, Calendar, Clock, ArrowLeftCircle, ArrowRightCircle } from 'lucide-react'
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

  // Получаем все работы для навигации между постами
  const allWorks = getAllWorks();
  
  // Находим индекс текущей работы
  const currentIndex = allWorks.findIndex(w => w.frontmatter.slug === params.slug);
  
  // Определяем предыдущую и следующую работы
  const prevWork = currentIndex > 0 ? allWorks[currentIndex - 1] : null;
  const nextWork = currentIndex < allWorks.length - 1 ? allWorks[currentIndex + 1] : null;

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
          
          {/* Навигация между постами */}
          <div className="mt-16 border-t pt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {prevWork ? (
              <Link 
                href={`/work/${prevWork.frontmatter.slug}`}
                className="group flex flex-col p-5 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-blue-300 dark:hover:border-blue-600 transition-colors relative overflow-hidden shadow-sm hover:shadow-md"
              >
                {prevWork.frontmatter.cover && (
                  <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity z-0">
                    <Image
                      src={prevWork.frontmatter.cover}
                      alt={prevWork.frontmatter.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="relative z-10">
                  <div className="flex items-center text-blue-600 mb-3">
                    <ArrowLeftCircle className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
                    <span className="font-medium">Предыдущий проект</span>
                  </div>
                  <h3 className="font-semibold text-xl text-gray-900 dark:text-white mb-1">
                    {prevWork.frontmatter.title}
                  </h3>
                  {prevWork.frontmatter.category && (
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      {prevWork.frontmatter.category}
                    </p>
                  )}
                </div>
              </Link>
            ) : (
              <div className="col-span-1"></div>
            )}
            
            {nextWork ? (
              <Link 
                href={`/work/${nextWork.frontmatter.slug}`}
                className="group flex flex-col p-5 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-blue-300 dark:hover:border-blue-600 transition-colors text-right relative overflow-hidden shadow-sm hover:shadow-md"
              >
                {nextWork.frontmatter.cover && (
                  <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity z-0">
                    <Image
                      src={nextWork.frontmatter.cover}
                      alt={nextWork.frontmatter.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="relative z-10">
                  <div className="flex items-center justify-end text-blue-600 mb-3">
                    <span className="font-medium">Следующий проект</span>
                    <ArrowRightCircle className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </div>
                  <h3 className="font-semibold text-xl text-gray-900 dark:text-white mb-1">
                    {nextWork.frontmatter.title}
                  </h3>
                  {nextWork.frontmatter.category && (
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      {nextWork.frontmatter.category}
                    </p>
                  )}
                </div>
              </Link>
            ) : (
              <div className="col-span-1"></div>
            )}
          </div>
        </article>
      </Container>
    </PageWrapper>
  )
} 