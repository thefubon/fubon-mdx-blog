'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  // If no images are provided, return null
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="mb-10 space-y-4">
      {/* Main large image */}
      <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
        <Image
          src={images[selectedImage]}
          alt={`${title} - изображение ${selectedImage + 1}`}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          priority
        />
      </div>

      {/* Thumbnail navigation */}
      {images.length > 1 && (
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {images.map((image, index) => (
            <Button
              key={index}
              variant="outline"
              size="icon"
              onClick={() => setSelectedImage(index)}
              className={cn(
                "relative w-16 h-16 p-0 overflow-hidden",
                selectedImage === index && "ring-2 ring-primary"
              )}
              aria-label={`Показать изображение ${index + 1}`}
            >
              <Image
                src={image}
                alt={`${title} - миниатюра ${index + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </Button>
          ))}
        </div>
      )}
    </div>
  );
} 