import PageWrapper from '@/components/PageWrapper'
import Container from '@/components/ui/Container'
import { Velustro } from 'uvcanvas'

export default function WorkPage() {
  return (
    <PageWrapper
      title="Работа"
      description="Описание страницы или какой-то вводный текст.">
      <div className="w-full min-h-screen">
        <Container
          padding
          space
          className="relative">
          <div className="px-[var(--padding-x)] absolute top-4 left-0 z-10 text-background">
            <h2 >Работы</h2>
          </div>
        </Container>

        <div className="!w-full !min-h-screen">
          <Velustro className="!w-full !min-h-screen relative" />
        </div>
      </div>
    </PageWrapper>
  )
}
