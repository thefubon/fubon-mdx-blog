// src/components/Player.tsx
'use client'

import { useEffect, useRef, useCallback } from 'react'
import { Howl } from 'howler'
import { Button } from './ui/button'

const FADE_DURATION = 1000
const VOLUME = 1

export default function Player() {
  const soundRef = useRef<Howl | null>(null)
  const isWaveActiveRef = useRef(false)
  const animationFrameIdRef = useRef<number | null>(null)
  const wavePhaseRef = useRef(0)
  const currentAmplitudeRef = useRef(0)
  const lastTimeRef = useRef(0)
  const wavePathRef = useRef<SVGPathElement | null>(null)

  const waveAmplitude = 16
  const waveFrequency = 0.08

  const isDev = process.env.NODE_ENV === 'development'
  const isMobile =
    typeof navigator !== 'undefined' &&
    /Mobi|Android/i.test(navigator.userAgent)

  const createWave = useCallback((timestamp: number) => {
    const pathEl = wavePathRef.current
    if (!pathEl) return

    const deltaTime = timestamp - (lastTimeRef.current || timestamp)
    lastTimeRef.current = timestamp
    const safeDeltaTime = Math.min(deltaTime, 32)

    const points: string[] = []
    for (let x = 0; x <= 100; x += 5) {
      const y =
        10 +
        currentAmplitudeRef.current *
          Math.sin(waveFrequency * x + wavePhaseRef.current)
      points.push(`${x} ${y}`)
    }
    pathEl.setAttribute('d', `M${points.join(' L')}`)

    wavePhaseRef.current += (safeDeltaTime / 16) * waveFrequency

    if (
      isWaveActiveRef.current &&
      currentAmplitudeRef.current < waveAmplitude
    ) {
      currentAmplitudeRef.current += 0.1 * (safeDeltaTime / 16)
    } else if (!isWaveActiveRef.current && currentAmplitudeRef.current > 0) {
      currentAmplitudeRef.current -= 0.1 * (safeDeltaTime / 16)
    }
    currentAmplitudeRef.current = Math.min(
      currentAmplitudeRef.current,
      waveAmplitude
    )

    if (isWaveActiveRef.current || currentAmplitudeRef.current > 0) {
      animationFrameIdRef.current = requestAnimationFrame(createWave)
    } else {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current)
        animationFrameIdRef.current = null
      }
      pathEl.setAttribute('d', 'M0 10 L100 10')
    }
  }, [])

  const startPlayback = useCallback(() => {
    const sound = soundRef.current
    if (!sound || sound.playing()) return

    isWaveActiveRef.current = true
    sound.play()
    sound.fade(0, VOLUME, FADE_DURATION)
    if (!animationFrameIdRef.current) {
      createWave(performance.now())
    }
  }, [createWave])

  const handleClick = () => {
    const sound = soundRef.current
    if (!sound) return

    if (sound.playing()) {
      isWaveActiveRef.current = false
      sound.fade(sound.volume(), 0, FADE_DURATION)
      setTimeout(() => sound.pause(), FADE_DURATION)
    } else {
      startPlayback()
    }
  }

  useEffect(() => {
    soundRef.current = new Howl({
      src: ['/sound/generic.webm', '/sound/generic.ogg', '/sound/generic.mp3'],
      loop: true,
      volume: 0,
    })

    wavePathRef.current = document.querySelector<SVGPathElement>('#wavePath')

    if (!isDev && !isMobile) {
      const onFirstInteraction = () => {
        startPlayback()
        document.removeEventListener('mousemove', onFirstInteraction)
        document.removeEventListener('click', onFirstInteraction)
        document.removeEventListener('touchstart', onFirstInteraction)
      }
      document.addEventListener('mousemove', onFirstInteraction, { once: true })
      document.addEventListener('click', onFirstInteraction, { once: true })
      document.addEventListener('touchstart', onFirstInteraction, {
        once: true,
      })
    }

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current)
      }
      soundRef.current?.unload()
    }
  }, [isDev, isMobile, startPlayback])

  return (
    <Button
      className="animation-trigger relative size-12 cursor-pointer rounded-full"
      aria-label="Кнопка управления музыкой"
      onClick={handleClick}
      size="icon">
      <svg
        viewBox="-10 -10 120 30"
        preserveAspectRatio="xMidYMid meet"
        className="!h-4 !w-7">
        <path
          id="wavePath"
          className="fill-none"
          d="M0 10 L100 10"
          stroke="currentColor"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="currentColor"
        />
      </svg>
    </Button>
  )
}
