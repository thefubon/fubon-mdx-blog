'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function GsapAnimation() {
  const boxRef = useRef<HTMLDivElement>(null)
  const circleRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLHeadingElement>(null)
  
  useEffect(() => {
    // Make sure all elements exist before animating
    if (!boxRef.current || !circleRef.current || !textRef.current) return
    
    // Create a GSAP timeline
    const tl = gsap.timeline({ repeat: -1, yoyo: true })
    
    // Animation for the box
    tl.to(boxRef.current, {
      x: 100,
      rotation: 360,
      backgroundColor: '#4299e1', // blue-500
      duration: 2,
      ease: 'power2.inOut'
    })
    
    // Animation for the circle
    tl.to(circleRef.current, {
      scale: 1.5,
      y: -30,
      backgroundColor: '#f56565', // red-500
      duration: 1.5,
      ease: 'elastic.out(1, 0.3)'
    }, '-=1.5') // Start 1.5 seconds before the previous animation ends
    
    // Animation for the text
    tl.to(textRef.current, {
      scale: 1.2,
      color: '#805ad5', // purple-600
      duration: 1,
      ease: 'back.out(1.7)'
    }, '-=1')
    
    // Clean up the animation when the component unmounts
    return () => {
      tl.kill()
    }
  }, [])
  
  return (
    <div className="flex flex-col items-center justify-center py-10 mb-10 overflow-hidden">
      <h2 className="text-2xl font-bold mb-6" ref={textRef}>
        GSAP Animation Demo
      </h2>
      
      <div className="flex items-center justify-center gap-8 h-[200px] w-full relative">
        {/* Square box */}
        <div 
          ref={boxRef}
          className="w-20 h-20 bg-emerald-500 rounded-md shadow-lg"
        ></div>
        
        {/* Circle */}
        <div 
          ref={circleRef}
          className="w-20 h-20 bg-amber-500 rounded-full shadow-lg"
        ></div>
      </div>
      
      <p className="text-gray-600 mt-6 text-center max-w-lg">
        Это простая демонстрация возможностей библиотеки GSAP для анимации.
        Вы можете использовать GSAP для создания сложных и плавных анимаций на вашем сайте.
      </p>
    </div>
  )
} 