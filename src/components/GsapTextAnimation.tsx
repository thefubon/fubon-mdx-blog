'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Регистрируем GSAP плагины
if (typeof window !== 'undefined') {
  gsap.registerPlugin(SplitText, ScrollTrigger)
}

export default function GsapTextAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const paragraphRef = useRef<HTMLParagraphElement>(null)
  
  useEffect(() => {
    if (!containerRef.current || !headingRef.current || !paragraphRef.current) return
    
    // Создаем объект для разделения текста на буквы
    const splitHeading = new SplitText(headingRef.current, { type: "chars" })
    const splitParagraph = new SplitText(paragraphRef.current, { type: "words" })
    
    // Скрываем текст изначально
    gsap.set([splitHeading.chars, splitParagraph.words], { 
      opacity: 0,
      y: 50
    })
    
    // Создаем анимацию для букв заголовка
    gsap.to(splitHeading.chars, {
      opacity: 1,
      y: 0,
      stagger: 0.05, // задержка между буквами
      duration: 0.8,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%", // начинать анимацию, когда верх элемента достигает 80% высоты экрана от верха
        toggleActions: "play none none none" // play, restart, resume, reset, pause, none
      }
    })
    
    // Создаем анимацию для слов параграфа
    gsap.to(splitParagraph.words, {
      opacity: 1,
      y: 0,
      stagger: 0.03, // задержка между словами
      duration: 0.5,
      ease: "power2.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
        toggleActions: "play none none none"
      },
      delay: 0.5 // начинать после анимации заголовка
    })
    
    // Очистка при размонтировании
    return () => {
      splitHeading.revert()
      splitParagraph.revert()
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])
  
  return (
    <div 
      ref={containerRef}
      className="py-12 max-w-3xl mx-auto text-center"
    >
      <h2 
        ref={headingRef}
        className="text-3xl md:text-4xl font-bold mb-6 overflow-hidden"
      >
        Анимация текста с GSAP
      </h2>
      
      <p 
        ref={paragraphRef}
        className="text-lg text-gray-600 mb-8 overflow-hidden"
      >
        GSAP позволяет создавать плавные анимации появления текста, которые срабатывают 
        при прокрутке страницы. Это отличный способ привлечь внимание посетителей к 
        важному контенту на вашем сайте.
      </p>
      
      <div className="mt-8 px-4 py-3 bg-gray-100 rounded-lg text-gray-700 text-sm">
        <p className="font-mono">
          Прокрутите вверх и вниз, чтобы увидеть эффект снова
        </p>
      </div>
    </div>
  )
} 