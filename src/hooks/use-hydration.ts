'use client'

import { useEffect, useState } from 'react'

/**
 * Hook to check if the component has been hydrated on the client-side
 * Useful for avoiding hydration mismatch issues when components need
 * to render differently based on client-side information
 */
export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false)
  
  useEffect(() => {
    // Effect runs only on the client after hydration
    setIsHydrated(true)
  }, [])
  
  return isHydrated
} 