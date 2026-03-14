import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
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
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login?redirect=/cuenta/favoritos');
  }

  // Obtener wishlist real del usuario
  const wishlistItems = await prisma.wishlistItem.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        include: {
          images: { where: { isMain: true }, take: 1 },
        },
      },
    },
  });

  const products = wishlistItems.map((item) => ({
    id: item.product.id,
    name: item.product.name,
    slug: item.product.slug,
    shortDescription: item.product.shortDescription,
    sku: item.product.sku,
    price: item.product.price.toNumber(),
    compareAtPrice: item.product.compareAtPrice?.toNumber() || null,
    productType: item.product.productType as 'PHYSICAL' | 'DIGITAL',
    isActive: item.product.isActive,
    isFeatured: item.product.isFeatured,
    stock: item.product.stock,
    averageRating: item.product.averageRating.toNumber(),
    reviewCount: item.product.reviewCount,
    salesCount: item.product.salesCount,
    mainImage: item.product.images[0]?.url || null,
    categories: [],
    tags: item.product.tags,
    createdAt: item.product.createdAt,
  }));

  // Obtener config
  const storeConfig = await prisma.storeConfig.findMany();
  const config = Object.fromEntries(storeConfig.map((c) => [c.key, c.value]));

  return (
    <>
      <PromoBar
        text={(config.promoBarText as string) || '¡Envío gratis en compras mayores a $50.000!'}
        enabled={(config.promoBarEnabled as boolean) || true}
      />

      <Header
        logo={config.logo as string}
        categories={[]}
      />

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
              <ProductGrid products={products} columns={4} />
            )}
          </div>
        </div>
      </main>

      <Footer
        categories={[]}
        socialLinks={{
          instagram: config.instagramUrl as string,
          facebook: config.facebookUrl as string,
          tiktok: config.tiktokUrl as string,
        }}
        contactInfo={{
          email: config.contactEmail as string,
          phone: config.contactPhone as string,
          address: config.storeAddress as string,
        }}
      />
    </>
  );
}
