'use client';

import { cn } from '@/lib/utils';

interface LoadMoreButtonProps {
  onClick: () => void;
  isLoading: boolean;
  hasMore: boolean;
}

export default function LoadMoreButton({
  onClick,
  isLoading,
  hasMore
}: LoadMoreButtonProps) {
  if (!hasMore) {
    return (
      <div className="mt-8 text-center text-gray-500">
        Все работы загружены
      </div>
    );
  }

  return (
    <div className="mt-8 text-center">
      <button
        onClick={onClick}
        disabled={isLoading}
        className={cn(
          "px-6 py-3 bg-black text-white rounded-md font-medium",
          "transition-all hover:bg-black/80",
          isLoading && "opacity-70 cursor-not-allowed"
        )}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Загрузка...
          </span>
        ) : (
          "Загрузить еще"
        )}
      </button>
    </div>
  );
} 