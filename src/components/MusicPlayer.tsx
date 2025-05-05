'use client'

import React, { useRef, useEffect, useState } from 'react'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import {
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  Play,
  Pause,
  Repeat,
  Shuffle,
} from 'lucide-react'
import { useMusicPlayerStore } from '@/data/playlist'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
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
  } = useMusicPlayerStore()
  const [trackDirection, setTrackDirection] = useState('')
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [sliderDisabled, setSliderDisabled] = useState(true)

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const progress =
        (audioRef.current.currentTime / audioRef.current.duration) * 100
      setProgress(progress)
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleProgressChange = (newProgress: number[]) => {
    if (audioRef.current) {
      const newTime = (newProgress[0] / 100) * audioRef.current.duration
      audioRef.current.currentTime = newTime
      setProgress(newProgress[0])
      setCurrentTime(newTime)
    }
  }

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play()
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying, currentTrack])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  useEffect(() => {
    const currentAudioRef = audioRef.current // Копируем текущее значение audioRef.current
    const updateTime = () => setCurrentTime(currentAudioRef!.currentTime)
    currentAudioRef?.addEventListener('timeupdate', updateTime)
    return () => {
      currentAudioRef?.removeEventListener('timeupdate', updateTime)
    }
  }, [])

  useEffect(() => {
    setSliderDisabled(!currentTrack?.audio)
  }, [currentTrack?.audio])

  useEffect(() => {
    if (playlist.length > 0 && !currentTrack?.audio) {
      setTrack(playlist[0])
    }
  }, [playlist, currentTrack?.audio, setTrack])

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-background border rounded-lg shadow-lg">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div
          key={`cover-${currentTrack?.id}-${trackDirection}`}
          className="w-64 h-64 rounded-lg overflow-hidden">
          <div className="w-full h-full relative rounded-lg">
            <Image
              src={currentTrack?.cover || '/img/music-notes.png'}
              alt={currentTrack?.title || 'Album cover'}
              className="object-cover rounded-lg"
              sizes="(max-width: 500px) 100vw, (max-width: 1000px) 50vw, 33vw"
              priority
              fill
            />
          </div>
        </div>

        <div className="flex-1 w-full">
          <div
            key={currentTrack?.id}
            className="text-center md:text-left">
            <h2 className="text-2xl font-bold mb-2">
              {currentTrack?.title || 'No track selected'}
            </h2>
            <p className="text-muted-foreground mb-1">
              {currentTrack?.artist || 'Unknown artist'}
            </p>
            <p className="text-sm text-muted-foreground">
              {currentTrack?.album || 'Unknown album'}
            </p>
          </div>

          <div className="h-48">
            <div className="mt-4">
              <Slider
                disabled={sliderDisabled}
                value={[progress]}
                max={100}
                step={0.1}
                onValueChange={handleProgressChange}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(audioRef.current?.duration || 0)}</span>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setVolume(volume === 0 ? 1 : 0)}>
                {volume === 0 ? <VolumeX /> : <Volume2 />}
              </Button>
              <Slider
                value={[volume * 100]}
                max={100}
                step={1}
                onValueChange={(newVolume) => setVolume(newVolume[0] / 100)}
                className="w-full max-w-xs"
              />
            </div>
            <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleShuffle}>
                <Shuffle
                  className={shuffle ? 'text-primary' : 'text-muted-foreground'}
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setTrackDirection('previous')
                  if (!currentTrack && !isPlaying) {
                    setIsPlaying(true)
                    setTrack(playlist[playlist.length - 1])
                    return
                  }
                  prevTrack()
                }}>
                <SkipBack />
              </Button>
              <Button
                variant="default"
                size="icon"
                onClick={() => {
                  if (!currentTrack && !isPlaying) {
                    setTrackDirection('next')
                    setIsPlaying(true)
                    setTrack(playlist[0])
                    return
                  }
                  setIsPlaying(!isPlaying)
                }}>
                {isPlaying ? <Pause /> : <Play />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setTrackDirection('next')
                  if (!currentTrack && !isPlaying) {
                    setIsPlaying(true)
                    setTrack(playlist[0])
                    return
                  }
                  nextTrack()
                }}>
                <SkipForward />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleRepeat}>
                <Repeat
                  className={repeat ? 'text-primary' : 'text-muted-foreground'}
                />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Playlist</h3>
        <ul className="space-y-2">
          {playlist.map((track) => (
            <li key={track.id}>
              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-start h-auto',
                  currentTrack?.id === track.id ? 'bg-accent' : ''
                )}
                onClick={() => {
                  setTrack(track)
                  setIsPlaying(true)
                }}>
                <div className="size-12 rounded mr-1 relative">
                  <Image
                    src={track.cover}
                    alt={track.title}
                    className="object-fill rounded-md"
                    sizes="(max-width: 500px) 100vw, (max-width: 1000px) 50vw, 33vw"
                    priority
                    fill
                  />
                </div>
                <div className="text-left">
                  <p className="font-medium">{track.title}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-x-2">
                    {track.artist} | {track.date}
                  </p>
                </div>
              </Button>
            </li>
          ))}
        </ul>
      </div>
      <audio
        ref={audioRef}
        src={currentTrack?.audio}
        onEnded={nextTrack}
        onTimeUpdate={handleTimeUpdate}
      />
    </div>
  )
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}
