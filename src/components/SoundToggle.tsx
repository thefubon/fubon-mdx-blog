// components/SoundToggle.tsx
'use client'

import { useSoundContext } from '@/contexts/SoundProvider'
import { Volume2, VolumeOff } from 'lucide-react'

export function SoundToggle() {
  const { enabled, setEnabled } = useSoundContext()

  return (
    <>
      <button
        onClick={() => setEnabled(!enabled)}
        className="size-12 md:size-[var(--button-height)] bg-foreground hover:bg-fubon-primary text-background rounded-full relative z-50 cursor-pointer flex justify-center items-center transition-colors duration-300"
        aria-label={enabled ? 'Выключить звуки' : 'Включить звуки'}>
        {enabled ? (
          <Volume2
            size={24}
            strokeWidth={1.8}
          />
        ) : (
          <VolumeOff
            size={24}
            strokeWidth={1.8}
          />
        )}
      </button>
    </>
  )
}

