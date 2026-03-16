import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { APP_URL } from '@/lib/constants';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { PromoBar } from '@/components/storefront/PromoBar';
import { ProductGallery } from '@/components/storefront/ProductGallery';
import { VariantSelector } from '@/components/storefront/VariantSelector';
import { AddToCartButton } from '@/components/storefront/AddToCartButton';
import { WishlistButton } from '@/components/storefront/WishlistButton';
import { ShippingCalculator } from '@/components/storefront/ShippingCalculator';
import { ShareButtons } from '@/components/storefront/ShareButtons';
import { StarRating } from '@/components/storefront/StarRating';
import { ReviewCard } from '@/components/storefront/ReviewCard';
import { ReviewForm } from '@/components/storefront/ReviewForm';
import { RelatedProducts } from '@/components/storefront/RelatedProducts';
import { RecentlyViewed } from '@/components/storefront/RecentlyViewed';
import { Breadcrumbs } from '@/components/storefront/Breadcrumbs';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatARS } from '@/lib/formatters';
import { generateProductStructuredData } from '@/lib/seo';

interface ProductoPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ProductoPageProps): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    select: {
      name: true,
      shortDescription: true,
      images: { where: { isMain: true }, take: 1 },
    },
  });

  if (!product) return {};

  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      images: product.images[0]?.url ? [product.images[0].url] : [],
    },
  };
}

