'use client'

import { useEffect, useState } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
    const media = window.matchMedia(query)
    
    // Задаем начальное значение
    setMatches(media.matches)
    
    // Создаем обработчик изменений
    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches)
    }
    
    // Добавляем обработчик
    media.addEventListener('change', listener)
    
    // Убираем обработчик при размонтировании
    return () => {
      media.removeEventListener('change', listener)
    }
  }, [query])
  
  // Во время серверного рендеринга или до монтирования возвращаем false
  return isMounted && matches
} 