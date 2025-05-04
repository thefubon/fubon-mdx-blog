import Container from '@/components/ui/Container'
import Heading from '@/components/ui/Heading'
import PageWrapper from '@/components/PageWrapper'
import AudioPlayer from '@/components/music/AudioPlayer'
import { AudioPlayerCarousel } from '@/components/music/AudioPlayerCarousel'

export default function MusicPage() {
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

          <AudioPlayer />
        </Container>
      </div>
    </PageWrapper>
  )
}
