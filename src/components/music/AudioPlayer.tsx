'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { Button } from '../ui/button'
import { Pause, Play, SkipBack, SkipForward } from 'lucide-react'
import { useAudioPlayer } from '@/contexts/AudioPlayerProvider'
import { Track } from '@/data/player'

interface AudioPlayerProps {
  currentTrack: Track
}

export default function AudioPlayer({ currentTrack }: AudioPlayerProps) {
  const {
    isPlaying,
    progress,
    duration,
    currentTime,
    togglePlayPause,
    nextTrack,
    prevTrack,
    seek,
    formatTime,
  } = useAudioPlayer()

  const progressBarRef = useRef<HTMLDivElement>(null)

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || duration === 0) return

    const rect = progressBarRef.current.getBoundingClientRect()
    const clickPosition = (e.clientX - rect.left) / rect.width
    const seekTime = Math.max(0, Math.min(duration, duration * clickPosition))
    seek(seekTime)
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {currentTrack.cover ? (
        <div className="relative">
          <Image
            src={currentTrack.cover}
            alt={`Обложка ${currentTrack.title}`}
            className="w-36 h-36 rounded object-cover"
            width={288}
            height={288}
          />

          <div className="absolute -bottom-6 left-0 w-full flex justify-center">
            <Button
              className="animation-trigger relative size-12 cursor-pointer rounded-full"
              aria-label="Кнопка управления музыкой"
              onClick={() => togglePlayPause()}
              size="icon">
              <svg
                viewBox="-10 -10 120 30"
                preserveAspectRatio="xMidYMid meet"
                className="!h-4 !w-7">
                <path
                  id="wavePath"
                  className="fill-none"
                  d="M0 10 L100 10"
                  stroke="currentColor"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="currentColor"
                />
              </svg>
            </Button>
          </div>
        </div>
      ) : (
        <div className="w-36 h-36 bg-muted rounded flex items-center justify-center text-gray-500">
          No Cover
        </div>
      )}

      <h3 className="text-xl font-semibold mt-6">{currentTrack.title}</h3>
      <p className="text-foreground/50">{currentTrack.artist}</p>

      <div className="w-full">
        <div className="flex justify-between text-sm text-gray-500 mb-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <div
          ref={progressBarRef}
          className="w-full h-5 bg-gray-200 dark:bg-zinc-600 rounded-full cursor-pointer relative overflow-hidden transition-all"
          onClick={handleProgressClick}>
          <div
            className="absolute left-0 top-0 h-full bg-blue-600 rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute top-1/2 -translate-x-1/2 h-5 w-5 bg-white border-2 border-blue-700 rounded-full shadow-md transition-all duration-100 hidden md:block"
            style={{
              left: `${Math.min(Math.max(progress, 1), 99)}%`,
              transform: 'translate(-50%, -50%)',
              opacity: progress > 0 ? 1 : 0,
            }}
          />
        </div>
      </div>

      <div className="flex justify-between w-full mt-4">
        <button
          onClick={prevTrack}
          className="text-xl px-4 py-2 rounded-full hover:bg-blue-600"
          aria-label="Предыдущий трек">
          <SkipBack />
        </button>
        <button
          onClick={() => togglePlayPause()}
          className="text-3xl px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          aria-label={isPlaying ? 'Пауза' : 'Воспроизвести'}>
          {isPlaying ? <Pause /> : <Play />}
        </button>
        <button
          onClick={nextTrack}
          className="text-xl px-4 py-2 rounded-full hover:bg-blue-600"
          aria-label="Следующий трек">
          <SkipForward />
        </button>
      </div>
    </div>
  )
}
