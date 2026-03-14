import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { PromoBar } from '@/components/storefront/PromoBar';
import { HeroBanner } from '@/components/storefront/HeroBanner';
import { CategoryCarousel } from '@/components/storefront/CategoryCarousel';
import { ProductCard } from '@/components/storefront/ProductCard';
import { NewsletterForm } from '@/components/storefront/NewsletterForm';
import { CookieConsent } from '@/components/storefront/CookieConsent';
import { prisma } from '@/lib/prisma';
import { generateProductStructuredData } from '@/lib/seo';

interface HomePageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  // Obtener datos de la DB (en secuencia para no saturar conexiones)
  const categories = await prisma.category.findMany({
    where: { isActive: true, parentId: null },
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: { sortOrder: 'asc' },
    take: 8,
  });

  const featuredProducts = await prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: {
      images: {
        where: { isMain: true },
        take: 1,
      },
    },
    orderBy: { salesCount: 'desc' },
    take: 8,
  });

  const newProducts = await prisma.product.findMany({
    where: { isActive: true },
    include: {
      images: {
        where: { isMain: true },
        take: 1,
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 8,
  });

  const storeConfig = await prisma.storeConfig.findMany();

  // Transformar store config a objeto
  const config = Object.fromEntries(
    storeConfig.map((c) => [c.key, c.value])
  ) as Record<string, unknown>;

  // Transformar categorías
  const transformedCategories = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    image: cat.image,
    productCount: cat._count.products,
  }));

  // Transformar productos
  const transformProduct = (product: typeof featuredProducts[0]) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription,
    sku: product.sku,
    price: product.price.toNumber(),
    compareAtPrice: product.compareAtPrice?.toNumber() || null,
    productType: product.productType as 'PHYSICAL' | 'DIGITAL',
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    stock: product.stock,
    averageRating: product.averageRating.toNumber(),
    reviewCount: product.reviewCount,
    salesCount: product.salesCount,
    mainImage: product.images[0]?.url || null,
    createdAt: product.createdAt,
  });

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'iMPORTMANIA',
    url: process.env.NEXT_PUBLIC_APP_URL,
    logo: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
    description: 'Tu tienda online de productos importados en Argentina',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: 'Spanish',
    },
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData, null, 2) }}
      />

      {/* Promo Bar */}
      <PromoBar
        text={config.promoBarText as string || '¡Envío gratis en compras mayores a $50.000!'}
        enabled={config.promoBarEnabled as boolean || true}
      />

      {/* Header */}
      <Header
        logo={config.logo as string}
        categories={transformedCategories}
      />

      {/* Main content */}
      <main>
        {/* Hero Banner */}
        <HeroBanner />

        {/* Categorías */}
        <CategoryCarousel
          categories={transformedCategories}
          title="Categorías"
        />

        {/* Productos destacados */}
        <section className="py-8 sm:py-12 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
                Productos Destacados
              </h2>
              <a
                href="/productos?sort=bestselling"
                className="text-brand-primary hover:underline font-medium"
              >
                Ver todos →
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} {...transformProduct(product)} />
              ))}
            </div>
          </div>
        </section>

        {/* Banner promocional intermedio */}
        <section className="py-12">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative h-64 sm:h-80 rounded-lg overflow-hidden bg-gradient-to-r from-brand-primary to-brand-secondary flex items-center justify-center">
              <div className="text-center text-white space-y-4 px-4">
                <h2 className="text-3xl sm:text-4xl font-bold">
                  ¡Ofertas Especiales!
                </h2>
                <p className="text-lg sm:text-xl max-w-xl">
                  Descubrí nuestros productos con descuentos exclusivos por tiempo limitado.
                </p>
                <a
                  href="/productos?sort=price_asc"
                  className="inline-block bg-white text-brand-primary font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Ver ofertas
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Productos nuevos */}
        <section className="py-8 sm:py-12">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
                Productos Nuevos
              </h2>
              <a
                href="/productos?sort=newest"
                className="text-brand-primary hover:underline font-medium"
              >
                Ver todos →
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {newProducts.map((product) => (
                <ProductCard key={product.id} {...transformProduct(product)} />
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-12 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <NewsletterForm />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer
        categories={transformedCategories}
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

      {/* Cookie Consent */}
      <CookieConsent />
    </>
  );
}
