'use client';

import { ProductCard } from '@/components/storefront/ProductCard';
import { useUIStore } from '@/stores/uiStore';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import type { ProductListItem } from '@/types/product';

interface RecentlyViewedProps {
  currentProductId?: string;
}

export function RecentlyViewed({ currentProductId }: RecentlyViewedProps) {
  const recentlyViewed = useUIStore((state) => state.recentlyViewed);

  if (!recentlyViewed || recentlyViewed.length === 0) {
    return null;
  }

  // Transformar items del store al formato que espera ProductCard
  const transformedProducts: ProductListItem[] = recentlyViewed.map((item) => ({
    id: item.productId,
    name: item.name,
    slug: item.slug,
    price: item.price,
    mainImage: item.mainImage,
    compareAtPrice: null,
    productType: 'PHYSICAL' as const,
    isActive: true,
    isFeatured: false,
    stock: 1,
    averageRating: 0,
    reviewCount: 0,
    salesCount: 0,
    categories: [],
    tags: [],
    sku: '',
    shortDescription: null,
    createdAt: new Date(item.viewedAt),
  }));

  // Excluir producto actual si se está viendo uno
  const filteredProducts = currentProductId
    ? transformedProducts.filter((p) => p.id !== currentProductId)
    : transformedProducts;

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
