'use client'

import { useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export default function PaginationVisibilityHandler() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

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
          
          // Если включили режим "Избранное" и мы не на первой странице,
          // перенаправляем на первую страницу
          const page = searchParams?.get('page')
          if (page && pathname?.startsWith('/blog')) {
            // Убираем параметр page из URL и перенаправляем на базовый путь
            const basePath = pathname?.split('?')[0] || '/'
            router.push(basePath)
          }
        } else {
          paginationElement.style.display = 'block'
        }
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [pathname, router, searchParams])

  // This component doesn't render anything
  return null
} 