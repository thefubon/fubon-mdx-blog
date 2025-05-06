'use client'

import { useMusicPlayerStore } from "@/store/use-music-player-store"
import { useAmbientSound } from "@/contexts/AmbientSoundProvider"
import { useMusicPlayer } from "@/contexts/MusicPlayerProvider"
import { useCallback } from "react"

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
  
  const { isAmbientPlaying, toggleAmbientSound, isMusicActive, userInteracted, attemptPlayAmbientSound } = useAmbientSound()
  const { audioRef } = useMusicPlayer()
  
  // Get the active sound source
  const activeSoundSource = isMusicActive ? 'music' : isAmbientPlaying ? 'ambient' : 'none'
  
  // Check if any sound is currently playing
  const isSoundPlaying = isMusicActive || (isAmbientPlaying && userInteracted)
  
  // Check if ambient sound is waiting for user interaction
  const isAmbientWaiting = isAmbientPlaying && !userInteracted && !isMusicActive
  
  // Check if a track is loaded (regardless of play state)
  const isTrackLoaded = !!currentTrack
  
  // Toggle только ambient sound, не влияя на плеер музыки
  const toggleSound = useCallback(() => {
    // Если играет музыка из плейлиста, не меняем её состояние через эту функцию
    if (!isMusicActive) {
      toggleAmbientSound()
    }
    // Если мы здесь, и играет музыка - просто ничего не делаем
    // Музыкой из плейлиста управляет только мини-плеер и музыкальный плеер
  }, [isMusicActive, toggleAmbientSound])
  
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
    
    // Ambient sound state and functions
    isAmbientPlaying,
    toggleAmbientSound,
    isMusicActive,
    userInteracted,
    isAmbientWaiting,
    attemptPlayAmbientSound,
    
    // Audio reference
    audioRef,
    
    // Combined utilities
    activeSoundSource,
    isSoundPlaying,
    isTrackLoaded,
    toggleSound,
    toggleMusicPlayback,
    closeAndStopMusic
  }
} 