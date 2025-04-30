'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'

import { cn } from '@/lib/utils'

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <>
      <div className="flex items-center gap-x-2">
        <button
          onClick={() => setTheme('light')}
          className={cn(
            'px-3 py-1.5 rounded-md transition-colors',
            theme === 'light'
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-muted'
          )}>
          Light
        </button>
        <button
          onClick={() => setTheme('dark')}
          className={cn(
            'px-3 py-1.5 rounded-md transition-colors',
            theme === 'dark'
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-muted'
          )}>
          Dark
        </button>
        <button
          onClick={() => setTheme('system')}
          className={cn(
            'px-3 py-1.5 rounded-md transition-colors',
            theme === 'system'
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-muted'
          )}>
          System
        </button>
      </div>
    </>
  )
}
