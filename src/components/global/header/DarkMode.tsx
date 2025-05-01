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
      <div className="flex justify-between items-center w-full">
        <Button
          variant={theme === 'light' ? 'default' : 'outline'}
          size="lg"
          className={`cursor-pointer transition-all ${
            theme === 'light' ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => setTheme('light')}>
          Light
        </Button>
        <Button
          variant={theme === 'dark' ? 'default' : 'outline'}
          size="lg"
          className={`cursor-pointer transition-all ${
            theme === 'dark' ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => setTheme('dark')}>
          Dark
        </Button>
        <Button
          variant={theme === 'system' ? 'default' : 'outline'}
          size="lg"
          className={`cursor-pointer transition-all ${
            theme === 'system' ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => setTheme('system')}>
          System
        </Button>
      </div>
    </>
  )
}
