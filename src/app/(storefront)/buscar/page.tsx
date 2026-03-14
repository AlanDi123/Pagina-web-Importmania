import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { PromoBar } from '@/components/storefront/PromoBar';
import { ProductGrid } from '@/components/storefront/ProductGrid';
import { Breadcrumbs } from '@/components/storefront/Breadcrumbs';

interface BuscarPageProps {
  searchParams: { q?: string; page?: string };
}

export const metadata: Metadata = {
  title: 'Búsqueda',
  description: 'Resultados de búsqueda',
};

export default async function BuscarPage({ searchParams }: BuscarPageProps) {
  const q = searchParams.q || '';
  const page = parseInt(searchParams.page || '1');
  const limit = 12;

  const where = q
    ? {
        isActive: true,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { shortDescription: { contains: q, mode: 'insensitive' } },
          { tags: { has: q } },
        ],
      }
    : { isActive: true };

  const products = await prisma.product.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    include: {
      images: { where: { isMain: true }, take: 1 },
    },
    orderBy: { salesCount: 'desc' },
  });

  const total = await prisma.product.count({ where });

  const storeConfig = await prisma.storeConfig.findMany();

  const config = Object.fromEntries(storeConfig.map((c) => [c.key, c.value]));

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
      <PromoBar
        text={(config.promoBarText as string) || '¡Envío gratis en compras mayores a $50.000!'}
        enabled={(config.promoBarEnabled as boolean) || true}
      />

      <Header logo={config.logo as string} categories={[]} />

      <main className="py-8">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Inicio', href: '/' },
              { label: `Búsqueda: ${q}` },
            ]}
          />

          <div className="mt-8">
            <h1 className="text-3xl font-bold mb-2">
              Resultados para "{q}"
            </h1>
            <p className="text-muted-foreground mb-8">
              {total} productos encontrados
            </p>

            {total === 0 ? (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground mb-4">
                  No encontramos productos que coincidan con tu búsqueda.
                </p>
                <p className="text-sm text-muted-foreground">
                  Intentá con otros términos o explorá nuestras categorías.
                </p>
              </div>
            ) : (
              <ProductGrid products={transformedProducts} />
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
