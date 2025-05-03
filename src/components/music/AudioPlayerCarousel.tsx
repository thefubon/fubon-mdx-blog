'use client'

import * as React from 'react'
import Autoplay from 'embla-carousel-autoplay'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import Image from 'next/image'

export function AudioPlayerCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )

  // Массив с данными изображений
  const carouselImages = [
    {
      src: '/music/carousel/AudioCarousel-1.png',
      alt: 'Slide 1',
    },
    {
      src: '/music/carousel/AudioCarousel-2.png',
      alt: 'Slide 2',
    },
    {
      src: '/music/carousel/AudioCarousel-3.png',
      alt: 'Slide 3',
    },
    {
      src: '/music/carousel/AudioCarousel-4.png',
      alt: 'Slide 4',
    },
    {
      src: '/music/carousel/AudioCarousel-5.png',
      alt: 'Slide 5',
    },
  ]

  return (
    <Carousel
      plugins={[plugin.current]}
      className="audio-carousel"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
      opts={{
        align: 'center',
        loop: false,
      }}>
      <CarouselContent className="-ml-3 md:-ml-4">
        {carouselImages.map((image, index) => (
          <CarouselItem
            key={index}
            className="basis-3/3 md:basis-2/3 lg:basis-2/4 xl:basis-2/5 pl-3 md:pl-4">
            <div className="">
              <Image
                src={image.src}
                width={1000}
                height={580}
                alt={image.alt}
                className="object-cover w-full h-full rounded-lg"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className="carousel__previous" />
      <CarouselNext className="carousel__next" />
    </Carousel>
  )
}
