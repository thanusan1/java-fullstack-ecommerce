'use client';

import React, {
  createContext, useContext, useState, useEffect, useCallback,
} from 'react';
import { cartApi } from '@/lib/api';
import { Cart } from '@/types';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface CartContextValue {
  cart: Cart | null;
  isLoading: boolean;
  totalItems: number;
  fetchCart: () => Promise<void>;
  addItem: (productId: number, quantity?: number) => Promise<void>;
  updateItem: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart]         = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) { setCart(null); return; }
    try {
      setIsLoading(true);
      const res = await cartApi.get();
      setCart(res.data.data);
    } catch {
      // silently fail on cart fetch
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addItem = useCallback(async (productId: number, quantity = 1) => {
    try {
      const res = await cartApi.addItem(productId, quantity);
      setCart(res.data.data);
      toast.success('Added to cart');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to add item';
      toast.error(msg);
      throw err;
    }
  }, []);

  const updateItem = useCallback(async (itemId: number, quantity: number) => {
    try {
      const res = await cartApi.updateItem(itemId, quantity);
      setCart(res.data.data);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update cart');
      throw err;
    }
  }, []);

  const removeItem = useCallback(async (itemId: number) => {
    try {
      const res = await cartApi.removeItem(itemId);
      setCart(res.data.data);
      toast.success('Item removed');
    } catch {
      toast.error('Failed to remove item');
    }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      await cartApi.clear();
      setCart(null);
    } catch {
      toast.error('Failed to clear cart');
    }
  }, []);

  return (
    <CartContext.Provider value={{
      cart,
      isLoading,
      totalItems: cart?.totalItems ?? 0,
      fetchCart,
      addItem,
      updateItem,
      removeItem,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
