// src/components/music/AudioPlayer.tsx
'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { Button } from '../ui/button'
import { Pause, Play, SkipBack, SkipForward } from 'lucide-react'
import { useAudioPlayer } from '@/contexts/AudioPlayerProvider'
import { tracks } from '@/data/player'

export default function AudioPlayer() {
  // Состояния из контекста
  const {
    currentTrackIndex,
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

  // Ссылка на прогресс-бар
  const progressBarRef = useRef<HTMLDivElement | null>(null)

  // Обработчик клика на прогресс-бар
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (!progressBarRef.current || duration === 0) return

    const rect = progressBarRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const clickPositionPercent = x / rect.width
    const seekTime = duration * clickPositionPercent

    seek(seekTime)
  }

  // Текущий трек
  const currentTrack = tracks[currentTrackIndex] || tracks[0]

  return (
    <div className="flex flex-col gap-6 w-full max-w-md">
      {/* Главный плеер */}
      <div className="flex flex-col items-center gap-4 w-full border border-blue-500">
        {/* Обложка */}
        {currentTrack.cover ? (
          <div className="relative">
            <Image
              src={currentTrack.cover}
              alt={`Обложка ${currentTrack.title}`}
              className="w-36 h-36 rounded object-cover"
              width={288}
              height={288}
            />

            {/* Кнопка волны под обложкой */}
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

        {/* Информация о треке */}
        <h3 className="text-xl font-semibold mt-6">{currentTrack.title}</h3>
        <p className="text-foreground/50">{currentTrack.artist}</p>

        {/* Прогресс-бар */}
        <div className="w-full">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div
            ref={progressBarRef}
            className="w-full h-5 bg-gray-200 dark:bg-zinc-600 rounded-full cursor-pointer relative overflow-hidden transition-all"
            onClick={handleProgressClick}>
            {/* Линия прогресса с анимацией */}
            <div
              className="absolute left-0 top-0 h-full bg-blue-600 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}></div>

            {/* Индикатор текущей позиции */}
            <div
              className="absolute top-1/2 -translate-x-1/2 h-5 w-5 bg-white border-2 border-blue-700 rounded-full shadow-md transition-all duration-100 hidden md:block"
              style={{
                left: `${Math.min(Math.max(progress, 1), 99)}%`,
                transform: 'translate(-50%, -50%)',
                opacity: progress > 0 ? 1 : 0,
              }}></div>
          </div>
        </div>

        {/* Кнопки управления */}
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

      {/* Список треков */}
      <div className="w-full mt-6 border border-green-500">
        <h3 className="text-lg font-semibold mb-3">Список треков</h3>
        <div className="space-y-2">
          {tracks.map((track, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg flex items-center gap-3 relative ${
                currentTrackIndex === index
                  ? 'border bg-background dark:bg-zinc-600'
                  : 'border dark:bg-zinc-600/50 dark:hover:bg-zinc-600'
              } cursor-pointer overflow-hidden`}
              onClick={() => togglePlayPause(index)}>
              {/* Миниатюра трека */}
              {track.cover ? (
                <Image
                  src={track.cover}
                  alt={`Миниатюра ${track.title}`}
                  className="w-12 h-12 rounded object-cover"
                  width={48}
                  height={48}
                />
              ) : (
                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-foreground">
                  <span>🎵</span>
                </div>
              )}

              {/* Информация о треке */}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{track.title}</p>
                <p className="text-sm text-foreground/50 truncate">
                  {track.artist}
                </p>
              </div>

              {/* Индикатор воспроизведения */}
              <div className="w-8 flex justify-center">
                {currentTrackIndex === index && isPlaying ? (
                  <span className="text-blue-600 animate-pulse">
                    <Play />
                  </span>
                ) : currentTrackIndex === index ? (
                  <span className="text-gray-400">
                    <Pause />
                  </span>
                ) : (
                  <span className="text-gray-400">
                    <Play />
                  </span>
                )}
              </div>

              {/* Мини-прогрессбар для трека в списке */}
              {currentTrackIndex === index && (
                <div
                  className="absolute bottom-0 left-0 h-1 bg-blue-600 transition-all"
                  style={{ width: `${progress}%` }}></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
