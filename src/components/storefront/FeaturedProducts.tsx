'use client';

import { useEffect, useState } from 'react';
import { ProductGrid } from '@/components/storefront/ProductGrid';
import type { ProductListItem } from '@/types/product';

interface FeaturedProductsProps {
  title?: string;
  limit?: number;
}

export function FeaturedProducts({
  title = 'Productos Destacados',
  limit = 8,
}: FeaturedProductsProps) {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch(`/api/productos?featured=true&limit=${limit}`);

        if (!response.ok) return;

        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error al obtener productos destacados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, [limit]);

  return (
    <section className="py-8">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <ProductGrid products={products} loading={isLoading} columns={4} />
      </div>
    </section>
  );
}

export default FeaturedProducts;
