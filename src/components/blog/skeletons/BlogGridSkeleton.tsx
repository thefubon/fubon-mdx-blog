import { Skeleton } from "@/components/ui/skeleton"

export default function BlogGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div 
          key={index} 
          className="flex flex-col border dark:border-gray-800 rounded-lg overflow-hidden shadow-sm h-full"
        >
          {/* Изображение */}
          <Skeleton className="aspect-video w-full" />
          
          <div className="p-4 flex-grow">
            {/* Дата и время чтения */}
            <Skeleton className="h-4 w-1/3 mb-3" />
            
            {/* Категория */}
            <Skeleton className="h-5 w-1/4 mb-3" />
            
            {/* Заголовок */}
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-3/4 mb-4" />
            
            {/* Описание */}
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-2/3 mb-4" />
            
            {/* Теги */}
            <div className="flex gap-1 mb-3">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-5 w-14" />
            </div>
            
            {/* Читать далее */}
            <Skeleton className="h-4 w-1/3 mt-auto" />
          </div>
        </div>
      ))}
    </div>
  )
} 