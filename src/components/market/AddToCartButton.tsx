'use client';

import { useCart, CartItem } from '@/contexts/CartContext';
import { ShoppingCart, Check } from 'lucide-react';
import { useState } from 'react';

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
    <button 
      onClick={handleAddToCart}
      disabled={isAdded}
      className={`inline-flex items-center px-6 py-3 font-medium rounded-lg transition-colors ${
        isAdded 
          ? 'bg-green-500 text-white hover:bg-green-600' 
          : 'bg-primary text-black hover:bg-primary/90'
      }`}
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
    </button>
  );
} 