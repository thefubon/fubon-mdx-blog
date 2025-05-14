'use client'

import React from 'react'
import Container from '@/components/ui/Container'
import PageWrapper from '@/components/PageWrapper'
import MusicPlayer from '@/components/audio/music-player'

export default function MusicContent() {
  return (
    <PageWrapper>
      <Container>
        <div className="py-10">
          <h1 className="mb-8 text-3xl md:text-4xl font-bold">
            Музыка
          </h1>
          
          <p className="text-muted-foreground mb-8">
            Коллекция моих музыкальных проектов и треков.
          </p>
          
          <MusicPlayer />
        </div>
      </Container>
    </PageWrapper>
  )
} 