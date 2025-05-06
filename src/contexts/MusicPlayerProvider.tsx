'use client'

import React, { createContext, useContext, useRef, useEffect } from 'react'
import { useMusicPlayerStore } from '@/store/use-music-player-store'

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
  
  const {
    currentTrack,
    isPlaying,
    volume,
    repeat,
    nextTrack
  } = useMusicPlayerStore()

  // Handle play/pause without fading
  useEffect(() => {
    if (!audioRef.current) return
    
    const playDirectly = async () => {
      if (!audioRef.current) return
      
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
      playDirectly()
    } else {
      pauseDirectly()
    }
  }, [isPlaying, currentTrack, volume])

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