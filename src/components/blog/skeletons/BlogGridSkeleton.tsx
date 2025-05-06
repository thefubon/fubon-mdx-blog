export default function BlogGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div 
          key={index} 
          className="flex flex-col border dark:border-gray-800 rounded-lg overflow-hidden shadow-sm h-full animate-pulse"
        >
          {/* Изображение */}
          <div className="aspect-video bg-gray-200 dark:bg-gray-800"></div>
          
          <div className="p-4 flex-grow">
            {/* Дата и время чтения */}
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3"></div>
            
            {/* Категория */}
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-1/4 mb-3"></div>
            
            {/* Заголовок */}
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            
            {/* Описание */}
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
            
            {/* Теги */}
            <div className="flex gap-1 mb-3">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-12"></div>
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-14"></div>
            </div>
            
            {/* Читать далее */}
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mt-auto"></div>
          </div>
        </div>
      ))}
    </div>
  )
} 