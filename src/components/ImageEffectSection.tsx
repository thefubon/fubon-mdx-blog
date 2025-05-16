'use client'

import { Suspense, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamic import with lazy loading for ImageEffect component
const ImageEffect = dynamic(() => import('@/components/ImageEffect'), {
  loading: () => (
    <div className="w-full h-[400px] rounded-2xl bg-gray-100 animate-pulse flex items-center justify-center">
      <div className="text-gray-400">Загрузка эффекта...</div>
    </div>
  )
})

// Sample images data
const imagesData = [
  {
    src: '/demo.png',
    alt: 'Portfolio image 1',
    title: 'Digital Experience'
  },
  {
    src: '/splash-n.jpg',
    alt: 'Portfolio image 2',
    title: 'Creative Design'
  },
  {
    src: '/img/sparkle_img.jpg',
    alt: 'Portfolio image 3',
    title: 'Web Development'
  },
  {
    src: '/img/jb_ghost_img.jpg',
    alt: 'Portfolio image 4',
    title: 'Mobile Solutions'
  }
]

export default function ImageEffectSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // This ensures GSAP animations run correctly after mount
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('resize'))
      }
    }, 500)
    
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) {
    // Return a placeholder while not mounted
    return (
      <section className="mt-20 mb-20">
        <h2 className="text-3xl font-bold mb-8 text-center">Наши проекты</h2>
        <div className="grid sm:grid-cols-2 gap-10 md:gap-12 lg:gap-14">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="portfolio-item">
              <div className="w-full h-[400px] rounded-2xl bg-gray-100 animate-pulse flex items-center justify-center">
                <div className="text-gray-400">Загрузка изображения...</div>
              </div>
              <div className="h-12 mt-4 bg-gray-100 animate-pulse rounded"></div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="mt-20 mb-20">
      <h2 className="text-3xl font-bold mb-8 text-center">Наши проекты</h2>
      <div className="grid sm:grid-cols-2 gap-10 md:gap-12 lg:gap-14">
        {imagesData.map((image, index) => (
          <div key={index} className="portfolio-item">
            <Suspense 
              fallback={
                <div className="w-full h-[400px] rounded-2xl bg-gray-100 animate-pulse flex items-center justify-center">
                  <div className="text-gray-400">Загрузка изображения...</div>
                </div>
              }
            >
              <ImageEffect 
                imageUrl={image.src} 
                altText={image.alt} 
              />
            </Suspense>
            <h4 className="text-2xl md:text-3xl lg:text-4xl py-4">{image.title}</h4>
          </div>
        ))}
      </div>
    </section>
  )
} 