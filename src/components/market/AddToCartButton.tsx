'use client';

import { useCart, CartItem } from '@/contexts/CartContext';
import { ShoppingCart, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface AddToCartButtonProps {
  item: CartItem;
}

export default function AddToCartButton({ item }: AddToCartButtonProps) {
  const { addItem, isInCart } = useCart();
  const [isAdded, setIsAdded] = useState(isInCart(item.slug));
  
  const handleAddToCart = () => {
    if (!isAdded) {
      addItem(item);
      setIsAdded(true);
    }
  };
  
  return (
    <Button 
      onClick={handleAddToCart}
      disabled={isAdded}
      variant={isAdded ? "secondary" : "default"}
      className={isAdded ? 'bg-green-500 text-white hover:bg-green-600' : ''}
    >
      {isAdded ? (
        <>
          <Check size={18} className="mr-2" />
          В корзине
        </>
      ) : (
        <>
          <ShoppingCart size={18} className="mr-2" />
          Купить
        </>
      )}
    </Button>
  );
} 