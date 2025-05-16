'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

// Import GSAP dynamically instead of statically
interface ImageEffectProps {
  imageUrl: string
  altText: string
}

export default function ImageEffect({ imageUrl, altText }: ImageEffectProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Exit early if refs aren't available or if window is undefined (SSR)
    if (!wrapperRef.current || !imgRef.current || typeof window === 'undefined') return

    // Dynamically import GSAP
    const initializeAnimation = async () => {
      try {
        // Dynamic imports
        const gsapModule = await import('gsap')
        const { ScrollTrigger } = await import('gsap/ScrollTrigger')
        
        const gsap = gsapModule.gsap
        
        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger)
        
        const wrapper = wrapperRef.current
        const img = imgRef.current
        
        // Exit if elements are no longer in DOM
        if (!wrapper || !img) return
        
        // Small delay to ensure DOM is fully rendered
        const timer = setTimeout(() => {
          // Ensure elements still exist
          if (!wrapper || !img) return
          
          // Determine animation direction based on wrapper's position in the DOM
          const allWrappers = document.querySelectorAll('.image-wrapper')
          const wrapperIndex = Array.from(allWrappers).indexOf(wrapper)
          const isRightToLeft = wrapperIndex % 2 === 0 // Even indices: right to left

          // Set initial state for the image
          gsap.set(img, {
            scale: 1.5, // Initial scale (enlarged)
            x: isRightToLeft ? '20%' : '-20%', // Initial offset
            transformOrigin: isRightToLeft ? 'right center' : 'left center',
            z: 0,
          })

          // Set initial state for the container
          gsap.set(wrapper, {
            rotationX: 0, // Initial rotation angle on X axis
            scaleX: 0.8, // Initial scale on X axis (80% width)
            transformOrigin: isRightToLeft ? 'right center' : 'left center',
          })

          // Create IntersectionObserver for automatic animation when appearing in viewport
          const observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  // Element is visible
                  gsap.to(img, {
                    scale: 1, // Reduce image scale to original size
                    x: '0%', // Center the image
                    z: -200,
                    duration: 1,
                    ease: 'power2.out',
                  })

                  gsap.to(wrapper, {
                    rotationX: 0, // Remove tilt when appearing
                    scaleX: 1, // Increase container width to 100%
                    duration: 1,
                    ease: 'power2.out',
                  })
                } else {
                  // Element is not visible
                  gsap.to(img, {
                    scale: 1.5, // Return image scale to enlarged value
                    x: isRightToLeft ? '20%' : '-20%', // Return image to initial position
                    z: 0,
                    duration: 1,
                    ease: 'power2.out',
                  })

                  gsap.to(wrapper, {
                    rotationX: 0, // Return to zero tilt
                    scaleX: 0.8, // Return container width to 80%
                    duration: 1,
                    ease: 'power2.out',
                  })
                }
              })
            },
            {
              threshold: 0.1, // Increased threshold for better detection
              rootMargin: "0px", // No margin
            }
          )

          // Start observing the wrapper (not the image)
          observer.observe(wrapper)

          // ScrollTrigger for X-axis rotation on scroll
          let previousScroll = 0 // Store previous scroll value
          
          const scrollTrigger = ScrollTrigger.create({
            trigger: wrapper, // Trigger - inner container
            start: 'top 80%', // Animation starts when container is 80% visible
            end: 'bottom 20%', // Animation ends when container is 20% visible
            scrub: 1.5, // Increase animation smoothness
            onUpdate: (self) => {
              const scrollDirection = self.scroll() > previousScroll ? 1 : -1 // Determine scroll direction
              previousScroll = self.scroll() // Update previous scroll value

              // Rotation on X axis depending on scroll direction
              const rotationX = scrollDirection * 2 // Tilt from -2 to 2 degrees

              gsap.to(wrapper, {
                rotationX: rotationX, // X-axis tilt
                duration: 0.8, // Increase animation duration
                ease: 'power2.out', // Soft easing function
                overwrite: 'auto',
              })
            },
          })

          // Force a refresh to ensure proper initialization
          ScrollTrigger.refresh()

          // Cleanup function
          return () => {
            observer.disconnect()
            scrollTrigger.kill()
            clearTimeout(timer)
          }
        }, 100)  // Small delay to ensure DOM is ready

        return () => clearTimeout(timer)
      } catch (error) {
        console.error('Failed to initialize GSAP animation:', error)
      }
    }

    initializeAnimation()
  }, [])

  return (
    <div className="image-container w-full relative h-[400px]" style={{ perspective: '1000px' }}>
      <div 
        ref={wrapperRef} 
        className="image-wrapper relative w-full h-full rounded-2xl overflow-hidden" 
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div 
          ref={imgRef} 
          className="scroll-img absolute inset-0" 
          style={{ transformStyle: 'preserve-3d' }}
        >
          <Image
            src={imageUrl}
            alt={altText}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  )
} 