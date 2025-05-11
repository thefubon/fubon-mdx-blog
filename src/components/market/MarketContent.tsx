import Link from 'next/link';
import { getAllMarketItems, getAllMarketCategories, searchMarketItems, getMarketItemsByCategory } from '@/lib/mdx';
import Container from '@/components/ui/Container';
import { ChevronRight, Home } from 'lucide-react';
import { Post } from '@/lib/types';
import SearchForm from '@/components/market/SearchForm';
import MarketItemCard from '@/components/market/MarketItemCard';

interface MarketContentProps {
  search?: string;
  category?: string;
}

export default async function MarketContent({ 
  search = '',
  category = ''
}: MarketContentProps) {
  // Получаем все товары
  let marketItems: Post[] = [];
  const allCategories = getAllMarketCategories();
  
  // Фильтруем товары по поисковому запросу или категории
  if (search) {
    marketItems = searchMarketItems(search);
  } else if (category) {
    marketItems = getMarketItemsByCategory(category);
  } else {
    marketItems = getAllMarketItems();
  }

  // Функция для создания URL с параметрами
  const createUrlWithParams = (cat: string = '') => {
    const params = new URLSearchParams();
    if (cat) params.set('category', cat);
    if (search && search.length >= 3) params.set('search', search);
    const queryString = params.toString();
    return queryString ? `/market?${queryString}` : '/market';
  };
  
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
          <span className="text-gray-900 dark:text-gray-200 font-medium">Цифровые товары</span>
        </nav>
        
        {/* Заголовок раздела */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">Цифровые товары</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Каталог цифровых товаров для скачивания
          </p>
        </div>
        
        {/* Поиск и фильтры */}
        <div className="mb-10">
          <SearchForm initialSearchValue={search} />
          
          {/* Фильтр по категориям */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Link 
              href={createUrlWithParams()}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !category ? 'bg-primary text-black' : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Все
            </Link>
            {allCategories.map((cat) => (
              <Link 
                key={cat}
                href={createUrlWithParams(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === cat ? 'bg-primary text-black' : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
        
        {marketItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketItems.map((item, index) => (
              <MarketItemCard key={item.frontmatter.slug || index} item={item} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-gray-500">
            <p>Товары не найдены</p>
          </div>
        )}
      </Container>
    </>
  );
} 