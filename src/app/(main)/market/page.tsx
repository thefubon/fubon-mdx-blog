import { Suspense } from 'react'
import PageWrapper from '@/components/PageWrapper'
import MarketContent from '@/components/market/MarketContent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Цифровые товары',
  description: 'Каталог цифровых товаров для скачивания',
  alternates: {
    canonical: '/market',
  },
  openGraph: {
    url: '/market',
    title: 'Цифровые товары - Fubon',
    description: 'Каталог цифровых товаров для скачивания',
  },
}

export default async function MarketPage(
  props: { 
    searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
  }
) {
  const searchParams = await props.searchParams;
  // Получаем параметры из URL
  const searchQuery = searchParams.search;
  const search = searchQuery && typeof searchQuery === 'string' ? searchQuery : '';
  
  const categoryParam = searchParams.category;
  const category = categoryParam && typeof categoryParam === 'string' ? categoryParam : '';

  // Получаем параметр isPaid для фильтрации (теперь только false или не указан)
  const isPaidParam = searchParams.isPaid;
  const isPaid = isPaidParam && typeof isPaidParam === 'string' ? isPaidParam : '';

  return (
    <PageWrapper>
      {/* Рендерим контент */}
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Загрузка товаров...</div>}>
        <MarketContent search={search} category={category} isPaid={isPaid} />
      </Suspense>
    </PageWrapper>
  )
}