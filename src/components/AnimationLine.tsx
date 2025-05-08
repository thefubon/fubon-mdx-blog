'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function AnimationLine() {
  const svgRef = useRef<SVGSVGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  
  useEffect(() => {
    // Устанавливаем флаг загрузки, чтобы избежать дерганья при первой загрузке
    let isMounted = true
    
    const loadPlugins = async () => {
      try {
        // Загружаем плагины с обработкой ошибок
        const ScrollTriggerModule = await import('gsap/dist/ScrollTrigger')
        const DrawSVGModule = await import('gsap/dist/DrawSVGPlugin')
        
        const ScrollTrigger = ScrollTriggerModule.ScrollTrigger
        const DrawSVGPlugin = DrawSVGModule.DrawSVGPlugin
        
        // Регистрируем плагины
        gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin)
        
        // Устанавливаем флаг загрузки только если компонент все еще смонтирован
        if (isMounted) {
          setIsLoaded(true)
        }
      } catch (error) {
        console.error('Failed to load GSAP plugins:', error)
      }
    }
    
    loadPlugins()
    
    return () => {
      isMounted = false
    }
  }, [])
  
  useEffect(() => {
    // Этот эффект запускается только после успешной загрузки плагинов
    if (!isLoaded || !svgRef.current || !pathRef.current) return
    
    // Импортируем плагины повторно для типизации
    const setupAnimation = async () => {
      try {
        const { ScrollTrigger } = await import('gsap/dist/ScrollTrigger')
        
        // Скрываем линию изначально для предотвращения ее появления перед анимацией
        gsap.set(pathRef.current, { autoAlpha: 0, drawSVG: 0 })
        
        // Небольшая задержка для стабилизации страницы после загрузки
        const delay = setTimeout(() => {
          const ctx = gsap.context(() => {
            // Показываем линию с анимацией
            gsap.to(pathRef.current, {
              autoAlpha: 1,
              duration: 0.3
            })
            
            // Анимируем рисование пути при прокрутке
            gsap.to(pathRef.current, {
              drawSVG: "100%",
              duration: 2,
              ease: "power1.inOut",
              scrollTrigger: {
                trigger: svgRef.current,
                start: "top 80%",
                end: "bottom 20%",
                scrub: 1,
                markers: false,
                // Принудительно пересчитываем позиции для более стабильной работы
                invalidateOnRefresh: true
              }
            })
          }, svgRef)
          
          return () => {
            ctx.revert()
            ScrollTrigger.getAll().forEach(trigger => trigger.kill())
          }
        }, 300)
        
        return () => clearTimeout(delay)
      } catch (error) {
        console.error('Error setting up animation:', error)
      }
    }
    
    const cleanup = setupAnimation()
    return () => {
      cleanup.then(cleanupFn => cleanupFn && cleanupFn())
    }
  }, [isLoaded])
  
  return (
    <div className="svg-container w-full overflow-hidden my-16 relative h-[500px] md:h-[700px]">
      <svg
        ref={svgRef}
        className="wave w-full h-full absolute top-0 left-0"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 2305 1420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.3s ease' }}
      >
        <path
          ref={pathRef}
          className="wave-path"
          d="M0.544312 30.5231C354.321 30.5231 809.022 316.137 823.675 718.029C841.99 1220.39 308.022 1371.95 266.666 1088.6C225.31 805.255 621.912 643.75 1116.41 735.647C1422.69 792.566 1541.95 980.944 1575.83 1040.57C1622.88 1123.38 1696.44 1165.25 1845.52 1105.62C2000.88 1043.48 2157.22 1090.72 2164.97 1280.32C2168.02 1354.92 2199.81 1389.47 2304.04 1389.47"
          stroke="url(#paint0_linear_29_1196)"
          strokeWidth="40"
          strokeLinecap="round"
          fill="none"
        ></path>
        <defs>
          <linearGradient
            id="paint0_linear_29_1196"
            x1="0.544302"
            y1="80.6013"
            x2="2274.84"
            y2="1356.06"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#303EE8"></stop>
            <stop
              offset="1"
              stopColor="#6083F7"
            ></stop>
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
} 