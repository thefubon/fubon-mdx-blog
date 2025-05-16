'use client'

import { useEffect } from 'react'

// We'll import GSAP within the useEffect to ensure it only runs on the client
export default function GsapInitializer() {
  useEffect(() => {
    // Only import and initialize GSAP on the client
    const initGsap = async () => {
      try {
        const gsapModule = await import('gsap')
        const ScrollTriggerModule = await import('gsap/ScrollTrigger')
        
        const gsap = gsapModule.gsap
        const ScrollTrigger = ScrollTriggerModule.ScrollTrigger
        
        // Register the plugin
        gsap.registerPlugin(ScrollTrigger)
        
        // Force refresh ScrollTrigger when component mounts
        const refreshScrollTrigger = () => {
          ScrollTrigger.refresh()
        }
        
        // Initial refresh
        refreshScrollTrigger()
        
        // Add refresh on resize
        window.addEventListener('resize', refreshScrollTrigger)
        
        // Cleanup
        return () => {
          window.removeEventListener('resize', refreshScrollTrigger)
        }
      } catch (error) {
        console.error('Failed to initialize GSAP:', error)
      }
    }
    
    initGsap()
  }, [])

  // This component doesn't render anything
  return null
} 