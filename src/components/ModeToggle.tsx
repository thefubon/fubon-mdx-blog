'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <>
      <div className="flex justify-between items-center w-full">
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
