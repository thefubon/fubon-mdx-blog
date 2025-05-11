'use client'

import Container from '@/components/ui/Container'
import Heading from '@/components/ui/Heading'
import PageWrapper from '@/components/PageWrapper'
import MusicPlayer from '@/components/music-player'

export default function MusicContent() {
  return (
    <PageWrapper>
      <div className="container-space">
        <Container
          padding={true}
          space={true}>
          <Heading
            title="PsySystem Records"
            description="Российский лейбл звукозаписи, в основном выпускающий музыку в стиле пси-транс. Был основан в 2006 году, и является личным лейблом, где выпускаются только понравившиеся музыка, в основном это свои синглы и работы сторонних исполнителей, в большинстве своем в жанре «пси-транс»."
          />

          <MusicPlayer />
        </Container>
      </div>
    </PageWrapper>
  )
} 