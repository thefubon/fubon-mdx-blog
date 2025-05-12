'use client';

import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CartButton() {
  const { 
    items, 
    itemCount, 
    totalQuantity,
    removeItem, 
    updateItemQuantity,
    clearCart,
    subtotal,
    total,
    discount,
    activePromoCode
  } = useCart();
  
  const [isMounted, setIsMounted] = useState(false);
  
  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return (
      <Button variant="secondary" size="icon" className="relative rounded-full hover:bg-primary hover:text-white size-12 md:size-[var(--button-height)]">
        <ShoppingCart className="!h-6 !w-6" />
      </Button>
    )
  }
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary" size="icon" className="relative rounded-full hover:bg-primary hover:text-white size-12 md:size-[var(--button-height)]">
          <ShoppingCart className="!h-6 !w-6" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {totalQuantity}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Корзина</SheetTitle>
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-6 p-4">
          {items.length > 0 ? (
            <>
              <div className="flex flex-col gap-4">
                {items.map((item) => (
                  <div
                    key={item.slug}
                    className="flex items-center gap-4 border-b pb-4">
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
                      <h3 className="font-medium text-base">{item.title}</h3>
                      <div className="flex gap-2 items-center mt-1">
                        {item.price !== "" && item.maxQuantity !== undefined && (
                          <>
                            <button 
                              onClick={() => updateItemQuantity(item.slug, Math.max(1, item.quantity - 1))}
                              className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded text-gray-700">
                              -
                            </button>
                            <span className="text-sm font-medium">{item.quantity}</span>
                            <button 
                              onClick={() => updateItemQuantity(item.slug, item.quantity + 1)}
                              disabled={item.maxQuantity !== undefined && item.quantity >= item.maxQuantity}
                              className={`w-6 h-6 flex items-center justify-center rounded text-gray-700 ${
                                item.maxQuantity !== undefined && item.quantity >= item.maxQuantity 
                                  ? 'bg-gray-200 cursor-not-allowed'
                                  : 'bg-gray-100'
                              }`}>
                              +
                            </button>
                          </>
                        )}
                        <p className="text-primary font-bold ml-auto">
                          {typeof item.price === 'string' ? item.price : formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.slug)}
                      className="text-gray-500 hover:text-red-500 hover:bg-red-50">
                      Удалить
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Подытог:</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                
                {discount > 0 && activePromoCode && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Скидка ({activePromoCode}):</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t">
                  <span>Итого:</span>
                  <span>{formatPrice(total)}</span>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => clearCart()}>
                    Очистить
                  </Button>
                  <SheetClose asChild>
                    <Link href="/market/checkout" className="flex-1">
                      <Button className="w-full">
                        Оформить заказ
                      </Button>
                    </Link>
                  </SheetClose>
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
  )
} 