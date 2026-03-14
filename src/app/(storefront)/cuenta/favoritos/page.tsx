import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { PromoBar } from '@/components/storefront/PromoBar';
import { Breadcrumbs } from '@/components/storefront/Breadcrumbs';
import { ProductGrid } from '@/components/storefront/ProductGrid';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mis Favoritos',
  description: 'Tus productos guardados',
};

export default async function FavoritosPage() {
  // En producción, obtener favoritos del usuario logueado
  const products = await prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: {
      images: { where: { isMain: true }, take: 1 },
    },
    take: 8,
  });

  const transformedProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    shortDescription: p.shortDescription,
    sku: p.sku,
    price: p.price.toNumber(),
    compareAtPrice: p.compareAtPrice?.toNumber() || null,
    productType: p.productType as 'PHYSICAL' | 'DIGITAL',
    isActive: p.isActive,
    isFeatured: p.isFeatured,
    stock: p.stock,
    averageRating: p.averageRating.toNumber(),
    reviewCount: p.reviewCount,
    salesCount: p.salesCount,
    mainImage: p.images[0]?.url || null,
    categories: [],
    tags: p.tags,
    createdAt: p.createdAt,
  }));

  return (
    <>
      <PromoBar enabled={false} />
      <Header logo="" categories={[]} />

      <main className="py-8 min-h-[60vh]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Inicio', href: '/' },
              { label: 'Mi Cuenta', href: '/cuenta' },
              { label: 'Favoritos' },
            ]}
          />

          <div className="mt-8">
            <h1 className="text-3xl font-bold mb-8">Mis Favoritos</h1>

            {products.length === 0 ? (
              <div className="text-center py-16">
                <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg text-muted-foreground mb-4">
                  No tenés productos guardados en favoritos.
                </p>
                <Button asChild>
                  <Link href="/productos">Explorar productos</Link>
                </Button>
              </div>
            ) : (
              <ProductGrid products={transformedProducts} columns={4} />
            )}
          </div>
        </div>
      </main>

      <Footer categories={[]} socialLinks={{}} contactInfo={{}} />
    </>
  );
}

export default FavoritosPage;
