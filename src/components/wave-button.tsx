'use client'

import React, { useRef, useEffect, useCallback, useState } from 'react'
import { useSoundSystem } from '@/hooks/use-sound-system'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import { useHydration } from '@/hooks/use-hydration'

interface WaveButtonProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  pulseWhenIdle?: boolean
  showTrackName?: boolean
}

export function WaveButton({ 
  className, 
  size = 'md', 
  onClick,
  pulseWhenIdle = false,
  showTrackName = false
}: WaveButtonProps) {
  const { 
    isSoundPlaying, 
    isAmbientPlaying,
    isMusicActive,
    isAmbientWaiting,
    activeSoundSource,
    toggleSound,
    toggleAmbientSound,
    userInteracted,
    attemptPlayAmbientSound,
    currentTrack,
    stopPlayback
  } = useSoundSystem()
  
  // Check if component is hydrated (client-side)
  const isHydrated = useHydration()
  
  // Track if we're on mobile
  const [isMobile, setIsMobile] = useState(false)
  
  // Should show track name
  const shouldShowTrackName = showTrackName && isMusicActive && currentTrack;
  
  // Measure content width to decide if we need full width
  const [needsFullWidth, setNeedsFullWidth] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  
  // Check for mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // Use 768px as mobile breakpoint (typical md breakpoint)
    }
    
    // Check initially
    checkMobile()
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile)
    
    // Clean up
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Check if button needs to be full width on mobile
  useEffect(() => {
    if (!contentRef.current || !isMobile || !shouldShowTrackName) return;
    
    const checkWidth = () => {
      const parentWidth = contentRef.current?.parentElement?.clientWidth || 0;
      const contentWidth = contentRef.current?.scrollWidth || 0;
      
      // If content is more than 70% of available width, use full width
      setNeedsFullWidth(contentWidth > parentWidth * 0.7);
    }
    
    checkWidth();
    
    // Check when window resizes
    window.addEventListener('resize', checkWidth);
    
    return () => window.removeEventListener('resize', checkWidth);
  }, [isMobile, currentTrack, shouldShowTrackName]);
  
  // Stop ambient sound if on mobile
  useEffect(() => {
    // If we're on mobile and ambient sound is playing, turn it off
    if (isMobile && isAmbientPlaying && !isMusicActive) {
      toggleAmbientSound();
    }
  }, [isMobile, isAmbientPlaying, isMusicActive, toggleAmbientSound]);
  
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
    if (!isMobile && isAmbientPlaying && !isMusicActive && userInteracted) {
      attemptPlayAmbientSound();
    }
  }, [isAmbientPlaying, isMusicActive, userInteracted, attemptPlayAmbientSound, isMobile]);
  
  // Handle button click
  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (isMobile && isMusicActive) {
      // On mobile, do nothing for ambient sound, just handle music
      // If music is already playing, clicking does nothing
    } else if (!isMobile) {
      // On desktop, toggle ambient sound
      toggleSound()
      // Если пользователь включает фоновый звук, попробуем его воспроизвести
      if (!isMobile && !isSoundPlaying && isAmbientPlaying) {
        attemptPlayAmbientSound();
      }
    }
  }
  
  // Handle close button click - stop music playback
  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent button click
    stopPlayback();
  };
  
  // Wave animation function
  const createWave = useCallback((timestamp: number) => {
    // Skip animation on mobile when music is not playing
    if (isMobile && !isMusicActive) return;
    
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
    } else if (!isMobile && pulseWhenIdle && isAmbientWaiting) {
      // Ambient sound is waiting for user interaction - gentle pulse
      // (only on desktop)
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
    if (!isMobile && pulseWhenIdle && isAmbientWaiting) {
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
    if (!isMobile || !isAmbientWaiting) {
      currentAmplitudeRef.current = Math.max(0, Math.min(
        currentAmplitudeRef.current,
        waveAmplitude
      ))
    }

    // Keep animation running
    animationFrameIdRef.current = requestAnimationFrame(createWave)
  }, [isSoundPlaying, isAmbientWaiting, pulseWhenIdle, isMobile, isMusicActive])
  
  // Start animation when component mounts
  useEffect(() => {
    // Skip animation setup on mobile when music is not playing
    if (isMobile && !isMusicActive) return;
    
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
  }, [createWave, size, isMobile, isMusicActive])
  
  // Size classes for height
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12'
  }
  
  // For server-side rendering and first render on client:
  // Hide the button until hydration is complete
  if (!isHydrated) {
    return null;
  }
  
  // On mobile, only show the button if music is playing
  if (isMobile && !isMusicActive) {
    return null;
  }
  
  return (
    <div className="relative">
      {shouldShowTrackName && isMobile && (
        <button
          className="absolute -top-2 -right-2 z-10 size-5 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm"
          onClick={handleCloseClick}
          aria-label="Stop playback">
          <X className="size-3 text-white" />
        </button>
      )}

      <div
        ref={contentRef}
        className={cn(
          'bg-secondary hover:bg-primary text-secondary-foreground hover:text-primary-foreground flex items-center cursor-pointer rounded-full transition-all',
          shouldShowTrackName
            ? isMobile
              ? needsFullWidth
                ? 'w-full pr-3'
                : 'pr-3 min-w-12'
              : 'pr-3 min-w-12'
            : 'aspect-square',
          sizeClasses[size],
          {
            'animate-pulse': !isMobile && pulseWhenIdle && isAmbientWaiting,
            'ring-2 ring-secondary/50 ring-offset-2 ring-offset-background':
              isSoundPlaying,
            'opacity-70 hover:opacity-100': !isMobile && isAmbientWaiting,
            'opacity-0': !isHydrated, // Ensure any initial SSR render is invisible
          },
          className
        )}
        onClick={handleClick}
        title={
          activeSoundSource === 'music'
            ? `Playing: ${currentTrack?.artist || 'Unknown artist'} - ${
                currentTrack?.title || 'Unknown track'
              }`
            : isAmbientWaiting && !isMobile
            ? 'Ambient sound waiting (click to activate)'
            : isAmbientPlaying && !isMobile
            ? 'Ambient sound playing'
            : 'No sound'
        }>
        <div
          className={cn('flex justify-center items-center', {
            'aspect-square': true,
            [sizeClasses[size]]: true,
          })}>
          <svg
            viewBox="-10 -10 120 30"
            preserveAspectRatio="xMidYMid meet"
            className={cn(
              size === 'sm'
                ? '!h-3 !w-5'
                : size === 'md'
                ? '!h-3.5 !w-6'
                : '!h-4 !w-7'
            )}>
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

        {shouldShowTrackName && (
          <div
            className={cn(
              'flex flex-col justify-center',
              isMobile && needsFullWidth
                ? 'flex-1 min-w-0'
                : 'max-w-[120px] sm:max-w-[160px]'
            )}>
            <span
              className={cn(
                'text-[10px] leading-tight font-medium line-clamp-1',
                isMobile
                  ? 'overflow-hidden text-ellipsis'
                  : 'whitespace-nowrap overflow-hidden text-ellipsis'
              )}>
              {currentTrack.artist}
            </span>
            <span
              className={cn(
                'text-xs font-medium line-clamp-1',
                isMobile
                  ? 'overflow-hidden text-ellipsis'
                  : 'whitespace-nowrap overflow-hidden text-ellipsis'
              )}>
              {currentTrack.title}
            </span>
          </div>
        )}

        {shouldShowTrackName && !isMobile && (
          <button
            className="ml-2 shrink-0 size-5 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-colors"
            onClick={handleCloseClick}
            aria-label="Stop playback">
            <X className="size-3 text-white" />
          </button>
        )}
      </div>
    </div>
  )
} 