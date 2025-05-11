'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  slug: string;
  title: string;
  price: number | string;
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (slug: string) => void;
  clearCart: () => void;
  isInCart: (slug: string) => boolean;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [itemCount, setItemCount] = useState(0);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('market_cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
        setItemCount(parsedCart.length);
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('market_cart', JSON.stringify(items));
    } else {
      localStorage.removeItem('market_cart');
    }
    setItemCount(items.length);
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems(prevItems => {
      // Check if item already exists in cart
      if (prevItems.some(i => i.slug === item.slug)) {
        return prevItems;
      }
      return [...prevItems, item];
    });
  };

  const removeItem = (slug: string) => {
    setItems(prevItems => prevItems.filter(item => item.slug !== slug));
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('market_cart');
  };

  const isInCart = (slug: string) => {
    return items.some(item => item.slug === slug);
  };

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, isInCart, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 