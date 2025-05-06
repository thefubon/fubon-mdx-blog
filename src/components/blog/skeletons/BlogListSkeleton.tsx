export default function BlogListSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 5 }).map((_, index) => (
        <div 
          key={index} 
          className="flex flex-col sm:flex-row border dark:border-gray-800 rounded-lg overflow-hidden shadow-sm animate-pulse"
        >
          {/* Изображение */}
          <div className="sm:w-[280px] shrink-0 aspect-video sm:aspect-[4/3] bg-gray-200 dark:bg-gray-800"></div>
          
          <div className="p-4 flex-grow">
            <div className="flex justify-between mb-3">
              {/* Дата и время чтения */}
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              
              {/* Категория */}
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
            </div>
            
            {/* Заголовок */}
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
            
            {/* Описание */}
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            
            <div className="flex justify-between mt-4">
              {/* Теги */}
              <div className="flex gap-1">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-12"></div>
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-14"></div>
              </div>
              
              {/* Читать далее */}
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 