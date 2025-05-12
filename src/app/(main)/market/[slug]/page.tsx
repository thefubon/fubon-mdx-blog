import { getMarketItemBySlug, getAllMarketItems } from '@/lib/mdx'
import { notFound } from 'next/navigation'
import Container from '@/components/ui/Container'
import Link from 'next/link'
import { ArrowLeft, ChevronRight, Home, Download } from 'lucide-react'
import { MDXRemote } from 'next-mdx-remote/rsc'
import PageWrapper from '@/components/PageWrapper'
import MDXComponents from '@/components/MDXComponents'
import { Post } from '@/lib/types'
import { ComponentProps } from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import type { Metadata } from 'next'
import AddToCartButton from '@/components/market/AddToCartButton'
import ImageGallery from '@/components/market/ImageGallery'

// Генерация метаданных на основе динамических данных
export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const item = getMarketItemBySlug(params.slug)

  if (!item) {
    return {
      title: 'Товар не найден',
      description: 'Запрашиваемый товар не существует'
    }
  }

  const { title, description, images, category } = item.frontmatter

  return {
    title,
    description: description || `Товар ${title}`,
    alternates: {
      canonical: `/market/${params.slug}`,
    },
    openGraph: {
      type: 'article',
      url: `/market/${params.slug}`,
      title,
      description: description || `Товар ${title}`,
      images: images && images.length > 0 ? [
        {
          url: images[0],
          width: 1200,
          height: 630,
          alt: title,
        }
      ] : undefined,
      section: category || 'Market',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: description || `Товар ${title}`,
      images: images && images.length > 0 ? [images[0]] : undefined,
    },
  }
}

// Генерация статических параметров для SSG
export async function generateStaticParams() {
  const items = getAllMarketItems()
  return items.map((item) => ({
    slug: item.frontmatter.slug,
  }))
}

// Компонент для отображения отдельного товара
export default async function MarketItemPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const item: Post = getMarketItemBySlug(params.slug)

  if (!item) {
    notFound()
  }

  // Получаем сессию пользователя для проверки авторизации
  const session = await getServerSession(authOptions)
  const isAuthenticated = !!session

  const { title, description, price, images, category } = item.frontmatter

  // Форматирование цены
  const displayPrice = () => {
    if (price === undefined || price === null || price === "") {
      return "Бесплатно";
    }
    return typeof price === 'number' ? `${price} ₽` : price;
  };

  // Проверка, является ли товар бесплатным
  const isFree = price === undefined || price === null || price === "";

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
              href="/market"
              className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              Цифровые товары
            </Link>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="text-gray-900 dark:text-gray-200 font-medium truncate max-w-[200px]">
              {title}
            </span>
          </nav>

          {/* Кнопка назад */}
          <Link
            href="/market"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium mb-6 group transition-colors"
          >
            <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Назад к списку товаров
          </Link>
        </div>

        <article className="max-w-4xl mx-auto">
          {/* Заголовок и мета-информация */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
            
            {category && (
              <div className="mb-4">
                <span className="inline-block px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">
                  {category}
                </span>
              </div>
            )}
            
            {description && (
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                {description}
              </p>
            )}
            
            {/* Цена и кнопка скачивания/покупки */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
              <div className="font-bold text-2xl md:text-3xl text-primary">
                {displayPrice()}
              </div>
              
              {isAuthenticated ? (
                isFree ? (
                  <Link 
                    href="#download" 
                    className="inline-flex items-center px-6 py-3 bg-primary text-black font-medium rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    <Download size={18} className="mr-2" />
                    Скачать
                  </Link>
                ) : (
                  <AddToCartButton 
                    item={{
                      slug: item.frontmatter.slug,
                      title: item.frontmatter.title,
                      price: item.frontmatter.price || 0,
                      image: item.frontmatter.images && item.frontmatter.images.length > 0 
                        ? item.frontmatter.images[0] 
                        : undefined,
                      quantity: 1,
                      maxQuantity: item.frontmatter.maxQuantity
                    }} 
                  />
                )
              ) : (
                <div className="flex flex-col">
                  <div className="text-gray-700 dark:text-gray-300 mb-2">
                    Для {isFree ? 'скачивания' : 'покупки'} необходимо авторизоваться
                  </div>
                  <Link 
                    href="/login" 
                    className="inline-flex items-center px-6 py-3 bg-primary text-black font-medium rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    Войти
                  </Link>
                </div>
              )}
            </div>
          </header>

          {/* Галерея изображений */}
          {images && images.length > 0 && (
            <ImageGallery images={images} title={title} />
          )}

          {/* Содержимое товара */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <MDXRemote
              source={item.content}
              components={MDXComponents as ComponentProps<typeof MDXRemote>['components']}
            />
          </div>
          
          {/* Секция скачивания для авторизованных пользователей */}
          {isAuthenticated && isFree && (
            <div id="download" className="mt-16 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl font-bold mb-4">Скачать товар</h2>
              <p className="mb-6">Спасибо за интерес к нашему продукту! Нажмите кнопку ниже, чтобы скачать товар.</p>
              <Link 
                href="#" // Здесь должна быть ссылка на файл для скачивания
                className="inline-flex items-center px-6 py-3 bg-primary text-black font-medium rounded-lg hover:bg-opacity-90 transition-colors"
              >
                <Download size={18} className="mr-2" />
                Скачать файл
              </Link>
            </div>
          )}
        </article>
      </Container>
    </PageWrapper>
  )
} 