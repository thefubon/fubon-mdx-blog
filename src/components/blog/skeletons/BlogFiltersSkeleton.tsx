import { Skeleton } from "@/components/ui/skeleton"

export default function BlogFiltersSkeleton() {
  return (
    <div className="flex justify-between items-center mb-6">
      {/* Заголовок со счетчиком */}
      <Skeleton className="h-6 w-32" />
      
      <div className="flex items-center space-x-2">
        {/* Кнопки сортировки */}
        <Skeleton className="h-8 w-36" />
        
        {/* Кнопки вида отображения */}
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  )
} 