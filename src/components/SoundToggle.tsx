// components/SoundToggle.tsx
'use client'

import { useSoundContext } from '@/contexts/SoundProvider'

export function SoundToggle() {
  const { enabled, setEnabled } = useSoundContext()

  return (
    <button
      onClick={() => setEnabled(!enabled)}
      className="size-10 bg-gray-800 text-white rounded-full z-50"
      aria-label={enabled ? 'Выключить звуки' : 'Включить звуки'}>
      {enabled ? '🔊' : '🔇'}
    </button>
  )
}
