import type { Metadata } from 'next'
import MusicContent from '@/components/MusicContent'

export const metadata: Metadata = {
  title: 'Музыка',
  description: 'Музыкальные эксперименты и коллекции от Fubon',
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