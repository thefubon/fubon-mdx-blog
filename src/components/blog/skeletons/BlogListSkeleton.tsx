import { Skeleton } from "@/components/ui/skeleton"

export default function BlogListSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 12 }).map((_, index) => (
        <div 
          key={index} 
          className="flex flex-col sm:flex-row border dark:border-gray-800 rounded-lg overflow-hidden shadow-sm"
        >
          {/* Изображение */}
          <Skeleton className="sm:w-[280px] shrink-0 aspect-video sm:aspect-[4/3]" />
          
          <div className="p-4 flex-grow">
            <div className="flex justify-between mb-3">
              {/* Дата и время чтения */}
              <Skeleton className="h-4 w-1/3" />
              
              {/* Категория */}
              <Skeleton className="h-5 w-20" />
            </div>
            
            {/* Заголовок */}
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-1/2 mb-4" />
            
            {/* Описание */}
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            
            <div className="flex justify-between mt-4">
              {/* Теги */}
              <div className="flex gap-1">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-5 w-14" />
              </div>
              
              {/* Читать далее */}
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 