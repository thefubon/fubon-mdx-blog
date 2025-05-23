// components/SimpleSoundWrapper.tsx
'use client'

import React, { ReactNode, useState, memo } from 'react'
import { useSoundContext } from '@/contexts/SoundProvider' // Оставляем оригинальный импорт, т.к. это контекст

interface SoundWrapperProps {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
  disableSound?: boolean
}

function SoundWrapperComponent({
  children,
  className = '',
  style,
  disableSound = false,
}: SoundWrapperProps) {
  const { playSound, incrementHoverIndex, incrementPressIndex } =
    useSoundContext()

  const [isMouseDown, setIsMouseDown] = useState(false)

  // Обработчик наведения
  const handleMouseEnter = () => {
    if (disableSound || isMouseDown) return

    playSound('hover')
    incrementHoverIndex()
  }

  // Обработчик нажатия - только здесь воспроизводим звук
  const handleMouseDown = () => {
    if (disableSound) return

    setIsMouseDown(true)
    playSound('press')

    // Инкрементируем индекс для следующего нажатия
    incrementPressIndex()
  }

  // Обработчик отпускания - просто сбрасываем состояние без звука
  const handleMouseUp = () => {
    setIsMouseDown(false)
  }

  // Обработчик ухода курсора с элемента
  const handleMouseLeave = () => {
    setIsMouseDown(false)
  }

  return (
    <span
      className={className}
      style={{
        ...style,
        display: 'inline-block',
        cursor: 'pointer',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}>
      {children}
    </span>
  )
}

// Мемоизированный компонент для предотвращения лишних перерендеров
const SoundWrapper = memo(SoundWrapperComponent);
export default SoundWrapper;
