import type { Metadata } from 'next'
import MusicContent from '@/components/audio/MusicContent'

export const metadata: Metadata = {
  title: 'Музыка',
  description: 'Коллекция моих музыкальных проектов и треков.',
  alternates: {
    canonical: '/music',
  },
  openGraph: {
    url: '/music',
    title: 'Музыка - Fubon',
    description: 'Оригинальные музыкальные композиции и плейлисты для творческого вдохновения',
  },
}

export default function MusicPage() {
  return <MusicContent />
}