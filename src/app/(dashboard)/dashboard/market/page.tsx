'use client';

import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import { Download, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useState } from 'react';

// Mock purchased items for demonstration
const purchasedItems = [
  {
    id: '1',
    title: 'UI Kit Dashboard',
    description: 'Полный набор компонентов для админ-панели',
    purchaseDate: '2023-12-15',
    price: '2500 ₽',
    images: [
      '/images/icon-192x192.png',
      '/images/icon-192x192-dark.png',
      '/images/icon-256x256.png'
    ],
    downloadUrl: '#'
  },
  {
    id: '2',
    title: 'React Hooks Library',
    description: 'Коллекция кастомных React хуков',
    purchaseDate: '2023-11-03',
    price: '1800 ₽',
    images: [
      '/images/icon-192x192-dark.png',
      '/images/icon-192x192.png',
      '/images/icon-256x256.png'
    ],
    downloadUrl: '#'
  }
];

// Image Gallery component
function ImageGallery({ images }: { images: string[] }) {
  const [selectedImage, setSelectedImage] = useState(0);
  
  return (
    <div className="space-y-2">
      {/* Large main image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md">
        <Image 
          src={images[selectedImage]} 
          alt="Product image" 
          fill 
          className="object-cover"
        />
      </div>
      
      {/* Thumbnails */}
      <div className="flex gap-2">
        {images.map((image, index) => (
          <Button
            key={index}
            onClick={() => setSelectedImage(index)}
            variant="outline"
            size="icon"
            className={`relative h-16 w-16 p-0 overflow-hidden ${
              selectedImage === index 
                ? 'ring-2 ring-primary ring-offset-2' 
                : ''
            }`}
          >
            <Image 
              src={image} 
              alt={`Thumbnail ${index + 1}`} 
              fill 
              className="object-cover"
            />
          </Button>
        ))}
      </div>
    </div>
  );
}

export default function DashboardMarketPage() {
  const { items } = useCart();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Мои покупки</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {purchasedItems.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex-1">
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Image Gallery */}
              <ImageGallery images={item.images} />
              
              <div className="grid gap-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Дата покупки:</span>
                  <span>{new Date(item.purchaseDate).toLocaleDateString('ru-RU')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Цена:</span>
                  <span className="font-medium text-primary">{item.price}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <a href={item.downloadUrl} download>
                  <Download className="mr-2 h-4 w-4" />
                  Скачать
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {items.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">Товары в корзине</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {items.map((item) => (
              <Card key={item.slug}>
                <CardHeader className="flex flex-row items-start gap-4">
                  {item.image && (
                    <div className="relative h-16 w-16 overflow-hidden rounded-md">
                      <Image 
                        src={item.image} 
                        alt={item.title} 
                        fill 
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>В корзине</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Цена:</span>
                    <span className="font-medium text-primary">{item.price}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Оформить заказ
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {purchasedItems.length === 0 && items.length === 0 && (
        <div className="text-center py-10">
          <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold">У вас пока нет покупок</h2>
          <p className="mt-2 text-muted-foreground">
            Посетите наш маркет, чтобы найти интересные товары
          </p>
          <Button className="mt-4" asChild>
            <Link href="/market">Перейти в маркет</Link>
          </Button>
        </div>
      )}
    </div>
  );
} 