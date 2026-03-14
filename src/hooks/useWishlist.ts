'use client';

import { useWishlistStore } from '@/stores/wishlistStore';

/**
 * Hook simplificado para usar la wishlist
 */
export function useWishlist() {
  // Selectores del store
  const items = useWishlistStore((state) => state.items);
  const isLoading = useWishlistStore((state) => state.isLoading);
  
  // Acciones del store
  const addItem = useWishlistStore((state) => state.addItem);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const toggleItem = useWishlistStore((state) => state.toggleItem);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);
  const getItemCount = useWishlistStore((state) => state.getItemCount);

  // Calculados
  const itemCount = getItemCount();
  const isEmpty = items.length === 0;

  /**
   * Agregar producto a la wishlist
   */
  const addProduct = (product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice: number | null;
    mainImage: string | null;
    stock: number;
    averageRating: number;
  }) => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      mainImage: product.mainImage,
      isAvailable: product.stock > 0,
      stock: product.stock,
      averageRating: product.averageRating,
    });
  };

  /**
   * Toggle producto en wishlist
   */
  const toggleProduct = (product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice: number | null;
    mainImage: string | null;
    stock: number;
    averageRating: number;
  }) => {
    toggleItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      mainImage: product.mainImage,
      isAvailable: product.stock > 0,
      stock: product.stock,
      averageRating: product.averageRating,
    });
  };

  return {
    // Estado
    items,
    isLoading,
    isEmpty,
    itemCount,
    
    // Acciones
    addItem: addProduct,
    addProduct,
    removeItem,
    toggleItem,
    toggleProduct,
    clearWishlist,
    
    // Helpers
    isInWishlist,
  };
}

export default useWishlist;
