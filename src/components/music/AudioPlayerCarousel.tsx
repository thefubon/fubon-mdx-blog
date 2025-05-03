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
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full carousel relative"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
      opts={{
        align: 'center',
        loop: true,
      }}>
      <CarouselContent className="-ml-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem
            key={index}
            className="basis-3/4 md:basis-1/2 lg:basis-2/3 pl-4">
            <div className="">
              <Image
                src="/music/carousel/AudioCarousel-1.png"
                width={1000}
                height={580}
                alt="001"
                className="object-cover w-full h-full rounded-lg"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className="absolute left-2 bottom-0 z-20" />
      <CarouselNext className="absolute right-2 bottom-0 z-20" />
    </Carousel>
  )
}
