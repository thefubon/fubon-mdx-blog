'use client'

import { useEffect, useState } from 'react'
import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

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
  const [isVisible, setIsVisible] = useState(true)
  
  // Проверяем нужно ли показывать пагинацию при рендеринге
  useEffect(() => {
    // Проверяем localStorage на активность режима "Избранное"
    const showFavorites = localStorage.getItem('blogShowFavorites') === 'true'
    setIsVisible(!showFavorites)
    
    // Добавляем обработчик на изменение localStorage
    const handleStorageChange = () => {
      const showFavorites = localStorage.getItem('blogShowFavorites') === 'true'
      setIsVisible(!showFavorites)
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])
  
  // Если режим "Избранное" активен или всего одна страница, не показываем пагинацию
  if (!isVisible || totalPages <= 1) {
    return null
  }

  // Функция для создания массива страниц для отображения
  const getPageNumbers = () => {
    // Максимальное количество видимых страниц (без учета эллипсиса)
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Если страниц мало, показываем все
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // Иначе показываем первую, последнюю и страницы вокруг текущей
    const pages = [];
    
    // Всегда показываем первую страницу
    pages.push(1);
    
    // Вычисляем диапазон для отображения
    const leftBound = Math.max(2, currentPage - 1);
    const rightBound = Math.min(totalPages - 1, currentPage + 1);
    
    // Добавляем эллипсис слева, если нужно
    if (leftBound > 2) {
      pages.push(-1); // Используем -1 как маркер для эллипсиса
    }
    
    // Добавляем страницы в диапазоне
    for (let i = leftBound; i <= rightBound; i++) {
      pages.push(i);
    }
    
    // Добавляем эллипсис справа, если нужно
    if (rightBound < totalPages - 1) {
      pages.push(-2); // Используем -2 как маркер для эллипсиса
    }
    
    // Всегда показываем последнюю страницу
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();
  
  const getPageHref = (pageNumber: number) => {
    return `${basePath}${pageNumber === 1 ? '' : `?page=${pageNumber}`}`;
  };

  return (
    <PaginationRoot className="mt-10">
      <PaginationContent>
        {/* Кнопка "Предыдущая страница" */}
        {currentPage > 1 ? (
          <PaginationItem>
            <PaginationPrevious href={getPageHref(currentPage - 1)} />
          </PaginationItem>
        ) : (
          <PaginationItem>
            <PaginationPrevious aria-disabled className="pointer-events-none opacity-50" />
          </PaginationItem>
        )}

        {/* Номера страниц с эллипсисами */}
        {pageNumbers.map((pageNumber, index) => {
          // Если это маркер эллипсиса
          if (pageNumber < 0) {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }
          
          // Если это обычная страница
          return (
            <PaginationItem key={pageNumber}>
              <PaginationLink 
                href={getPageHref(pageNumber)} 
                isActive={pageNumber === currentPage}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {/* Кнопка "Следующая страница" */}
        {currentPage < totalPages ? (
          <PaginationItem>
            <PaginationNext href={getPageHref(currentPage + 1)} />
          </PaginationItem>
        ) : (
          <PaginationItem>
            <PaginationNext aria-disabled className="pointer-events-none opacity-50" />
          </PaginationItem>
        )}
      </PaginationContent>
    </PaginationRoot>
  )
} 