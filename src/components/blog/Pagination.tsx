'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import {
  Pagination as UIPagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import { useMusicPlayer } from '@/contexts/MusicPlayerProvider'
import { useMusicPlayerStore } from '@/store/use-music-player-store'

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
  const { audioRef } = useMusicPlayer()
  const { currentTrack } = useMusicPlayerStore()
  
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
    
    // Сохраняем состояние музыкального плеера перед навигацией
    if (audioRef.current && currentTrack) {
      const state = {
        trackId: currentTrack.id,
        currentTime: audioRef.current.currentTime,
        isPlaying: !audioRef.current.paused
      }
      localStorage.setItem('musicPlayerState', JSON.stringify(state))
    }
    
    const url = getPageHref(pageNumber)
    router.push(url)
  }

  return (
    <UIPagination className="mt-10">
      <PaginationContent>
        {/* Кнопка "Предыдущая страница" */}
        <PaginationItem>
          {currentPage > 1 ? (
            <PaginationLink
              onClick={(e) => handleNavigate(currentPage - 1, e)}
              className="gap-1 px-2.5 sm:pl-2.5"
            >
              <ChevronLeftIcon />
              <span className="hidden sm:block">Назад</span>
            </PaginationLink>
          ) : (
            <span className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 gap-1 sm:pl-2.5 pointer-events-none opacity-50">
              <ChevronLeftIcon />
              <span className="hidden sm:block">Назад</span>
            </span>
          )}
        </PaginationItem>

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
                isActive={pageNumber === currentPage}
                onClick={(e) => handleNavigate(pageNumber, e)}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {/* Кнопка "Следующая страница" */}
        <PaginationItem>
          {currentPage < totalPages ? (
            <PaginationLink
              onClick={(e) => handleNavigate(currentPage + 1, e)}
              className="gap-1 px-2.5 sm:pr-2.5"
            >
              <span className="hidden sm:block">Далее</span>
              <ChevronRightIcon />
            </PaginationLink>
          ) : (
            <span className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 gap-1 sm:pr-2.5 pointer-events-none opacity-50">
              <span className="hidden sm:block">Далее</span>
              <ChevronRightIcon />
            </span>
          )}
        </PaginationItem>
      </PaginationContent>
    </UIPagination>
  )
} 