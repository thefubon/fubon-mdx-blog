import Heading from '@/components/Heading'
import PageWrapper from '@/components/PageWrapper'
import AudioPlayer from '@/components/music/AudioPlayer'
import { AudioPlayerCarousel } from '@/components/music/AudioPlayerCarousel'

export default function MusicPage() {
  return (
    <PageWrapper>
      <div className="space-y-8">
        <AudioPlayerCarousel />

        <div className="container-fluid space-y-8">
          <Heading
            title="Моя музыка"
            description="Опиание"
          />

          <AudioPlayer />
        </div>
      </div>
    </PageWrapper>
  )
}
