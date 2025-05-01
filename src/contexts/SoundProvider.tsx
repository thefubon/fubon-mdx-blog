// contexts/SoundProvider.tsx (исправленная версия)
'use client'

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react'

// Типы звуков
export type SoundType = 'hover' | 'press'

// Пути к звуковым файлам
const hoverSounds = [
  '/sounds/hover_0.mp3',
  '/sounds/hover_1.mp3',
  '/sounds/hover_2.mp3',
]

// Звуки клика/нажатия
const pressSounds = [
  '/sounds/click_0.mp3',
  '/sounds/click_1.mp3', // Если у вас есть второй звук клика
]

// Интерфейс контекста
interface SoundContextType {
  enabled: boolean
  setEnabled: (enabled: boolean) => void
  playSound: (type: SoundType) => void
  currentHoverIndex: number
  currentPressIndex: number
  incrementHoverIndex: () => void
  incrementPressIndex: () => void
}

// Создание контекста с полноценным начальным значением
const SoundContext = createContext<SoundContextType>({
  enabled: true,
  setEnabled: () => {},
  playSound: () => {},
  currentHoverIndex: 0,
  currentPressIndex: 0,
  incrementHoverIndex: () => {},
  incrementPressIndex: () => {},
})

export const useSoundContext = () => useContext(SoundContext)

interface SoundProviderProps {
  children: ReactNode
  initialEnabled?: boolean
}

export function SoundProvider({
  children,
  initialEnabled = true,
}: SoundProviderProps) {
  const [enabled, setEnabled] = useState(initialEnabled)
  const [currentHoverIndex, setCurrentHoverIndex] = useState(0)
  const [currentPressIndex, setCurrentPressIndex] = useState(0)

  // Создаем аудио элементы
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({})

  // Инициализация аудио с правильной обработкой референсов
  useEffect(() => {
    const audioElements: Record<string, HTMLAudioElement> = {}

    // Создаем аудио элементы для hover
    hoverSounds.forEach((sound, index) => {
      audioElements[`hover${index}`] = new Audio(sound)
      audioElements[`hover${index}`].preload = 'auto'
    })

    // Создаем аудио элементы для press
    pressSounds.forEach((sound, index) => {
      audioElements[`press${index}`] = new Audio(sound)
      audioElements[`press${index}`].preload = 'auto'
    })

    // Предзагрузка звуков
    Object.values(audioElements).forEach((audio) => {
      audio.load()
    })

    // Сохраняем созданные элементы в refs
    audioRefs.current = audioElements

    // Создаем локальную копию для функции очистки
    const audioElementsCleanup = { ...audioElements }

    return () => {
      // Используем локальную копию в функции очистки
      Object.values(audioElementsCleanup).forEach((audio) => {
        audio.pause()
        audio.currentTime = 0
      })
    }
  }, []) // Пустой массив зависимостей, эффект выполняется только при монтировании

  // Функция для воспроизведения звука
  const playSound = (type: SoundType) => {
    if (!enabled) return

    try {
      let audio: HTMLAudioElement | undefined

      if (type === 'hover') {
        audio = audioRefs.current[`hover${currentHoverIndex}`]
      } else if (type === 'press') {
        audio = audioRefs.current[`press${currentPressIndex}`]
      }

      if (!audio) return

      // Клонирование для возможности одновременного воспроизведения
      const clone = new Audio(audio.src)
      clone.volume = 1.0
      clone.play().catch(() => {
        // Игнорируем ошибки воспроизведения
      })
    } catch (error) {
      console.error('Ошибка воспроизведения звука:', error)
    }
  }

  // Функция для увеличения индекса звука наведения
  const incrementHoverIndex = () => {
    setCurrentHoverIndex((prev) => (prev + 1) % hoverSounds.length)
  }

  // Функция для увеличения индекса звука нажатия
  const incrementPressIndex = () => {
    setCurrentPressIndex((prev) => (prev + 1) % pressSounds.length)
  }

  // Создаем значение контекста со всеми необходимыми свойствами
  const contextValue: SoundContextType = {
    enabled,
    setEnabled,
    playSound,
    currentHoverIndex,
    currentPressIndex,
    incrementHoverIndex,
    incrementPressIndex,
  }

  return (
    <SoundContext.Provider value={contextValue}>
      {children}
    </SoundContext.Provider>
  )
}
