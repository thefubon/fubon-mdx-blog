'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'

// Динамический импорт компонентов с GSAP анимацией с ленивой загрузкой
const AnimationLine = dynamic(() => import('@/components/AnimationLine'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] flex items-center justify-center bg-gray-50 rounded-xl animate-pulse">
      <div className="text-gray-400">Загрузка анимации...</div>
    </div>
  )
})

// Импорт простой анимации также
const GsapAnimation = dynamic(() => import('@/components/GsapAnimation'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[200px] flex items-center justify-center bg-gray-50 rounded-lg animate-pulse">
      <div className="text-gray-400">Загрузка анимации...</div>
    </div>
  )
})

// Импорт простой GsapScrollAnimation также
const GsapScrollAnimation = dynamic(
  () => import('@/components/GsapScrollAnimation'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[200px] flex items-center justify-center bg-gray-50 rounded-lg animate-pulse">
        <div className="text-gray-400">Загрузка анимации...</div>
      </div>
    ),
  }
)

// Импорт простой GsapTextAnimation также
const GsapTextAnimation = dynamic(
  () => import('@/components/GsapTextAnimation'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[200px] flex items-center justify-center bg-gray-50 rounded-lg animate-pulse">
        <div className="text-gray-400">Загрузка анимации...</div>
      </div>
    ),
  }
)

export default function GsapDemoSection() {
  return (
    <>
      {/* GSAP примеры анимации */}
      <section className="mt-16 mb-12 border-t border-gray-100 pt-12">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Анимированная линия с GSAP
        </h2>

        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-8">
          Эта анимация построена с использованием GSAP и ScrollTrigger, линия
          рисуется при прокрутке страницы. Прокрутите вниз, чтобы увидеть
          эффект.
        </p>

        {/* Компонент анимированной линии обернутый в Suspense */}
        <Suspense
          fallback={
            <div className="w-full h-[500px] flex items-center justify-center bg-gray-50 rounded-xl">
              <div className="text-gray-400">Загрузка анимации...</div>
            </div>
          }>
          <AnimationLine />
        </Suspense>

        {/* Секция с простыми анимациями */}
        <div className="mt-20 border-t border-gray-100 pt-16">
          <h3 className="text-2xl font-bold mb-8 text-center">
            Простые анимации GSAP
          </h3>

          <Suspense
            fallback={
              <div className="w-full h-[200px] flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-gray-400">Загрузка анимации...</div>
              </div>
            }>
            <GsapAnimation />
          </Suspense>
        </div>

        {/* Секция с GsapScrollAnimation анимациями */}
        <div className="mt-20 border-t border-gray-100 pt-16">
          <h3 className="text-2xl font-bold mb-8 text-center">
            Простые анимации GSAP
          </h3>

          <Suspense
            fallback={
              <div className="w-full h-[200px] flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-gray-400">Загрузка анимации...</div>
              </div>
            }>
            <GsapScrollAnimation />
          </Suspense>
        </div>

        {/* Секция с GsapTextAnimation анимациями */}
        <div className="mt-20 border-t border-gray-100 pt-16">
          <h3 className="text-2xl font-bold mb-8 text-center">
            Простые анимации GSAP
          </h3>

          <Suspense
            fallback={
              <div className="w-full h-[200px] flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-gray-400">Загрузка анимации...</div>
              </div>
            }>
            <GsapTextAnimation />
          </Suspense>
        </div>

        <div className="max-w-3xl mx-auto mt-16 px-6 py-6 bg-gray-50 rounded-xl border border-gray-100">
          <h3 className="text-xl font-semibold mb-4">
            Как подключить GSAP в Next.js 19
          </h3>
          <ul className="list-disc list-inside space-y-3 text-gray-700">
            <li>
              Установите GSAP пакеты:{' '}
              <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                npm install gsap
              </code>
            </li>
            <li>
              Создайте клиентский компонент с директивой{' '}
              <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                {"'use client'"}
              </code>
            </li>
            <li>
              Используйте динамический импорт с{' '}
              <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                dynamic()
              </code>{' '}
              для клиентских компонентов
            </li>
            <li>
              Регистрируйте плагины внутри проверки{' '}
              <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                if (typeof window !== {"'undefined'"})
              </code>
            </li>
            <li>
              Храните ссылки на DOM-элементы через{' '}
              <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                useRef
              </code>
            </li>
            <li>
              Инициализируйте анимации в хуке{' '}
              <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                useEffect
              </code>
            </li>
            <li>
              Не забудьте про очистку анимаций при размонтировании компонента
            </li>
          </ul>
        </div>
      </section>
    </>
  )
} 