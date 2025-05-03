import PageWrapper from '@/components/PageWrapper'
import AudioPlayer from '@/components/AudioPlayer'

export default function MusicPage() {
  return (
    <PageWrapper
      title="Музыка"
      description="Описание страницы или какой-то вводный текст.">
      <div className="container-fluid border border-black">
        <AudioPlayer />
      </div>
    </PageWrapper>
  )
}
