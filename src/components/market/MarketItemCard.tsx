import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/lib/types';

interface MarketItemCardProps {
  item: Post;
}

export default function MarketItemCard({ item }: MarketItemCardProps) {
  const { 
    title = "Название товара", 
    slug = "", 
    price,
    images = [],
    category = ""
  } = item?.frontmatter || {};
  
  // Используем первое изображение из массива или заглушку
  const coverImage = images && images.length > 0 ? images[0] : "";
  
  // Форматирование цены
  const displayPrice = () => {
    if (price === undefined || price === null || price === "") {
      return "Бесплатно";
    }
    return typeof price === 'number' ? `${price} ₽` : price;
  };
  
  return (
    <Link
      href={slug ? `/market/${slug}` : "#"}
      className="group block overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-lg transition-shadow"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
            <span className="text-gray-400 dark:text-gray-500">Нет изображения</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        {category && (
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 block uppercase tracking-wider">
            {category}
          </span>
        )}
        
        <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">{title}</h3>
        
        <div className="flex justify-between items-center mt-3">
          <span className="font-bold text-xl text-primary">
            {displayPrice()}
          </span>
          
          <span className="inline-block text-sm font-medium px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-primary group-hover:text-black transition-colors">
            Подробнее
          </span>
        </div>
      </div>
    </Link>
  );
} 