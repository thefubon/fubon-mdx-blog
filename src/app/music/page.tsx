import Heading from '@/components/Heading'
import PageWrapper from '@/components/PageWrapper'
import AudioPlayer from '@/components/music/AudioPlayer'
import { AudioPlayerCarousel } from '@/components/music/AudioPlayerCarousel'

export default function MusicPage() {
  return (
    <PageWrapper>
      <div className="container-space">
        <AudioPlayerCarousel />

        <div className="container-fluid container-space">
          <Heading
            title="PsySystem Records"
            description="Российский лейбл звукозаписи, в основном выпускающий музыку в стиле пси-транс. Был основан в 2006 году, и является личным лейблом, где выпускаются только понравившиеся музыка, в основном это свои синглы и работы сторонних исполнителей, в большинстве своем в жанре «пси-транс»."
          />

          <AudioPlayer />
        </div>
      </div>
    </PageWrapper>
  )
}
