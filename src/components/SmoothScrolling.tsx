'use client'

import { ReactLenis } from 'lenis/react'

export default function SmoothScrolling({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <ReactLenis root>{children}</ReactLenis>
    </>
  )
}
