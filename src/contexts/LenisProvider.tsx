'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import Lenis from 'lenis'

type LenisInstance = Lenis | null

// Создаем типы для опций Lenis
interface LenisOptions {
  duration?: number
  easing?: (t: number) => number
  orientation?: 'vertical' | 'horizontal'
  gestureOrientation?: 'vertical' | 'horizontal' | 'both'
  smoothWheel?: boolean
  wheelMultiplier?: number
  smoothTouch?: boolean
  touchMultiplier?: number
  infinite?: boolean
  [key: string]: unknown // Разрешаем дополнительные свойства
}

const LenisContext = createContext<LenisInstance>(null)

interface LenisProviderProps {
  children: ReactNode
}

export function LenisProvider({ children }: LenisProviderProps) {
  const [lenis, setLenis] = useState<LenisInstance>(null)

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(
      typeof navigator !== 'undefined' ? navigator.userAgent : ''
    )

    const options: LenisOptions = {
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: !isMobile,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    }

    const lenisInstance = new Lenis(options)
    setLenis(lenisInstance)

    function raf(time: number) {
      lenisInstance.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenisInstance.destroy()
      setLenis(null)
    }
  }, [])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}

export function useLenis() {
  const lenis = useContext(LenisContext)
  return lenis
}
