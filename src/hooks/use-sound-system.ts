'use client'

import { useMusicPlayerStore } from "@/data/playlist"
import { useMusicPlayer } from "@/contexts/MusicPlayerProvider"
import { useCallback, useEffect } from "react"
import { usePathname } from "next/navigation"

export function useSoundSystem() {
  const {
    currentTrack,
    isPlaying,
    volume,
    shuffle,
    repeat,
    playlist,
    setTrack,
    setIsPlaying,
    setVolume,
    toggleShuffle,
    toggleRepeat,
    nextTrack,
    prevTrack,
    stopPlayback
  } = useMusicPlayerStore()
  
  const { audioRef } = useMusicPlayer()
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

  // Check if a track is loaded (regardless of play state)
  const isTrackLoaded = !!currentTrack
  
  // Переключение только состояния музыки (для мини-плеера и основного плеера)
  // Без плавных переходов
  const toggleMusicPlayback = useCallback(() => {
    if (currentTrack) {
      // Напрямую переключаем состояние воспроизведения
      setIsPlaying(!isPlaying)
    }
  }, [currentTrack, isPlaying, setIsPlaying])
  
  // Полная остановка музыки и закрытие плеера
  const closeAndStopMusic = useCallback(() => {
    // Немедленно останавливаем без плавных переходов
    stopPlayback()
  }, [stopPlayback])
  
  // Auto-pause when navigating away from main app sections
  useEffect(() => {
    if (!isInMainApp && isPlaying) {
      setIsPlaying(false)
    }
  }, [isInMainApp, isPlaying, setIsPlaying])
  
  return {
    // Music player state and functions
    currentTrack,
    isPlaying,
    volume,
    shuffle,
    repeat,
    playlist,
    setTrack,
    setIsPlaying,
    setVolume,
    toggleShuffle,
    toggleRepeat,
    nextTrack,
    prevTrack,
    stopPlayback,
    
    // Audio reference
    audioRef,
    
    // Combined utilities
    isTrackLoaded,
    toggleMusicPlayback,
    closeAndStopMusic,
    isInMainApp
  }
} 