'use client'

import { useEffect, useState } from 'react'

/**
 * Custom hook to handle media queries with proper hydration
 * @param query Media query string
 * @returns boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  // Initialize matches as undefined to prevent hydration mismatch
  const [matches, setMatches] = useState<boolean | undefined>(undefined)
  
  useEffect(() => {
    // Only run on the client side
    const media = window.matchMedia(query)
    
    // Update matches state with current value
    setMatches(media.matches)
    
    // Create event listener function
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }
    
    // Modern approach using addEventListener
    media.addEventListener('change', listener)
    
    // Cleanup listener on component unmount
    return () => {
      media.removeEventListener('change', listener)
    }
  }, [query])
  
  // Return false during SSR to prevent hydration mismatch
  // Return actual value only on client-side
  return typeof matches === 'undefined' ? false : matches
} 