'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'

// Динамический импорт компонентов с GSAP анимацией с ленивой загрузкой
const AnimationLine = dynamic(() => import('@/components/AnimationLine'), { 
  ssr: false,
  loading: () => (
    <div className="w-full flex items-center justify-center animate-pulse">
      <div className="text-gray-400">Загрузка анимации...</div>
    </div>
  )
})

export default function GsapDemoSection() {
  return (
    <>
      <Suspense
        fallback={
          <div className="w-full flex items-center justify-center">
            <div className="text-gray-400">Загрузка анимации...</div>
          </div>
        }>
        <AnimationLine />
      </Suspense>
    </>
  )
} 