// src/components/AudioPlayer.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { tracks } from '@/data/player'
import AudioManager from '@/utils/audioManager'
import Image from 'next/image'

export default function AudioPlayer() {
  // Состояния UI
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [debugMode, setDebugMode] = useState<boolean>(false)

  // Ссылки на DOM-элементы
  const progressBarRef = useRef<HTMLDivElement | null>(null)

  // Получаем инстанс менеджера аудио
  const audioManagerRef = useRef<AudioManager | null>(null)

  // Функция сброса прогресса - вынесем для переиспользования
  const resetProgress = () => {
    setProgress(0)
    setCurrentTime(0)
    setDuration(0)
  }

  // Инициализируем AudioManager при первом рендере
  useEffect(() => {
    const audioManager = AudioManager.getInstance()
    audioManager.setTracks(tracks)
    audioManagerRef.current = audioManager

    // Улучшенные колбэки для синхронизации состояния UI с аудио
    audioManager.setCallbacks({
      onPlay: () => {
        setIsPlaying(true)
        // Принудительно запускаем обновление прогресса через интервал
        // для гарантии обновления UI
        const checkInterval = setInterval(() => {
          if (audioManager.isPlaying()) {
            const pos = audioManager.getCurrentPosition()
            const dur = audioManager.getDuration()
            if (pos > 0 && dur > 0) {
              setDuration(dur)
              setCurrentTime(pos)
              setProgress((pos / dur) * 100)
            }
          } else {
            clearInterval(checkInterval)
          }
        }, 100) // Проверяем каждые 100ms

        // Очистка интервала
        setTimeout(() => clearInterval(checkInterval), 1000)
      },
      onPause: () => {
        setIsPlaying(false)
        // Обновляем позицию явно при паузе
        const pos = audioManager.getCurrentPosition()
        const dur = audioManager.getDuration()
        setCurrentTime(pos)
        setProgress((pos / dur) * 100)
      },
      onStop: () => {
        setIsPlaying(false)
        resetProgress()
      },
      onEnd: () => {
        resetProgress()
        const newIndex = audioManager.nextTrack()
        setCurrentTrackIndex(newIndex)
        audioManager.play()
      },
      onLoad: () => {
        const dur = audioManager.getDuration()
        setDuration(dur)
        setCurrentTime(0)
        setProgress(0)
      },
      onSeek: () => {
        const pos = audioManager.getCurrentPosition()
        const dur = audioManager.getDuration()
        setCurrentTime(pos)
        setProgress((pos / dur) * 100)
      },
      onProgress: (position, trackDuration) => {
        // Добавляем дополнительные проверки и логирование
        if (position >= 0 && trackDuration > 0) {
          const newProgress = (position / trackDuration) * 100

          // Логгируем только в режиме отладки, чтобы не замусоривать консоль
          if (debugMode) {
            console.log(
              `[Player] Progress update: ${position.toFixed(
                2
              )}/${trackDuration.toFixed(2)} = ${newProgress.toFixed(1)}%`
            )
          }

          // Используем функциональное обновление для большей надежности
          setCurrentTime((prevTime) => {
            // Обновляем только если значение значительно изменилось
            if (Math.abs(prevTime - position) > 0.1) {
              return position
            }
            return prevTime
          })

          setProgress((prevProgress) => {
            // Обновляем только если значение значительно изменилось
            if (Math.abs(prevProgress - newProgress) > 0.1) {
              return newProgress
            }
            return prevProgress
          })
        }
      },
      onTrackChange: () => {
        console.log('[AudioPlayer] Track changed - resetting progress')
        resetProgress()
      },
    })

    // Инициализация первого трека
    audioManager.initTrack(0)

    // Добавляем форсированное обновление прогресса
    const updateInterval = setInterval(() => {
      if (audioManager.isPlaying()) {
        audioManager.updateProgressManually()
      }
    }, 1000) // Проверяем каждую секунду

    // Очистка при размонтировании компонента
    return () => {
      clearInterval(updateInterval)
      audioManager.destroy()
    }
  }, [debugMode])

  // Добавим новый эффект для ручного обновления прогресса
  // при изменении продолжительности трека
  useEffect(() => {
    if (audioManagerRef.current && duration > 0) {
      // Если продолжительность обновилась, обновляем прогресс
      audioManagerRef.current.updateProgressManually()
    }
  }, [duration])

  // Обработчик переключения трека
  useEffect(() => {
    if (!audioManagerRef.current) return

    const currentManagerIndex = audioManagerRef.current.getCurrentIndex()

    // Если индекс трека в UI не совпадает с индексом в менеджере
    if (currentTrackIndex !== currentManagerIndex) {
      // Сначала сбрасываем прогресс для чистого UI при переключении
      resetProgress()

      // Затем инициализируем новый трек
      audioManagerRef.current.initTrack(currentTrackIndex)

      // Если был в режиме воспроизведения, продолжаем воспроизведение нового трека
      if (isPlaying) {
        audioManagerRef.current.play()
      }
    }
  }, [currentTrackIndex, isPlaying])

  // Функция форматирования времени
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  // Функция переключения воспроизведения/паузы
  const togglePlayPause = (trackIndex?: number): void => {
    if (!audioManagerRef.current) return

    if (trackIndex !== undefined && trackIndex !== currentTrackIndex) {
      // Если выбран другой трек
      setCurrentTrackIndex(trackIndex)
      // Сбрасываем прогресс перед переключением
      resetProgress()
      return
    }

    audioManagerRef.current.togglePlayPause()
  }

  // Функция перехода к следующему треку
  const nextTrack = (): void => {
    if (!audioManagerRef.current) return

    // Сбрасываем прогресс перед переключением
    resetProgress()

    const newIndex = audioManagerRef.current.nextTrack()
    setCurrentTrackIndex(newIndex)

    if (isPlaying) {
      audioManagerRef.current.play()
    }
  }

  // Функция перехода к предыдущему треку
  const prevTrack = (): void => {
    if (!audioManagerRef.current) return

    // Сбрасываем прогресс перед переключением
    resetProgress()

    const newIndex = audioManagerRef.current.prevTrack()
    setCurrentTrackIndex(newIndex)

    if (isPlaying) {
      audioManagerRef.current.play()
    }
  }

  // Обработчик клика на прогресс-бар - обновленная версия
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (!progressBarRef.current || !audioManagerRef.current || duration === 0)
      return

    const rect = progressBarRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const clickPositionPercent = x / rect.width
    const seekTime = duration * clickPositionPercent

    // Важное изменение: обновляем UI немедленно
    setCurrentTime(seekTime)
    setProgress(clickPositionPercent * 100)

    // Затем отправляем команду в аудио-менеджер
    audioManagerRef.current.seek(seekTime)
  }

  // Текущий трек
  const currentTrack = tracks[currentTrackIndex] || tracks[0]

  return (
    <div className="flex flex-col gap-6 p-5 border rounded-xl shadow-lg bg-white w-full max-w-md">
      {/* Главный плеер */}
      <div className="flex flex-col items-center gap-4 w-full">
        {/* Обложка */}
        {currentTrack.cover ? (
          <Image
            src={currentTrack.cover}
            alt={`Обложка ${currentTrack.title}`}
            className="w-36 h-36 rounded object-cover"
            width={288}
            height={288}
          />
        ) : (
          <div className="w-36 h-36 bg-gray-200 rounded flex items-center justify-center text-gray-500">
            No Cover
          </div>
        )}

        {/* Информация о треке */}
        <h3 className="text-xl font-semibold">{currentTrack.title}</h3>
        <p className="text-gray-600">{currentTrack.artist}</p>

        {/* Прогресс-бар с улучшенным визуальным индикатором */}
        <div className="w-full">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div
            ref={progressBarRef}
            className="w-full h-3 bg-gray-200 rounded-full cursor-pointer relative overflow-hidden hover:h-4 transition-all"
            onClick={handleProgressClick}>
            {/* Линия прогресса с анимацией */}
            <div
              className="absolute left-0 top-0 h-full bg-blue-600 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}></div>

            {/* Индикатор текущей позиции */}
            <div
              className="absolute top-1/2 -translate-y-1/2 h-5 w-5 bg-white border-2 border-blue-700 rounded-full shadow-md transition-all duration-100 hidden md:block"
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
            className="text-xl px-4 py-2 rounded-full hover:bg-gray-200"
            aria-label="Предыдущий трек">
            ⏪
          </button>
          <button
            onClick={() => togglePlayPause()}
            className="text-3xl px-5 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
            aria-label={isPlaying ? 'Пауза' : 'Воспроизвести'}>
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          <button
            onClick={nextTrack}
            className="text-xl px-4 py-2 rounded-full hover:bg-gray-200"
            aria-label="Следующий трек">
            ⏩
          </button>
        </div>
      </div>

      {/* Список треков */}
      <div className="w-full mt-6">
        <h3 className="text-lg font-semibold mb-3">Список треков</h3>
        <div className="space-y-2">
          {tracks.map((track, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg flex items-center gap-3 relative ${
                currentTrackIndex === index
                  ? 'bg-blue-50 border border-blue-200'
                  : 'bg-gray-50 hover:bg-gray-100'
              } cursor-pointer overflow-hidden`}
              onClick={() => togglePlayPause(index)}>
              {/* Миниатюра трека */}
              {track.cover ? (
                <Image
                  src={track.cover}
                  alt={`Миниатюра ${track.title}`}
                  className="w-12 h-12 rounded object-cover"
                  width={96}
                  height={96}
                />
              ) : (
                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                  <span>🎵</span>
                </div>
              )}

              {/* Информация о треке */}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{track.title}</p>
                <p className="text-sm text-gray-600 truncate">{track.artist}</p>
              </div>

              {/* Индикатор воспроизведения */}
              <div className="w-8 flex justify-center">
                {currentTrackIndex === index && isPlaying ? (
                  <span className="text-blue-600 animate-pulse">▶️</span>
                ) : currentTrackIndex === index ? (
                  <span className="text-gray-400">⏸️</span>
                ) : (
                  <span className="text-gray-400">▶️</span>
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

      {/* Отладочная информация (скрыта по умолчанию) */}
      {debugMode && (
        <div className="mt-4 p-3 bg-gray-100 rounded text-xs font-mono">
          <h4 className="font-bold mb-1">Debug Info:</h4>
          <div>Current Track: {currentTrackIndex}</div>
          <div>Playing: {isPlaying ? 'Yes' : 'No'}</div>
          <div>Progress: {progress.toFixed(1)}%</div>
          <div>Current Time: {currentTime.toFixed(2)}s</div>
          <div>Duration: {duration.toFixed(2)}s</div>
        </div>
      )}

      {/* Кнопка включения режима отладки */}
      <div className="mt-2 text-center">
        <button
          onClick={() => setDebugMode(!debugMode)}
          className="text-xs text-gray-400 hover:text-gray-600">
          {debugMode ? 'Скрыть отладку' : 'Режим отладки'}
        </button>
      </div>
    </div>
  )
}

