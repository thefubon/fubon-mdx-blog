'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
}: PaginationProps) {
  // Если всего одна страница, не показываем пагинацию
  if (totalPages <= 1) {
    return null
  }

  // Функция для создания массива страниц для отображения
  const getPageRange = () => {
    // Максимальное количество видимых страниц
    const maxVisiblePages = 5;
    const pages = [];
    
    if (totalPages <= maxVisiblePages) {
      // Если общее количество страниц меньше или равно максимальному видимому, 
      // просто показываем все страницы
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Определяем диапазон страниц для отображения
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = startPage + maxVisiblePages - 1;
      
      // Если endPage превышает totalPages, корректируем
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageRange();

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="inline-flex rounded-md shadow-sm bg-white dark:bg-gray-800 overflow-hidden">
        {/* Кнопка "Предыдущая страница" */}
        {currentPage > 1 ? (
          <Link
            href={`${basePath}${currentPage === 2 ? '' : `?page=${currentPage - 1}`}`}
            className="flex items-center px-4 py-2 text-sm font-medium border-r border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            aria-label="Перейти на предыдущую страницу"
          >
            <ChevronLeft size={18} className="mr-1" />
            Назад
          </Link>
        ) : (
          <span className="flex items-center px-4 py-2 text-sm font-medium border-r border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 cursor-not-allowed">
            <ChevronLeft size={18} className="mr-1" />
            Назад
          </span>
        )}

        {/* Номера страниц */}
        {pageNumbers.map((pageNumber) => (
          <Link
            key={pageNumber}
            href={`${basePath}${pageNumber === 1 ? '' : `?page=${pageNumber}`}`}
            className={`px-4 py-2 text-sm font-medium border-r border-gray-200 dark:border-gray-700 ${
              currentPage === pageNumber
                ? 'bg-blue-600 text-white border-blue-600 dark:border-blue-700 z-10 relative'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            } transition-colors`}
            aria-current={currentPage === pageNumber ? 'page' : undefined}
            aria-label={`Страница ${pageNumber}`}
          >
            {pageNumber}
          </Link>
        ))}

        {/* Кнопка "Следующая страница" */}
        {currentPage < totalPages ? (
          <Link
            href={`${basePath}?page=${currentPage + 1}`}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            aria-label="Перейти на следующую страницу"
          >
            Вперёд
            <ChevronRight size={18} className="ml-1" />
          </Link>
        ) : (
          <span className="flex items-center px-4 py-2 text-sm font-medium text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 cursor-not-allowed">
            Вперёд
            <ChevronRight size={18} className="ml-1" />
          </span>
        )}
      </div>
    </div>
  )
} 