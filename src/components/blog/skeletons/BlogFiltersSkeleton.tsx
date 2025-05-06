export default function BlogFiltersSkeleton() {
  return (
    <div className="flex justify-between items-center mb-6 animate-pulse">
      {/* Заголовок со счетчиком */}
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
      
      <div className="flex items-center space-x-2">
        {/* Кнопки сортировки */}
        <div className="flex border rounded-lg dark:border-gray-800 overflow-hidden h-8 w-36 bg-gray-200 dark:bg-gray-800"></div>
        
        {/* Кнопки вида отображения */}
        <div className="flex border rounded-lg dark:border-gray-800 overflow-hidden h-8 w-20 bg-gray-200 dark:bg-gray-800"></div>
      </div>
    </div>
  )
} 