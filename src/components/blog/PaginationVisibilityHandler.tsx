'use client'

import { useEffect } from 'react'

export default function PaginationVisibilityHandler() {
  useEffect(() => {
    // Function to check and hide pagination
    const checkAndHidePagination = () => {
      try {
        if (localStorage.getItem('blogShowFavorites') === 'true') {
          const paginationElement = document.getElementById('server-pagination')
          if (paginationElement) paginationElement.style.display = 'none'
        }
      } catch {
        // Silent catch for environments without localStorage
      }
    }
    
    // Initial check
    checkAndHidePagination()
    
    // Listen for storage events
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'blogShowFavorites') {
        const paginationElement = document.getElementById('server-pagination')
        if (!paginationElement) return
        
        if (e.newValue === 'true') {
          paginationElement.style.display = 'none'
        } else {
          paginationElement.style.display = 'block'
        }
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // No need for MutationObserver as React will handle DOM updates properly
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  // This component doesn't render anything
  return null
} 