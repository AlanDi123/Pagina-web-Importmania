'use client';

import { useCallback } from 'react';
import { useCartStore } from '@/stores/cartStore';
import type { CartItemDisplay } from '@/types/cart';

/**
 * Hook simplificado para usar el carrito
 * Este hook envuelve el store de Zustand con una interfaz más simple
 */
export function useCart() {
  // Selectores del store
  const items = useCartStore((state) => state.items);
  const coupon = useCartStore((state) => state.coupon);
  const isOpen = useCartStore((state) => state.isOpen);
  const isLoading = useCartStore((state) => state.isLoading);
  const error = useCartStore((state) => state.error);
  
  // Acciones del store
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const incrementQuantity = useCartStore((state) => state.incrementQuantity);
  const decrementQuantity = useCartStore((state) => state.decrementQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const openCart = useCartStore((state) => state.openCart);
  const closeCart = useCartStore((state) => state.closeCart);
  const applyCoupon = useCartStore((state) => state.applyCoupon);
  const removeCoupon = useCartStore((state) => state.removeCoupon);
  const getCart = useCartStore((state) => state.getCart());
  const getCartSummary = useCartStore((state) => state.getCartSummary());
  const getItemQuantity = useCartStore((state) => state.getItemQuantity);
  const isInCart = useCartStore((state) => state.isInCart);

  // Calculados
  const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const isEmpty = items.length === 0;

  /**
   * Agregar producto al carrito con datos completos
   */
  const addProduct = useCallback((product: {
    id: string;
    name: string;
    slug: string;
    sku: string;
    price: number;
    compareAtPrice: number | null;
    stock: number;
    mainImage: string | null;
    variantId?: string;
    variantName?: string | null;
    variantOptions?: Record<string, string> | null;
    isDigital?: boolean;
    quantity?: number;
  }) => {
    const quantity = product.quantity || 1;
    
    // Crear item display
    const item: CartItemDisplay = {
      id: `${product.id}-${product.variantId || 'default'}-${Date.now()}`,
      productId: product.id,
      variantId: product.variantId || null,
      quantity,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      stock: product.stock,
      mainImage: product.mainImage,
      variantName: product.variantName || null,
      variantOptions: product.variantOptions || null,
      subtotal: product.price * quantity,
      discountPercentage: product.compareAtPrice
        ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
        : null,
      isAvailable: product.stock >= quantity,
      isDigital: product.isDigital || false,
    };

    // Actualizar el store directamente con los datos completos
    useCartStore.setState((state) => {
      // Verificar si ya existe
      const existingIndex = state.items.findIndex(
        (i) => i.productId === product.id && i.variantId === product.variantId
      );

      let newItems: CartItemDisplay[];

      if (existingIndex >= 0) {
        // Actualizar existente
        newItems = state.items.map((i, index) => {
          if (index === existingIndex) {
            const newQuantity = Math.min(i.quantity + quantity, 999);
            return {
              ...i,
              quantity: newQuantity,
              subtotal: newQuantity * i.price,
            };
          }
          return i;
        });
      } else {
        // Agregar nuevo
        newItems = [...state.items, item];
      }

      return { items: newItems };
    });

    // Abrir drawer
    useCartStore.getState().openCart();
  }, []);

  /**
   * Actualizar producto con datos frescos del servidor
   */
  const updateProduct = useCallback((productId: string, data: Partial<CartItemDisplay>) => {
    useCartStore.setState((state) => ({
      items: state.items.map((item) =>
        item.productId === productId ? { ...item, ...data } : item
      ),
    }));
  }, []);

  return {
    // Estado
    items,
    itemsCount,
    coupon,
    isOpen,
    isLoading,
    error,
    isEmpty,
    subtotal,
    
    // Datos calculados
    cart: getCart,
    summary: getCartSummary,
    
    // Acciones básicas
    addItem: addProduct,
    addProduct,
    removeItem,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    
    // Acciones de UI
    toggleCart,
    openCart,
    closeCart,
    
    // Cupón
    applyCoupon,
    removeCoupon,
    
    // Helpers
    getItemQuantity,
    isInCart,
    updateProduct,
  };
}

export default useCart;
