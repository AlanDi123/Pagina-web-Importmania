'use client';

import { useEffect, useState } from 'react';
import { ProductGrid } from '@/components/storefront/ProductGrid';
import type { ProductListItem } from '@/types/product';

interface RelatedProductsProps {
  categoryIds: string[];
  currentProductId: string;
}

export function RelatedProducts({ categoryIds, currentProductId }: RelatedProductsProps) {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!categoryIds || categoryIds.length === 0) return;

    const fetchRelatedProducts = async () => {
      try {
        const response = await fetch(
          `/api/productos?category=${categoryIds[0]}&limit=4&exclude=${currentProductId}`
        );

        if (!response.ok) return;

        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error al obtener productos relacionados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [categoryIds, currentProductId]);

  if (!categoryIds || categoryIds.length === 0) {
    return null;
  }

  if (isLoading) {
    return (
      <section className="py-8">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">Productos relacionados</h2>
          <ProductGrid products={[]} loading />
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-8 bg-muted/50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold mb-6">Productos relacionados</h2>
        <ProductGrid products={products} columns={4} />
      </div>
    </section>
  );
}

export default RelatedProducts;
