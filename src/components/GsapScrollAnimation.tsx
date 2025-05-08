'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Регистрируем плагин ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function GsapScrollAnimation() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const panelRefs = useRef<Array<HTMLDivElement | null>>([])
  
  useEffect(() => {
    // Проверяем, что раздел существует
    if (!sectionRef.current) return
    
    // Создаем контекст для изоляции анимаций
    const ctx = gsap.context(() => {
      // Получаем все панели
      const panels = panelRefs.current.filter(Boolean)
      
      // Для каждой панели создаем свою анимацию
      panels.forEach((panel, i) => {
        if (!panel) return
        
        // Анимируем непрозрачность и масштаб при прокрутке
        gsap.fromTo(panel, 
          { 
            opacity: 0, 
            scale: 0.8,
            y: 50
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: panel,
              start: "top 80%", // начинаем, когда элемент достигает 80% от верха окна
              end: "top 20%", // заканчиваем, когда элемент достигает 20% от верха окна
              scrub: 0.5, // плавный скраб с задержкой 0.5 секунды
              toggleActions: "play none none reverse", // play на входе, reverse на выходе
              markers: false // для отладки можно включить маркеры
            }
          }
        )
        
        // Добавляем вращение для каждого элемента с разными направлениями
        gsap.fromTo(panel.querySelector('.card-content'),
          { rotation: i % 2 === 0 ? -10 : 10 },
          {
            rotation: 0,
            duration: 1.5,
            ease: "elastic.out(1, 0.3)",
            scrollTrigger: {
              trigger: panel,
              start: "top 80%",
              end: "top 20%",
              scrub: 0.8
            }
          }
        )
      })
    }, sectionRef)
    
    // Очистка при размонтировании
    return () => {
      ctx.revert() // GSAP 3 очистка контекста
      ScrollTrigger.getAll().forEach(trigger => trigger.kill()) // убиваем все триггеры
    }
  }, [])
  
  const addPanelRef = (el: HTMLDivElement | null, index: number) => {
    panelRefs.current[index] = el
  }
  
  return (
    <div ref={sectionRef} className="py-8">
      <h2 className="text-center text-3xl font-bold mb-10">
        Анимация при прокрутке с ScrollTrigger
      </h2>
      
      <div className="space-y-24 mb-16">
        {[
          { 
            title: "Плавное появление", 
            desc: "Элементы плавно появляются и масштабируются при прокрутке страницы",
            color: "bg-gradient-to-br from-blue-500 to-indigo-600"
          },
          { 
            title: "Параллакс эффекты", 
            desc: "ScrollTrigger позволяет создавать эффекты параллакса для более динамичных страниц",
            color: "bg-gradient-to-br from-purple-500 to-pink-600"
          },
          { 
            title: "Привязка к прокрутке", 
            desc: "Анимации могут быть точно синхронизированы с положением прокрутки пользователя",
            color: "bg-gradient-to-br from-amber-500 to-red-600"
          },
          { 
            title: "Анимированные секции", 
            desc: "Создавайте впечатляющие переходы между разделами вашего сайта",
            color: "bg-gradient-to-br from-emerald-500 to-teal-600"
          }
        ].map((item, index) => (
          <div 
            key={index} 
            ref={(el) => addPanelRef(el, index)}
            className="max-w-2xl mx-auto h-64 overflow-hidden rounded-xl shadow-lg"
          >
            <div className={`card-content ${item.color} h-full p-8 flex flex-col justify-center`}>
              <h3 className="text-2xl font-bold text-white mb-4">
                {item.title}
              </h3>
              <p className="text-white/90">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center text-gray-600 italic">
        Прокрутите вверх/вниз, чтобы увидеть эффекты снова
      </div>
    </div>
  )
} 