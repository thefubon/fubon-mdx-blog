'use client'

import { useEffect } from 'react'

export default function GsapClientWrapper() {
  useEffect(() => {
    const initGsap = async () => {
      try {
        // Only initialize GSAP on the client
        if (typeof window === 'undefined') return
        
        // Dynamically import GSAP and ScrollTrigger
        const gsapModule = await import('gsap')
        const ScrollTriggerModule = await import('gsap/ScrollTrigger')
        
        const gsap = gsapModule.gsap
        const ScrollTrigger = ScrollTriggerModule.ScrollTrigger
        
        // Register the plugin
        gsap.registerPlugin(ScrollTrigger)
        
        // Force refresh ScrollTrigger
        ScrollTrigger.refresh()
        
        // Add refresh on resize
        const refreshScrollTrigger = () => {
          ScrollTrigger.refresh()
        }
        
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

  // This component doesn't render anything visible
  return null
} 