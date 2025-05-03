import PageWrapper from '@/components/PageWrapper'
import AudioPlayer from '@/components/music/AudioPlayer'
import { AudioPlayerCarousel } from '@/components/music/AudioPlayerCarousel'

export default function MusicPage() {
  return (
    <PageWrapper>
      <AudioPlayerCarousel />
      
      <div className="container-fluid">
        <AudioPlayer />
      </div>
    </PageWrapper>
  )
}
