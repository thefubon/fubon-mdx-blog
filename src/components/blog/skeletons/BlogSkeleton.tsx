// Простой компонент фолбека, который не использует клиентскую логику
import Container from '@/components/ui/Container'

export default function BlogSkeleton() {
  return (
    <Container>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
        {/* Верхняя навигация (хлебные крошки) */}
        <div className="h-8 w-64 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
        
        {/* Заголовок и фильтры */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
          <div className="flex space-x-3">
            <div className="h-10 w-28 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
            <div className="h-10 w-28 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
          </div>
        </div>
        
        {/* Сетка постов */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="border dark:border-gray-800 rounded-lg overflow-hidden shadow-sm">
              {/* Заглушка для изображения */}
              <div className="bg-gray-200 dark:bg-gray-800 aspect-video"></div>
              
              <div className="p-4 space-y-3">
                {/* Дата */}
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded-sm"></div>
                
                {/* Заголовок */}
                <div className="h-6 w-full bg-gray-200 dark:bg-gray-800 rounded-md"></div>
                <div className="h-6 w-2/3 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
                
                {/* Описание */}
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded-sm"></div>
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded-sm"></div>
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded-sm"></div>
                
                {/* Кнопка */}
                <div className="h-4 w-28 bg-gray-200 dark:bg-gray-800 rounded-sm"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  )
} 