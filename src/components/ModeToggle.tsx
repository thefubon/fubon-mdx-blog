'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <>
      <div className="flex items-center gap-x-2">
        <button
          onClick={() => setTheme('light')}>
          Light
        </button>
        <button
          onClick={() => setTheme('dark')}>
          Dark
        </button>
        <button
          onClick={() => setTheme('system')}>
          System
        </button>
      </div>
    </>
  )
}
