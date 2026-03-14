'use client';

import { ProductCard } from '@/components/storefront/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import type { ProductListItem } from '@/types/product';

interface ProductGridProps {
  products: ProductListItem[];
  loading?: boolean;
  emptyMessage?: string;
  columns?: 2 | 3 | 4;
}

export function ProductGrid({
  products,
  loading = false,
  emptyMessage = 'No se encontraron productos',
  columns = 4,
}: ProductGridProps) {
  // Skeleton cards para loading state
  const skeletonCards = Array.from({ length: 8 }, (_, i) => (
    <div key={i} className="space-y-3">
      <Skeleton className="aspect-square w-full rounded-lg" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-6 w-1/3" />
    </div>
  ));

  // Grid columns responsive
  const gridClasses = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  };

  if (loading) {
    return (
      <div className={`grid gap-4 sm:gap-6 ${gridClasses[columns]}`}>
        {skeletonCards}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📦</div>
        <p className="text-lg text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`grid gap-4 sm:gap-6 ${gridClasses[columns]}`}>
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
}

export default ProductGrid;
