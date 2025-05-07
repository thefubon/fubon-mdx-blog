'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
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
    <nav className="flex justify-center mt-10" aria-label="Pagination">
      <ul className="flex items-center gap-1">
        {/* Кнопка "Предыдущая страница" */}
        <li>
          {currentPage > 1 ? (
            <button
              onClick={(e) => handleNavigate(currentPage - 1, e)}
              className="flex items-center gap-1 px-3 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Перейти к предыдущей странице"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Назад</span>
            </button>
          ) : (
            <span className="flex items-center gap-1 px-3 py-2 border rounded-md opacity-50 cursor-not-allowed">
              <ChevronLeftIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Назад</span>
            </span>
          )}
        </li>

        {/* Номера страниц с эллипсисами */}
        {pageNumbers.map((pageNumber, index) => {
          // Если это маркер эллипсиса
          if (pageNumber < 0) {
            return (
              <li key={`ellipsis-${index}`}>
                <span className="flex h-10 w-10 items-center justify-center" aria-hidden="true">
                  &hellip;
                </span>
              </li>
            );
          }
          
          // Если это обычная страница
          return (
            <li key={pageNumber}>
              <button
                onClick={(e) => handleNavigate(pageNumber, e)}
                className={`flex h-10 w-10 items-center justify-center rounded-md ${
                  pageNumber === currentPage 
                    ? 'bg-primary text-primary-foreground font-medium' 
                    : 'hover:bg-muted transition-colors'
                }`}
                aria-current={pageNumber === currentPage ? 'page' : undefined}
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
              className="flex items-center gap-1 px-3 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Перейти к следующей странице"
            >
              <span className="hidden sm:inline">Далее</span>
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          ) : (
            <span className="flex items-center gap-1 px-3 py-2 border rounded-md opacity-50 cursor-not-allowed">
              <span className="hidden sm:inline">Далее</span>
              <ChevronRightIcon className="h-4 w-4" />
            </span>
          )}
        </li>
      </ul>
    </nav>
  )
} 