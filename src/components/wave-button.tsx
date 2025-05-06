'use client'

import React, { useRef, useEffect, useCallback } from 'react'
import { useSoundSystem } from '@/hooks/use-sound-system'
import { cn } from '@/lib/utils'

interface WaveButtonProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  pulseWhenIdle?: boolean
}

export function WaveButton({ 
  className, 
  size = 'md', 
  onClick,
  pulseWhenIdle = false
}: WaveButtonProps) {
  const { 
    isSoundPlaying, 
    isAmbientPlaying,
    isMusicActive,
    isAmbientWaiting,
    activeSoundSource,
    toggleSound,
    userInteracted,
    attemptPlayAmbientSound
  } = useSoundSystem()
  
  // Animation refs
  const wavePathRef = useRef<SVGPathElement | null>(null)
  const animationFrameIdRef = useRef<number | null>(null)
  const wavePhaseRef = useRef(0)
  const currentAmplitudeRef = useRef(0)
  const lastTimeRef = useRef(0)
  
  // Animation constants
  const waveAmplitude = 16
  const waveFrequency = 0.08
  
  // Пытаемся воспроизвести звук при монтировании компонента
  useEffect(() => {
    if (isAmbientPlaying && !isMusicActive && userInteracted) {
      attemptPlayAmbientSound();
    }
  }, [isAmbientPlaying, isMusicActive, userInteracted, attemptPlayAmbientSound]);
  
  // Handle button click
  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      toggleSound()
      // Если пользователь включает фоновый звук, попробуем его воспроизвести
      if (!isSoundPlaying && isAmbientPlaying) {
        attemptPlayAmbientSound();
      }
    }
  }
  
  // Wave animation function
  const createWave = useCallback((timestamp: number) => {
    const pathEl = wavePathRef.current
    if (!pathEl) return

    const deltaTime = timestamp - (lastTimeRef.current || timestamp)
    lastTimeRef.current = timestamp
    const safeDeltaTime = Math.min(deltaTime, 32)

    // Determine target amplitude based on state
    let targetAmplitude = 0
    
    if (isSoundPlaying) {
      // Active sound is playing
      targetAmplitude = waveAmplitude
    } else if (pulseWhenIdle && isAmbientWaiting) {
      // Ambient sound is waiting for user interaction - gentle pulse
      targetAmplitude = 5 + Math.sin(timestamp / 1000) * 3
    }

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

    // Adjust amplitude based on target
    if (pulseWhenIdle && isAmbientWaiting) {
      // Direct assignment for pulsing when waiting for interaction
      currentAmplitudeRef.current = targetAmplitude
    } else if (isSoundPlaying && currentAmplitudeRef.current < waveAmplitude) {
      // Smooth increase for active sound
      currentAmplitudeRef.current += 0.1 * (safeDeltaTime / 16)
    } else if (!isSoundPlaying && currentAmplitudeRef.current > 0) {
      // Smooth decrease when sound stops
      currentAmplitudeRef.current -= 0.1 * (safeDeltaTime / 16)
    }
    
    // Ensure amplitude stays within bounds
    if (!pulseWhenIdle || !isAmbientWaiting) {
      currentAmplitudeRef.current = Math.max(0, Math.min(
        currentAmplitudeRef.current,
        waveAmplitude
      ))
    }

    // Keep animation running
    animationFrameIdRef.current = requestAnimationFrame(createWave)
  }, [isSoundPlaying, isAmbientWaiting, pulseWhenIdle])
  
  // Start animation when component mounts
  useEffect(() => {
    wavePathRef.current = document.querySelector(`#wave-${size}`)
    
    if (!animationFrameIdRef.current) {
      animationFrameIdRef.current = requestAnimationFrame(createWave)
    }
    
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current)
        animationFrameIdRef.current = null
      }
    }
  }, [createWave, size])
  
  // Size classes
  const sizeClasses = {
    sm: 'size-8',
    md: 'size-10',
    lg: 'size-12'
  }
  
  return (
    <div 
      className={cn(
        "bg-primary text-primary-foreground flex justify-center items-center cursor-pointer rounded-full transition-all",
        sizeClasses[size],
        {
          "animate-pulse": pulseWhenIdle && isAmbientWaiting,
          "ring-2 ring-primary/50 ring-offset-2 ring-offset-background": isSoundPlaying,
          "opacity-70 hover:opacity-100": isAmbientWaiting
        },
        className
      )}
      onClick={handleClick}
      aria-label="Sound control"
      title={
        activeSoundSource === 'music' ? 'Music playing' : 
        isAmbientWaiting ? 'Ambient sound waiting (click to activate)' :
        isAmbientPlaying ? 'Ambient sound playing' : 'No sound'
      }
    >
      <svg
        viewBox="-10 -10 120 30"
        preserveAspectRatio="xMidYMid meet"
        className={cn(
          size === 'sm' ? '!h-3 !w-5' : size === 'md' ? '!h-3.5 !w-6' : '!h-4 !w-7'
        )}
      >
        <path
          id={`wave-${size}`}
          className="fill-none"
          d="M0 10 L100 10"
          stroke="currentColor"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="currentColor"
        />
      </svg>
    </div>
  )
} 