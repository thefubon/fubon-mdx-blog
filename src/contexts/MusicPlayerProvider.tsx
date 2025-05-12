'use client'

import React, { createContext, useContext, useRef, useEffect } from 'react'
import { useMusicPlayerStore } from '@/data/playlist'
import { usePathname } from 'next/navigation'

// Use RefObject with undefined type to allow null values
type MusicPlayerContextType = {
  audioRef: React.RefObject<HTMLAudioElement | null>
}

const MusicPlayerContext = createContext<MusicPlayerContextType>({
  audioRef: { current: null }
})

export const useMusicPlayer = () => useContext(MusicPlayerContext)

export function MusicPlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const isPlayingRef = useRef(false)
  const pathname = usePathname()
  
  // Check if we're in the dashboard or auth area
  const isInDashboardOrAuth = pathname && (
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/auth') || 
    pathname === '/login' || 
    pathname === '/register'
  )
  
  // If not in dashboard or auth, we're in the main app
  const isInMainApp = !isInDashboardOrAuth
  
  const {
    currentTrack,
    isPlaying,
    setIsPlaying,
    volume,
    repeat,
    nextTrack
  } = useMusicPlayerStore()

  // Сохранять состояние воспроизведения при навигации
  useEffect(() => {
    if (!audioRef.current) return
    
    // Функция сохранения состояния
    const savePlaybackState = () => {
      if (audioRef.current && currentTrack) {
        const state = {
          trackId: currentTrack.id,
          currentTime: audioRef.current.currentTime,
          isPlaying: !audioRef.current.paused
        }
        localStorage.setItem('musicPlayerState', JSON.stringify(state))
      }
    }
    
    // Сохраняем состояние при размонтировании (навигации)
    window.addEventListener('beforeunload', savePlaybackState)
    
    // Событие для систем роутинга Next.js
    const handleRouteChange = () => {
      savePlaybackState()
    }
    
    // Этот код работает с разными системами маршрутизации Next.js
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', handleRouteChange)

      // Перехватываем клики по ссылкам для сохранения состояния
      document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement
        const link = target.closest('a')
        if (link && link.href && link.href.startsWith(window.location.origin)) {
          savePlaybackState()
        }
      })
    }
    
    return () => {
      window.removeEventListener('beforeunload', savePlaybackState)
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [currentTrack])
  
  // Automatically pause music when navigating out of main app sections
  useEffect(() => {
    if (!isInMainApp && isPlaying) {
      setIsPlaying(false)
    }
  }, [isInMainApp, isPlaying, setIsPlaying])
  
  // Восстанавливать состояние при монтировании
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('musicPlayerState')
      if (savedState && audioRef.current) {
        const state = JSON.parse(savedState)
        
        // Если трек уже загружен и совпадает с сохраненным
        if (currentTrack && state.trackId === currentTrack.id) {
          // Восстанавливаем позицию
          audioRef.current.currentTime = state.currentTime || 0
          
          // Восстанавливаем состояние воспроизведения только в main layout
          if (state.isPlaying && isPlaying && isInMainApp) {
            // Если музыка должна играть и мы находимся в основном разделе, явно запускаем воспроизведение
            const playPromise = audioRef.current.play().catch(e => console.error("Не удалось восстановить воспроизведение:", e))
            if (playPromise !== undefined) {
              playPromise.then(() => {
                isPlayingRef.current = true
              }).catch(e => console.error("Ошибка восстановления воспроизведения:", e))
            }
          }
        }
      }
    } catch (error) {
      console.error('Error restoring playback state:', error)
    }
  }, [currentTrack, isPlaying, isInMainApp])

  // Handle play/pause without fading
  useEffect(() => {
    if (!audioRef.current) return
    
    const playDirectly = async () => {
      if (!audioRef.current) return
      
      // Only allow playback in main app sections
      if (!isInMainApp) return
      
      try {
        // Если элемент уже воспроизводится, не делаем ничего
        if (!audioRef.current.paused && isPlayingRef.current) return
        
        // Устанавливаем громкость напрямую
        audioRef.current.volume = volume
        
        // Запускаем воспроизведение
        const playPromise = audioRef.current.play()
        if (playPromise !== undefined) {
          await playPromise
          isPlayingRef.current = true
        }
      } catch (error) {
        console.error('Failed to play:', error)
      }
    }
    
    const pauseDirectly = () => {
      if (!audioRef.current || audioRef.current.paused) return
      
      // Ставим на паузу напрямую
      audioRef.current.pause()
      isPlayingRef.current = false
    }
    
    if (isPlaying) {
      // Only play if we're in main app sections
      if (isInMainApp) {
        playDirectly()
      } else {
        pauseDirectly()
      }
    } else {
      pauseDirectly()
    }
  }, [isPlaying, currentTrack, volume, isInMainApp])

  // Handle volume change directly
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])
  
  // Предзагрузка трека при смене источника (без изменения громкости)
  useEffect(() => {
    if (audioRef.current && currentTrack?.audio) {
      // Сохраняем настройки для улучшения совместимости
      audioRef.current.crossOrigin = 'anonymous'
      audioRef.current.preload = 'auto'
      
      // Сразу устанавливаем нужную громкость
      audioRef.current.volume = volume
    }
  }, [currentTrack, volume])

  // Handle track end
  const handleTrackEnd = () => {
    nextTrack()
  }

  return (
    <MusicPlayerContext.Provider value={{ audioRef: audioRef }}>
      {children}
      <audio
        ref={audioRef}
        src={currentTrack?.audio}
        onEnded={handleTrackEnd}
        loop={repeat}
      />
    </MusicPlayerContext.Provider>
  )
} 