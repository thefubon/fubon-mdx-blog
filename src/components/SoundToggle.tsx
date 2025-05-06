// components/SoundToggle.tsx
'use client'

import { useSoundContext } from '@/contexts/SoundProvider'
import { Volume2, VolumeX } from 'lucide-react'

export function SoundToggle() {
  const { enabled, setEnabled } = useSoundContext()

  return (
    <div className="flex items-center gap-1 p-1 rounded-full bg-muted">
      <button
        onClick={() => setEnabled(true)}
        className={`size-8 flex items-center justify-center rounded-full transition-all ${
          enabled
            ? 'bg-white text-primary shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        aria-label="Включить звуки">
        <Volume2 className="size-4" />
      </button>
      
      <button
        onClick={() => setEnabled(false)}
        className={`size-8 flex items-center justify-center rounded-full transition-all ${
          !enabled
            ? 'bg-white text-primary shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        aria-label="Выключить звуки">
        <VolumeX className="size-4" />
      </button>
    </div>
  )
}

