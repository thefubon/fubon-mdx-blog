// src/components/music/AudioPlayerCarousel.tsx
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
import { Button } from '../ui/button'
import { Pause, Play } from 'lucide-react'
import { tracks } from '@/data/player'
import { useAudioPlayer } from '@/contexts/AudioPlayerProvider'

export function AudioPlayerCarousel() {
  // Используем хук для доступа к контексту
  const {
    topTracks,
    currentTrackIndex,
    isPlaying,
    playTrackFromCarousel,
    togglePlayPause,
  } = useAudioPlayer()

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )

  // Показываем карусель только если есть треки для неё
  if (topTracks.length === 0) return null

  // Функция для правильного переключения воспроизведения из карусели
  const handleCarouselPlay = (trackId: number) => {
    const trackIndex = tracks.findIndex((t) => t.id === trackId)

    // Если это тот же трек, что сейчас играет, просто переключаем Play/Pause
    if (trackIndex === currentTrackIndex) {
      togglePlayPause()
    } else {
      // Иначе запускаем новый трек
      playTrackFromCarousel(trackId)
    }
  }

  return (
    <Carousel
      plugins={[plugin.current]}
      className="audio-carousel"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
      opts={{
        align: 'start',
        loop: false,
      }}>
      <CarouselContent className="-ml-3 md:-ml-4">
        {topTracks.map((track, index) => (
          <CarouselItem
            key={index}
            className="basis-3/3 md:basis-2/3 lg:basis-2/4 xl:basis-2/5 pl-3 md:pl-4">
            <div className="relative group">
              <Image
                src={track.carousel || ''}
                width={1000}
                height={580}
                alt={`${track.title} - ${track.artist}`}
                className="object-cover w-full h-full rounded-lg"
              />
              {/* Кнопка воспроизведения внутри элемента карусели */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30 rounded-lg">
                <Button
                  onClick={() => handleCarouselPlay(track.id)}
                  className="size-16 rounded-full bg-white/80 backdrop-blur-sm text-blue-600 hover:bg-white hover:text-blue-700"
                  size="icon">
                  {currentTrackIndex ===
                    tracks.findIndex((t) => t.id === track.id) && isPlaying ? (
                    <Pause size={32} />
                  ) : (
                    <Play size={32} />
                  )}
                </Button>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className="carousel__previous" />
      <CarouselNext className="carousel__next" />
    </Carousel>
  )
}
