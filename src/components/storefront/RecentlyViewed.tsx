'use client';

import { useEffect } from 'react';
import { ProductCard } from '@/components/storefront/ProductCard';
import { useUI } from '@/hooks/useUI';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import type { ProductListItem } from '@/types/product';

interface RecentlyViewedProps {
  currentProductId?: string;
}

export function RecentlyViewed({ currentProductId }: RecentlyViewedProps) {
  const { recentlyViewed, getRecentlyViewedProducts } = useUI();

  useEffect(() => {
    getRecentlyViewedProducts();
  }, [getRecentlyViewedProducts]);

  if (!recentlyViewed || recentlyViewed.length === 0) {
    return null;
  }

  // Excluir producto actual si se está viendo uno
  const filteredProducts = currentProductId
    ? recentlyViewed.filter((p) => p.id !== currentProductId)
    : recentlyViewed;

  if (filteredProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold mb-6">Vistos recientemente</h2>
        <ScrollArea className="w-full">
          <div className="flex gap-4 pb-4">
            {filteredProducts.slice(0, 8).map((product) => (
              <div key={product.id} className="flex-shrink-0 w-[200px] sm:w-[250px]">
                <ProductCard {...product} />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </section>
  );
}

export default RecentlyViewed;
