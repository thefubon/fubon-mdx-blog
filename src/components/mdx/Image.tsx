// src/components/mdx/Image.tsx
'use client'

import React, { useState } from 'react'
import NextImage from 'next/image'

interface ImageProps {
  src: string
  alt: string
  caption?: string
  width?: number
  height?: number
}

export default function Image({
  src,
  alt,
  caption,
  width = 800,
  height = 500,
}: ImageProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="my-6">
      <div
        className="relative overflow-hidden rounded-lg cursor-pointer"
        onClick={() => setIsOpen(true)}>
        <NextImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-auto transition-transform hover:scale-[1.02]"
          priority
        />
      </div>

      {caption && (
        <p className="text-sm text-center text-gray-500 mt-2 italic">
          {caption}
        </p>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={() => setIsOpen(false)}>
          <div className="max-w-[90vw] max-h-[90vh]">
            <NextImage
              src={src}
              alt={alt}
              width={1920}
              height={1080}
              className="max-w-full max-h-[90vh] h-auto"
            />
          </div>
        </div>
      )}
    </div>
  )
}
