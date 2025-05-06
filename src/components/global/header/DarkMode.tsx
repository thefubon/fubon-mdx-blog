'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Moon, Sun, Laptop } from 'lucide-react'

export function DarkMode() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Необходимо для предотвращения ошибки гидратации
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="flex items-center gap-1 p-1 rounded-full bg-muted">
      <button
        onClick={() => setTheme('light')}
        className={`size-8 flex items-center justify-center rounded-full transition-all ${
          theme === 'light'
            ? 'bg-white text-fubon-primary shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        aria-label="Светлая тема">
        <Sun className="size-4" />
      </button>
      
      <button
        onClick={() => setTheme('dark')}
        className={`size-8 flex items-center justify-center rounded-full transition-all ${
          theme === 'dark'
            ? 'bg-foreground text-fubon-primary shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        aria-label="Темная тема">
        <Moon className="size-4" />
      </button>
      
      <button
        onClick={() => setTheme('system')}
        className={`size-8 flex items-center justify-center rounded-full transition-all ${
          theme === 'system'
            ? 'bg-secondary text-fubon-primary shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        aria-label="Системная тема">
        <Laptop className="size-4" />
      </button>
    </div>
  )
}
