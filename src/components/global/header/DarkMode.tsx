'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

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
    <>
      <div className="flex items-center gap-x-2">
        <Button
          variant={theme === 'light' ? 'default' : 'outline'}
          className={`cursor-pointer transition-all ${
            theme === 'light' ? '' : ''
          }`}
          onClick={() => setTheme('light')}>
          Light
        </Button>

        <Button
          variant={theme === 'dark' ? 'default' : 'outline'}
          className={`cursor-pointer transition-all ${
            theme === 'dark' ? '' : ''
          }`}
          onClick={() => setTheme('dark')}>
          Dark
        </Button>

        <Button
          variant={theme === 'system' ? 'default' : 'outline'}
          className={`cursor-pointer transition-all ${
            theme === 'system' ? '' : ''
          }`}
          onClick={() => setTheme('system')}>
          System
        </Button>
      </div>
    </>
  )
}
