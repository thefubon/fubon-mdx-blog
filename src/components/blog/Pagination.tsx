'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

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
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  
  // Отмечаем, что компонент смонтирован (и мы на клиенте)
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  // Проверяем нужно ли показывать пагинацию при рендеринге
  useEffect(() => {
    if (isMounted) {
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
    }
  }, [isMounted])
  
  // Во время серверного рендеринга или до монтирования, всегда показываем пагинацию
  if (!isMounted) {
    if (totalPages <= 1) {
      return null
    }
    // Иначе продолжаем рендеринг (будет совпадать с серверным рендерингом)
  } else if (!isVisible || totalPages <= 1) {
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

  // Функция для клиентской навигации
  const handleNavigate = (pageNumber: number, e: React.MouseEvent) => {
    e.preventDefault()
    const url = getPageHref(pageNumber)
    router.push(url)
  }

  return (
    <nav className="mx-auto flex w-full justify-center mt-10">
      <ul className="flex flex-row items-center gap-1">
        {/* Кнопка "Предыдущая страница" */}
        <li>
          {currentPage > 1 ? (
            <button
              onClick={(e) => handleNavigate(currentPage - 1, e)}
              className={cn(
                buttonVariants({ variant: "ghost", size: "default" }),
                "gap-1 px-2.5 sm:pl-2.5"
              )}
              aria-label="Предыдущая страница"
            >
              <ChevronLeftIcon />
              <span className="hidden sm:block">Назад</span>
            </button>
          ) : (
            <button
              disabled
              className={cn(
                buttonVariants({ variant: "ghost", size: "default" }),
                "gap-1 px-2.5 sm:pl-2.5 pointer-events-none opacity-50"
              )}
              aria-label="Предыдущая страница"
            >
              <ChevronLeftIcon />
              <span className="hidden sm:block">Назад</span>
            </button>
          )}
        </li>

        {/* Номера страниц с эллипсисами */}
        {pageNumbers.map((pageNumber, index) => {
          // Если это маркер эллипсиса
          if (pageNumber < 0) {
            return (
              <li key={`ellipsis-${index}`}>
                <span className="flex size-9 items-center justify-center" aria-hidden>
                  <MoreHorizontalIcon className="size-4" />
                  <span className="sr-only">Ещё страницы</span>
                </span>
              </li>
            );
          }
          
          // Если это обычная страница
          return (
            <li key={pageNumber}>
              <button
                className={cn(
                  buttonVariants({
                    variant: pageNumber === currentPage ? "outline" : "ghost",
                    size: "icon",
                  })
                )}
                aria-current={pageNumber === currentPage ? "page" : undefined}
                onClick={(e) => handleNavigate(pageNumber, e)}
              >
                {pageNumber}
              </button>
            </li>
          );
        })}

        {/* Кнопка "Следующая страница" */}
        <li>
          {currentPage < totalPages ? (
            <button
              onClick={(e) => handleNavigate(currentPage + 1, e)}
              className={cn(
                buttonVariants({ variant: "ghost", size: "default" }),
                "gap-1 px-2.5 sm:pr-2.5"
              )}
              aria-label="Следующая страница"
            >
              <span className="hidden sm:block">Далее</span>
              <ChevronRightIcon />
            </button>
          ) : (
            <button
              disabled
              className={cn(
                buttonVariants({ variant: "ghost", size: "default" }),
                "gap-1 px-2.5 sm:pr-2.5 pointer-events-none opacity-50"
              )}
              aria-label="Следующая страница"
            >
              <span className="hidden sm:block">Далее</span>
              <ChevronRightIcon />
            </button>
          )}
        </li>
      </ul>
    </nav>
  )
} 