import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { PromoBar } from '@/components/storefront/PromoBar';
import { ProductGrid } from '@/components/storefront/ProductGrid';
import { Breadcrumbs } from '@/components/storefront/Breadcrumbs';
import { Badge } from '@/components/ui/badge';

interface CategoriaPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: CategoriaPageProps): Promise<Metadata> {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    select: {
      name: true,
      description: true,
      seoTitle: true,
      seoDescription: true,
    },
  });

  if (!category) return {};

  return {
    title: category.seoTitle || category.name,
    description: category.seoDescription || category.description,
  };
}

export default async function CategoriaPage({ params }: CategoriaPageProps) {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    include: {
      children: {
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      },
      products: {
        where: { isActive: true },
        include: {
          images: { where: { isMain: true }, take: 1 },
        },
        orderBy: { salesCount: 'desc' },
        take: 24,
      },
    },
  });

  if (!category || !category.isActive) {
    notFound();
  }

  // Transformar productos
  const products = category.products.map((p) => ({
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

      <main className="py-8">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[
              { label: 'Inicio', href: '/' },
              { label: 'Productos', href: '/productos' },
              { label: category.name },
            ]}
          />

          {/* Header de categoría */}
          <div className="mt-8 mb-8">
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-3xl font-bold">{category.name}</h1>
              <Badge variant="secondary">
                {category.products.length} productos
              </Badge>
            </div>
            {category.description && (
              <p className="text-muted-foreground max-w-3xl">
                {category.description}
              </p>
            )}
          </div>

          {/* Subcategorías */}
          {category.children.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Subcategorías</h2>
              <div className="flex flex-wrap gap-2">
                {category.children.map((child) => (
                  <Badge
                    key={child.id}
                    variant="outline"
                    className="text-sm px-4 py-2 cursor-pointer hover:bg-muted"
                    asChild
                  >
                    <a href={`/categorias/${child.slug}`}>{child.name}</a>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Productos */}
          <ProductGrid products={products} columns={4} />
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
