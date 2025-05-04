'use client'

import Container from '@/components/ui/Container'
import Heading from '@/components/ui/Heading'
import PageWrapper from '@/components/PageWrapper'
import AudioPlayer from '@/components/music/AudioPlayer'
import AudioPlayerPlaylist from '@/components/music/AudioPlayerPlaylist'
import { AudioPlayerCarousel } from '@/components/music/AudioPlayerCarousel'
import { tracks } from '@/data/player'
import { useAudioPlayer } from '@/contexts/AudioPlayerProvider'

export default function MusicPage() {
  const { currentTrackIndex } = useAudioPlayer()
  const currentTrack = tracks[currentTrackIndex] || tracks[0]

  return (
    <PageWrapper>
      <div className="container-space">
        <AudioPlayerCarousel />

        <Container
          padding={true}
          space={true}>
          <Heading
            title="PsySystem Records"
            description="Российский лейбл звукозаписи, в основном выпускающий музыку в стиле пси-транс. Был основан в 2006 году, и является личным лейблом, где выпускаются только понравившиеся музыка, в основном это свои синглы и работы сторонних исполнителей, в большинстве своем в жанре «пси-транс»."
          />

          <div className="flex flex-col md:flex-row gap-6 w-full">
            <AudioPlayer currentTrack={currentTrack} />
            <AudioPlayerPlaylist tracks={tracks} />
          </div>
        </Container>
      </div>
    </PageWrapper>
  )
}