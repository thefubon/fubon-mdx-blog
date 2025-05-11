'use client';

import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CartButton() {
  const { items, itemCount, removeItem, clearCart } = useCart();
  const [isMounted, setIsMounted] = useState(false);
  
  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return (
      <button className="relative size-[var(--button-height)] flex justify-center items-center rounded-full bg-secondary hover:bg-primary hover:text-white transition-colors">
        <ShoppingCart className="h-5 w-5" />
      </button>
    )
  }
  
  const totalPrice = items.reduce((sum, item) => {
    const itemPrice = typeof item.price === 'number' 
      ? item.price 
      : parseFloat(item.price.replace(/[^\d.]/g, '')) || 0;
    return sum + itemPrice;
  }, 0);
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="relative size-[var(--button-height)] flex justify-center items-center rounded-full bg-secondary hover:bg-primary hover:text-white transition-colors">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Корзина</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 flex flex-col gap-6">
          {items.length > 0 ? (
            <>
              <div className="flex flex-col gap-4">
                {items.map((item) => (
                  <div key={item.slug} className="flex items-center gap-4 border-b pb-4">
                    {item.image && (
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                        <Image 
                          src={item.image} 
                          alt={item.title} 
                          fill 
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-grow">
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-primary font-bold">{item.price}</p>
                    </div>
                    <button 
                      onClick={() => removeItem(item.slug)}
                      className="text-gray-500 hover:text-red-500 transition-colors"
                    >
                      Удалить
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col gap-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Итого:</span>
                  <span>{totalPrice} ₽</span>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => clearCart()}
                  >
                    Очистить
                  </Button>
                  <Button className="flex-1 bg-primary text-black hover:bg-primary/90">
                    Оформить заказ
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500 mb-4">Ваша корзина пуста</p>
              <SheetClose asChild>
                <Link href="/market">
                  <Button>Перейти в каталог</Button>
                </Link>
              </SheetClose>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
} 