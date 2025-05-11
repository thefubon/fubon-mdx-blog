import type { Metadata, Viewport } from 'next'
import '@/styles/globals.css'

import { ThemeProvider } from '@/contexts/ThemeProvider'
import { SoundProvider } from '@/contexts/SoundProvider'
import { MusicPlayerProvider } from '@/contexts/MusicPlayerProvider'
import { AmbientSoundProvider } from '@/contexts/AmbientSoundProvider'
import { CartProvider } from '@/contexts/CartContext'
import AuthProvider from '@/components/auth/AuthProvider'

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ],
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://fubon.ru'),
  title: {
    default: 'Fubon | Креативное агентство по дизайну и разработке',
    template: '%s | Fubon'
  },
  description: 'Используя методы Data Science и лучшие практики UX-дизайна и проектирования продуктов, мы достигаем измеримых бизнес-результатов и создаем решения, которые отвечают потребностям пользователей и целям компании.',
  authors: [{ name: 'Anthony Fubon', url: 'https://fubon.ru' }],
  creator: 'Anthony Fubon',
  publisher: 'Fubon Creative Agency',
  keywords: ['дизайн', 'разработка', 'веб-дизайн', 'ui/ux', 'креативное агентство', 'fubon'],
  alternates: {
    types: {
      'application/rss+xml': [
        {
          url: '/rss.xml',
          title: 'Fubon | Креативное агентство по дизайну и разработке',
        },
      ],
    },
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: '/',
    siteName: 'Fubon',
    title: 'Fubon | Креативное агентство по дизайну и разработке',
    description: 'Используем методы Data Science и лучшие практики UX-дизайна для создания решений, которые отвечают потребностям пользователей и целям компании.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Fubon Creative Agency',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fubon | Креативное агентство по дизайну и разработке',
    description: 'Используем методы Data Science и лучшие практики UX-дизайна для создания решений, которые отвечают потребностям пользователей и целям компании.',
    creator: '@fubon',
    images: ['/images/og-image.jpg'],
  },
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ru"
      suppressHydrationWarning>
      <body>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
            <CartProvider>
              <MusicPlayerProvider>
                <AmbientSoundProvider>
                  <SoundProvider>
                    {children}
                  </SoundProvider>
                </AmbientSoundProvider>
              </MusicPlayerProvider>
            </CartProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
} 