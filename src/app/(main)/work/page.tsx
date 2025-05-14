import Link from 'next/link'
import Image from 'next/image'
import { getAllWorks, getAllWorkCategories } from '@/lib/mdx'
import PageWrapper from '@/components/PageWrapper'
import Container from '@/components/ui/Container'
import { ChevronRight, Home } from 'lucide-react'
import { Suspense } from 'react'
import CategoryFilters from '@/components/work/CategoryFilters'
import { Post } from '@/lib/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Портфолио',
  description: 'Наши лучшие проекты в области дизайна и разработки цифровых продуктов',
  alternates: {
    canonical: '/work',
  },
  openGraph: {
    url: '/work',
    title: 'Портфолио - Креативное агентство Fubon',
    description: 'Избранные кейсы и проекты, демонстрирующие наш подход к разработке цифровых продуктов и сервисов',
  },
}

// Компонент для динамического контента
async function WorkContent({ 
  page = 1,
  category = ''
}: { 
  page?: number,
  category?: string
}) {
  // Получаем все работы
  const allWorks = getAllWorks()
  const allCategories = getAllWorkCategories()
  
  // Фильтруем работы по категории, если она указана
  const filteredWorks = category 
    ? allWorks.filter(work => work.frontmatter.category?.toLowerCase() === category.toLowerCase())
    : allWorks
  
  // Настройка пагинации
  const itemsPerPage = 12
  const totalPages = Math.ceil(filteredWorks.length / itemsPerPage)
  const currentPage = Math.max(1, Math.min(page, totalPages || 1))
  const startIndex = (currentPage - 1) * itemsPerPage
  
  // Получаем работы для текущей страницы
  const works = filteredWorks.slice(startIndex, startIndex + itemsPerPage)
  
  // Определяем, используем ли мы кастомную сетку или сетку категории
  const isMainPage = !category

  return (
    <>
      <Container padding space className="py-16">
        {/* Хлебные крошки */}
        <nav className="flex items-center text-sm mb-10 text-gray-500 dark:text-gray-400">
          <Link href="/" className="flex items-center hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            <Home className="w-4 h-4 mr-1" />
            <span>Главная</span>
          </Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="text-gray-900 dark:text-gray-200 font-medium">Портфолио</span>
        </nav>
        
        {/* Заголовок раздела */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">Портфолио работ</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Подборка моих проектов и работ в области дизайна и разработки
          </p>
        </div>
        
        {/* Фильтры категорий */}
        <CategoryFilters categories={allCategories} />
        
        {works.length > 0 ? (
          <div className="grid grid-cols-12 gap-4 auto-rows-[minmax(200px,auto)]">
            {works.map((work, index) => {
              const { frontmatter } = work || {};
              
              // Если это главная страница и первые три элемента, применяем специальную разметку
              if (isMainPage && currentPage === 1) {
                // Первый элемент занимает 6 колонок и 2 строки
                if (index === 0) {
                  return (
                    <div 
                      key={frontmatter?.slug || index} 
                      className="col-span-12 md:col-span-6 row-span-2 h-full"
                    >
                      <WorkCard work={work} />
                    </div>
                  );
                }
                
                // Второй и третий элементы занимают по 6 колонок и 1 строку каждый
                if (index === 1 || index === 2) {
                  return (
                    <div 
                      key={frontmatter?.slug || index} 
                      className="col-span-12 md:col-span-6 row-span-1 aspect-video"
                    >
                      <WorkCard work={work} />
                    </div>
                  );
                }
              }
              
              // Для остальных элементов или страницы категорий применяем стандартную или кастомную сетку
              // Выбираем настройки сетки в зависимости от страницы
              const gridConfig = isMainPage 
                ? frontmatter?.grid 
                : (frontmatter?.catGrid || frontmatter?.grid);
              
              // Определение классов сетки
              let colSpan = 'col-span-12 md:col-span-6 lg:col-span-4'; // По умолчанию
              let rowSpan = 'row-span-1';
              
              // Если есть кастомные настройки сетки, применяем их
              if (gridConfig) {
                if (gridConfig.col) {
                  colSpan = `col-span-12 md:col-span-6 lg:col-span-${gridConfig.col}`;
                }
                
                if (gridConfig.row) {
                  rowSpan = `row-span-${gridConfig.row}`;
                }
              }
              
              // Класс для высоты
              const heightClass = gridConfig?.row && gridConfig.row > 1 ? 'h-full' : 'aspect-video';
              
              return (
                <div 
                  key={frontmatter?.slug || index} 
                  className={`${colSpan} ${rowSpan} ${heightClass}`}
                >
                  <WorkCard work={work} />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center text-gray-500">
            <p>Работы в выбранной категории не найдены</p>
          </div>
        )}

        {totalPages > 1 && (
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            category={category}
          />
        )}
        </Container>
    </>
  )
}

// Компонент пагинации
function Pagination({ 
  currentPage, 
  totalPages,
  category = ''
}: { 
  currentPage: number, 
  totalPages: number,
  category?: string
}) {
  const baseUrl = category ? `/work?category=${encodeURIComponent(category)}` : '/work';
  
  const getPageUrl = (pageNum: number) => {
    if (pageNum === 1 && !category) return '/work';
    return `${baseUrl}${category ? '&' : '?'}page=${pageNum}`;
  };

  return (
    <div className="mt-16 flex items-center justify-center space-x-3">
      {currentPage > 1 && (
        <Link 
          href={getPageUrl(currentPage - 1)}
          className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 
            rounded-lg transition-colors flex items-center font-medium"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Назад
        </Link>
      )}
      
      <div className="flex items-center space-x-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
          <Link
            key={pageNum}
            href={getPageUrl(pageNum)}
            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors font-medium ${
              pageNum === currentPage
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
            }`}
          >
            {pageNum}
          </Link>
        ))}
      </div>
      
      {currentPage < totalPages && (
        <Link 
          href={getPageUrl(currentPage + 1)}
          className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 
            rounded-lg transition-colors flex items-center font-medium"
        >
          Вперед
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
            <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      )}
    </div>
  );
}

// Компонент карточки работы
function WorkCard({ work }: { work: Post }) {
  // Используем данные из frontmatter, если они есть, иначе заглушки
  const { 
    title = "Название проекта", 
    slug = "", 
    cover = "",
    category = ""
  } = work?.frontmatter || {};
  
  return (
    <Link
      href={slug ? `/work/${slug}` : "#"}
      className="group relative block overflow-hidden rounded-lg w-full h-full"
    >
      <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-black/80 via-black/30 to-black/10 opacity-70 transition-opacity group-hover:opacity-90 z-10" />
      
      {cover ? (
        <Image
          src={cover}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900" />
      )}
      
      <div className="absolute bottom-0 left-0 right-0 p-5 z-20 flex flex-col transition-transform duration-300">
        {category && (
          <span className="text-xs font-medium text-white/90 mb-2 uppercase tracking-wider">
            {category}
          </span>
        )}
        <h3 className="font-bold text-white text-xl md:text-2xl">{title}</h3>
        
        <div className="translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 mt-3">
          <span className="inline-block text-white text-sm font-medium px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
            Подробнее
          </span>
        </div>
      </div>
    </Link>
  );
}

export default async function WorkPage(
  props: { 
    searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
  }
) {
  const searchParams = await props.searchParams;
  // Получаем параметры из URL
  const pageParam = searchParams.page;
  const page = pageParam && typeof pageParam === 'string' ? parseInt(pageParam, 10) : 1;
  
  const categoryParam = searchParams.category;
  const category = categoryParam && typeof categoryParam === 'string' ? categoryParam : '';

  return (
    <PageWrapper>
      {/* Рендерим контент */}
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Загрузка портфолио...</div>}>
        <WorkContent page={page} category={category} />
      </Suspense>
    </PageWrapper>
  )
}
