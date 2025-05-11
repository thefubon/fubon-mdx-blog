'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  X, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Maximize2,
  Minimize2,
  ChevronUp,
  Music
} from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { useSoundSystem } from '@/hooks/use-sound-system'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export function MiniPlayer() {
  const {
    currentTrack,
    isPlaying,
    volume,
    setVolume,
    toggleMusicPlayback,
    nextTrack,
    prevTrack,
    closeAndStopMusic,
    audioRef,
    isTrackLoaded
  } = useSoundSystem()
  
  // При первом запуске плеер скрыт (по умолчанию false)
  const [visible, setVisible] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  
  // Отслеживаем первый запуск трека из плейлиста
  const [wasEverPlayed, setWasEverPlayed] = useState(false)
  
  // Мини-плеер появляется только при запуске трека из плейлиста
  useEffect(() => {
    if (isTrackLoaded && isPlaying && !wasEverPlayed) {
      setVisible(true);
      setWasEverPlayed(true);
    } else if (isTrackLoaded && isPlaying && wasEverPlayed && !visible) {
      setVisible(true);
    }
    // Не скрываем при паузе - скрывается только при явном нажатии на крестик
  }, [isTrackLoaded, isPlaying, wasEverPlayed, visible]);

  // Track progress update
  useEffect(() => {
    if (!audioRef?.current) return
    
    // Сохраняем ссылку на аудио элемент внутри эффекта для правильной очистки
    const audioElement = audioRef.current
    
    const updateProgress = () => {
      if (audioElement) {
        const progress = (audioElement.currentTime / audioElement.duration) * 100
        setProgress(progress)
        setCurrentTime(audioElement.currentTime)
      }
    }
    
    audioElement.addEventListener('timeupdate', updateProgress)
    return () => {
      audioElement.removeEventListener('timeupdate', updateProgress)
    }
  }, [audioRef])

  const handleProgressChange = (newProgress: number[]) => {
    if (audioRef?.current) {
      const newTime = (newProgress[0] / 100) * audioRef.current.duration
      audioRef.current.currentTime = newTime
      setProgress(newProgress[0])
      setCurrentTime(newTime)
    }
  }

  // Обработчик закрытия - ЕДИНСТВЕННЫЙ способ скрыть плеер
  const handleClose = () => {
    closeAndStopMusic() // Останавливаем воспроизведение
    setVisible(false) // Скрываем мини-плеер
    setCollapsed(false) // Сбрасываем состояние свернутости
  }
  
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }
  
  const toggleCollapsed = () => {
    setCollapsed(!collapsed)
  }
  
  // Не рендерим мини-плеер, если он не должен быть видимым
  if (!visible) return null
  
  if (collapsed) {
    return (
      <div className="fixed bottom-4 right-4 z-10 transition-all duration-300">
        <Button
          size="icon"
          variant="default"
          className="size-12 rounded-full shadow-lg flex flex-col gap-1 items-center justify-center"
          onClick={toggleCollapsed}
          title="Развернуть плеер"
        >
          <Music className="h-5 w-5" />
          <ChevronUp className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className={cn(
      "inset-0 bg-background border-t p-2 transition-all duration-300",
      "translate-y-0 opacity-100" // Всегда видимый, когда рендерится
    )}>
      <div className="max-w-screen-xl mx-auto">
        <Slider
          value={[progress]}
          max={100}
          step={0.1}
          onValueChange={handleProgressChange}
          className="w-full h-1 mb-2"
        />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-12 relative rounded overflow-hidden">
              <Image
                src={currentTrack?.cover || '/img/music-notes.png'}
                alt={currentTrack?.title || 'Album cover'}
                className="object-cover"
                sizes="48px"
                priority
                fill
              />
            </div>
            <div className="flex-1">
              <p className="font-medium truncate max-w-32 sm:max-w-xs">{currentTrack?.title}</p>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground truncate max-w-24 sm:max-w-xs">{currentTrack?.artist}</p>
                <span className="text-xs text-muted-foreground">
                  {formatTime(currentTime)} / {formatTime(audioRef?.current?.duration || 0)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hidden sm:flex"
              onClick={() => setVolume(volume === 0 ? 0.5 : 0)}>
              {volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => prevTrack()}>
              <SkipBack className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={toggleMusicPlayback}>
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => nextTrack()}>
              <SkipForward className="h-4 w-4" />
            </Button>

            <Link href="/music">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                title="Go to main player">
                <Maximize2 className="h-4 w-4" />
              </Button>
            </Link>
            
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={toggleCollapsed}
              title="Minimize player">
              <Minimize2 className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={handleClose}
              title="Close player">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 