export default async function ProductoPage({ params }: ProductoPageProps) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      variants: { where: { isActive: true } },
      categories: { include: { category: true } },
      reviews: {
        where: { isApproved: true },
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  });

  if (!product || !product.isActive) {
    notFound();
  }

  // Incrementar view count
  await prisma.product.update({
    where: { id: product.id },
    data: { viewCount: { increment: 1 } },
  });

  // Transformar imágenes
  const images = product.images.map((img) => ({
    id: img.id,
    url: img.url,
    alt: img.alt,
    isMain: img.isMain,
  }));

  // Transformar variantes
  const variants = product.variants.map((v) => ({
    ...v,
    price: v.price?.toNumber() || null,
    options: v.options as Record<string, string>,
  }));

  // Transformar categorías
  const categories = product.categories.map((c) => ({
    id: c.category.id,
    name: c.category.name,
    slug: c.category.slug,
  }));

  // Transformar reseñas
  const reviews = product.reviews.map((r) => ({
    id: r.id,
    userId: r.userId,
    userName: r.user.name,
    userAvatar: null,
    rating: r.rating,
    title: r.title,
    comment: r.comment,
    isVerified: r.isVerified,
    isApproved: r.isApproved,
    createdAt: r.createdAt,
    helpful: 0,
    notHelpful: 0,
    productImages: [],
  }));

  // Calcular descuento
  const discountPercentage = product.compareAtPrice
    ? Math.round(
        ((product.compareAtPrice.toNumber() - product.price.toNumber()) /
          product.compareAtPrice.toNumber()) *
          100
      )
    : null;

  // Obtener config
  const storeConfig = await prisma.storeConfig.findMany();
  const config = Object.fromEntries(storeConfig.map((c) => [c.key, c.value]));

  // Structured data
  const structuredData = generateProductStructuredData({
    id: product.id,
    name: product.name,
    description: product.shortDescription || '',
    price: product.price.toNumber(),
    image: images[0]?.url || '',
    rating: product.averageRating.toNumber(),
    reviewCount: product.reviewCount,
    sku: product.sku,
    brand: 'iMPORTMANIA',
    url: `${APP_URL}/productos/${product.slug}`,
  });

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
              ...categories.map((c) => ({
                label: c.name,
                href: `/categorias/${c.slug}`,
              })),
              { label: product.name },
            ]}
          />

          {/* Producto */}
          <div className="grid lg:grid-cols-2 gap-8 mt-8">
            {/* Galería */}
            <ProductGallery images={images} />

            {/* Info */}
            <div className="space-y-6">
              {/* Título y precio */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {discountPercentage && (
                    <Badge variant="destructive">-{discountPercentage}%</Badge>
                  )}
                  {product.stock <= 0 && (
                    <Badge variant="secondary">Sin stock</Badge>
                  )}
                  {product.stock > 0 && product.stock <= product.lowStockThreshold && (
                    <Badge variant="outline">¡Últimas unidades!</Badge>
                  )}
                </div>
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <p className="text-muted-foreground mt-2">{product.shortDescription}</p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <StarRating rating={product.averageRating.toNumber()} size="md" />
                <span className="text-sm text-muted-foreground">
                  ({product.reviewCount} reseñas)
                </span>
              </div>

              {/* Precio */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-brand-primary">
                    {formatARS(product.price.toNumber())}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-xl text-muted-foreground line-through">
                      {formatARS(product.compareAtPrice.toNumber())}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  SKU: {product.sku}
                </p>
              </div>

              {/* Variantes */}
              {variants.length > 0 && (
                <VariantSelector
                  variants={variants}
                  basePrice={product.price.toNumber()}
                  onVariantChange={() => {}}
                />
              )}

              {/* Acciones */}
              <div className="space-y-4">
                <AddToCartButton
                  productId={product.id}
                  name={product.name}
                  slug={product.slug}
                  sku={product.sku}
                  price={product.price.toNumber()}
                  compareAtPrice={product.compareAtPrice?.toNumber() || null}
                  mainImage={product.images.find(img => img.isMain)?.url || null}
                  stock={product.stock}
                  size="lg"
                />
                <WishlistButton 
                  productId={product.id}
                  productName={product.name}
                  productSlug={product.slug}
                  productPrice={product.price.toNumber()}
                  productCompareAtPrice={product.compareAtPrice?.toNumber() || null}
                  productImage={images.find(img => img.isMain)?.url || images[0]?.url || null}
                  productStock={product.stock}
                  productRating={product.averageRating.toNumber()}
                />
              </div>

              {/* Envío */}
              <ShippingCalculator
                productWeight={product.weight?.toNumber()}
                productAmount={product.price.toNumber()}
              />

              {/* Compartir */}
              <ShareButtons
                title={product.name}
                url={`${process.env.NEXT_PUBLIC_APP_URL}/productos/${product.slug}`}
              />
            </div>
          </div>

          {/* Tabs de información */}
          <Tabs defaultValue="description" className="mt-16">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Descripción</TabsTrigger>
              <TabsTrigger value="specs">Especificaciones</TabsTrigger>
              <TabsTrigger value="reviews">Reseñas ({product.reviewCount})</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6">
              <div
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </TabsContent>
            <TabsContent value="specs" className="mt-6">
              <div className="grid gap-4 md:grid-cols-2">
                {product.weight && (
                  <div className="flex justify-between p-4 bg-muted rounded-lg">
                    <span className="font-medium">Peso</span>
                    <span>{product.weight.toNumber()}g</span>
                  </div>
                )}
                {product.dimensions && (
                  <>
                    <div className="flex justify-between p-4 bg-muted rounded-lg">
                      <span className="font-medium">Largo</span>
                      <span>{(product.dimensions as any).length} cm</span>
                    </div>
                    <div className="flex justify-between p-4 bg-muted rounded-lg">
                      <span className="font-medium">Ancho</span>
                      <span>{(product.dimensions as any).width} cm</span>
                    </div>
                    <div className="flex justify-between p-4 bg-muted rounded-lg">
                      <span className="font-medium">Alto</span>
                      <span>{(product.dimensions as any).height} cm</span>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6 space-y-6">
              <ReviewForm
                productId={product.id}
                canReview={false}
              />
              <div className="space-y-4">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Productos relacionados */}
          <RelatedProducts
            categoryIds={categories.map((c) => c.id)}
            currentProductId={product.id}
          />
        </div>
      </main>

      <RecentlyViewed currentProductId={product.id} />

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

      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData, null, 2) }}
      />
    </>
  );
}
