'use client'

import React, { createContext, useContext, useRef, useEffect, useState, useCallback } from 'react'
import { useMusicPlayerStore } from '@/data/playlist'

// Для поддержки webkitAudioContext в TypeScript
interface WebAudioContext {
  AudioContext: typeof AudioContext;
  webkitAudioContext: typeof AudioContext;
}

type AmbientSoundContextType = {
  isAmbientPlaying: boolean
  toggleAmbientSound: () => void
  isMusicActive: boolean
  userInteracted: boolean
  attemptPlayAmbientSound: () => void
}

const AmbientSoundContext = createContext<AmbientSoundContextType>({
  isAmbientPlaying: false,
  toggleAmbientSound: () => {},
  isMusicActive: false,
  userInteracted: false,
  attemptPlayAmbientSound: () => {}
})

export const useAmbientSound = () => useContext(AmbientSoundContext)

const FADE_DURATION = 1200 // Увеличиваем длительность плавного перехода
const VOLUME = 0.5 // Уменьшаем громкость, чтобы минимизировать щелчки

export function AmbientSoundProvider({ children }: { children: React.ReactNode }) {
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(true)
  const [isMusicActive, setIsMusicActive] = useState(false)
  const [userInteracted, setUserInteracted] = useState(false)
  const [soundInitialized, setSoundInitialized] = useState(false)
  const ambientSoundRef = useRef<HTMLAudioElement | null>(null)
  const fadeTimeoutRef = useRef<number | null>(null)
  
  const { currentTrack, isPlaying } = useMusicPlayerStore()
  
  // Улучшенная функция для плавного изменения громкости
  const fadeVolume = useCallback((audio: HTMLAudioElement, targetVolume: number, duration: number) => {
    if (!audio) return
    
    // Отменяем предыдущий таймаут, если он существует
    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current)
      fadeTimeoutRef.current = null
    }
    
    // Обеспечиваем плавное нарастание громкости с текущего уровня
    const startVolume = audio.volume
    const startTime = performance.now()
    
    const fadeStep = () => {
      const currentTime = performance.now()
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Используем кубическую интерполяцию для более плавного звучания
      const easedProgress = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2
      
      audio.volume = startVolume + (targetVolume - startVolume) * easedProgress
      
      if (progress < 1) {
        requestAnimationFrame(fadeStep)
      }
    }
    
    // Начинаем анимацию
    requestAnimationFrame(fadeStep)
  }, [])
  
  // Подготовка аудио: предзагрузка и настройка для избежания щелчков
  const prepareAudio = useCallback((audioElement: HTMLAudioElement) => {
    if (!audioElement) return
    
    // Устанавливаем низкие начальные значения для предотвращения щелчков
    audioElement.volume = 0.001
    
    // Подготавливаем к воспроизведению
    audioElement.preload = 'auto'
    audioElement.load()
    
    // Добавляем дополнительные атрибуты для улучшения производительности
    audioElement.crossOrigin = 'anonymous'
    
    // Предварительное декодирование для ускорения запуска (не вызывает щелчков)
    if (typeof window !== 'undefined' && ('AudioContext' in window || 'webkitAudioContext' in window)) {
      try {
        const windowWithAudio = window as unknown as WebAudioContext
        const AudioContextClass = windowWithAudio.AudioContext || windowWithAudio.webkitAudioContext
        const audioContext = new AudioContextClass()
        
        // Используем предварительное декодирование, если это возможно
        if (audioContext.decodeAudioData && audioElement.src) {
          fetch(audioElement.src)
            .then(response => response.arrayBuffer())
            .then(buffer => audioContext.decodeAudioData(buffer))
            .catch(() => {
              console.debug('Audio decode failed')
            })
        }
      } catch {
        console.debug('Audio context failed')
      }
    }
  }, [])
  
  // Функция для запуска воспроизведения с плавным повышением громкости
  const startPlayback = useCallback(() => {
    if (!ambientSoundRef.current) return
    
    if (ambientSoundRef.current.paused) {
      // Начинаем с нулевой громкости для предотвращения щелчков
      ambientSoundRef.current.volume = 0
      ambientSoundRef.current.currentTime = 0
      
      // Воспроизведение с обработкой ошибок
      try {
        const playPromise = ambientSoundRef.current.play()
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // Добавляем небольшую задержку перед началом повышения громкости
              // Это предотвращает щелчок, возникающий сразу после запуска
              setTimeout(() => {
                // Плавно повышаем громкость только после успешного запуска
                fadeVolume(ambientSoundRef.current!, VOLUME, FADE_DURATION)
              }, 20)
            })
            .catch(err => {
              // Тихая обработка ошибок
              console.debug('Play failed:', err.name)
            })
        }
      } catch {
        // Запасной вариант в случае ошибки
        console.debug('Play exception caught')
      }
    }
  }, [fadeVolume])
  
  // Обработчик остановки с плавным затуханием
  const stopPlayback = useCallback(() => {
    if (!ambientSoundRef.current || ambientSoundRef.current.paused) return
    
    // Плавное снижение громкости
    fadeVolume(ambientSoundRef.current, 0, FADE_DURATION)
    
    // Ставим паузу только после завершения затухания
    fadeTimeoutRef.current = window.setTimeout(() => {
      if (ambientSoundRef.current) {
        ambientSoundRef.current.pause()
        
        // После остановки сбрасываем текущее время для следующего запуска
        ambientSoundRef.current.currentTime = 0
      }
    }, FADE_DURATION)
  }, [fadeVolume])
  
  // Инициализация аудио один раз при монтировании
  useEffect(() => {
    const audio = new Audio('/sounds/lofi-loop.mp3')
    audio.loop = true
    audio.volume = 0  // Начинаем с нулевой громкости
    
    // Предзагрузка для лучшей производительности
    prepareAudio(audio)
    
    ambientSoundRef.current = audio
    setSoundInitialized(true)
    
    return () => {
      // Очищаем таймаут при размонтировании
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current)
        fadeTimeoutRef.current = null
      }
      
      if (ambientSoundRef.current) {
        ambientSoundRef.current.pause()
        ambientSoundRef.current = null
      }
    }
  }, [prepareAudio])
  
  // Обработка взаимодействия пользователя
  useEffect(() => {
    if (userInteracted) return
    
    // Функция для попытки воспроизведения и обхода блокировки
    const attemptSoundUnlock = () => {
      setUserInteracted(true)
      
      // Если нет активной музыки и ambient должен играть, запускаем его
      if (isAmbientPlaying && !isMusicActive) {
        startPlayback()
      }
    }
    
    // Обработчик первого взаимодействия
    const onFirstInteraction = () => {
      attemptSoundUnlock()
    }
    
    // Регистрируем обработчики событий с расширенным набором событий
    const interactionEvents = ['click', 'mousedown', 'keydown', 'touchstart']
    
    interactionEvents.forEach(event => {
      document.addEventListener(event, onFirstInteraction, { once: true })
    })
    
    return () => {
      interactionEvents.forEach(event => {
        document.removeEventListener(event, onFirstInteraction)
      })
    }
  }, [userInteracted, isAmbientPlaying, isMusicActive, startPlayback])
  
  // Обработка переключения состояния музыки
  useEffect(() => {
    setIsMusicActive(!!currentTrack && isPlaying)
  }, [currentTrack, isPlaying])
  
  // Управление воспроизведением в зависимости от состояния
  useEffect(() => {
    if (!soundInitialized) return
    
    if (isMusicActive) {
      // Останавливаем фоновый звук, если играет музыка
      stopPlayback()
    } else if (isAmbientPlaying && userInteracted) {
      // Запускаем фоновый звук, если он должен играть
      startPlayback()
    } else {
      // Останавливаем фоновый звук, если он не должен играть
      stopPlayback()
    }
  }, [isAmbientPlaying, isMusicActive, userInteracted, soundInitialized, startPlayback, stopPlayback])
  
  // Переключатель звука с минимальной задержкой для предотвращения щелчков
  const toggleAmbientSound = useCallback(() => {
    setIsAmbientPlaying(prev => !prev)
  }, [])
  
  // Функция для попытки воспроизведения фонового звука
  const attemptPlayAmbientSound = useCallback(() => {
    if (userInteracted && isAmbientPlaying && !isMusicActive) {
      startPlayback()
    }
  }, [userInteracted, isAmbientPlaying, isMusicActive, startPlayback])
  
  return (
    <AmbientSoundContext.Provider 
      value={{ 
        isAmbientPlaying, 
        toggleAmbientSound,
        isMusicActive,
        userInteracted,
        attemptPlayAmbientSound
      }}
    >
      {children}
    </AmbientSoundContext.Provider>
  )
} 