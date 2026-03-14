import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { PromoBar } from '@/components/storefront/PromoBar';
import { ProductGrid } from '@/components/storefront/ProductGrid';
import { FilterSidebar } from '@/components/storefront/FilterSidebar';
import { SortDropdown } from '@/components/storefront/SortDropdown';
import { Pagination } from '@/components/ui/pagination';
import { ProductFilters, ProductSort } from '@/types/product';
import { formatARS } from '@/lib/formatters';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

interface ProductosPageProps {
  searchParams: {
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
    sort?: string;
    page?: string;
    q?: string;
  };
}

export const metadata: Metadata = {
  title: 'Productos',
  description: 'Explorá nuestro catálogo de productos importados',
};

export default async function ProductosPage({ searchParams }: ProductosPageProps) {
  const page = parseInt(searchParams.page || '1');
  const limit = 12;
  const sort = (searchParams.sort || 'relevance') as ProductSort;

  // Construir filtros
  const filters: ProductFilters = {};

  if (searchParams.category) {
    const category = await prisma.category.findUnique({
      where: { slug: searchParams.category },
    });
    if (category) {
      filters.categoryIds = [category.id];
    }
  }

  if (searchParams.minPrice) {
    filters.minPrice = parseFloat(searchParams.minPrice);
  }

  if (searchParams.maxPrice) {
    filters.maxPrice = parseFloat(searchParams.maxPrice);
  }

  if (searchParams.inStock === 'true') {
    filters.inStock = true;
  }

  // Construir where clause
  const where: any = {
    isActive: true,
  };

  if (filters.categoryIds) {
    where.categories = {
      some: {
        categoryId: { in: filters.categoryIds },
      },
    };
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {};
    if (filters.minPrice !== undefined) where.price.gte = filters.minPrice;
    if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice;
  }

  if (filters.inStock) {
    where.stock = { gt: 0 };
  }

  // Ordenamiento
  const orderBy: any = {};
  switch (sort) {
    case 'price_asc':
      orderBy.price = 'asc';
      break;
    case 'price_desc':
      orderBy.price = 'desc';
      break;
    case 'newest':
      orderBy.createdAt = 'desc';
      break;
    case 'bestselling':
      orderBy.salesCount = 'desc';
      break;
    case 'rating':
      orderBy.averageRating = 'desc';
      break;
    default:
      orderBy.salesCount = 'desc';
  }

  // Fetch productos
  const [products, total, categories, priceRange] = await Promise.all([
    prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        images: {
          where: { isMain: true },
          take: 1,
        },
        categories: {
          include: { category: { select: { name: true } } },
          take: 1,
        },
      },
      orderBy,
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({
      where: { isActive: true, parentId: null },
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.product.aggregate({
      where: { isActive: true },
      _min: { price: true },
      _max: { price: true },
    }),
  ]);

  // Transformar productos
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
    categories: p.categories.map((c) => c.category.name),
    tags: p.tags,
    createdAt: p.createdAt,
  }));

  // Transformar categorías para filtros
  const filterCategories = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    count: c._count.products,
  }));

  // Tags disponibles
  const allTags = await prisma.product.groupBy({
    by: ['tags'],
    where: { isActive: true },
  });

  const tagCounts: Record<string, number> = {};
  allTags.forEach((p) => {
    p.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const filterTags = Object.entries(tagCounts).map(([name, count]) => ({
    name,
    count,
  }));

  const totalPages = Math.ceil(total / limit);

  // Obtener config de la tienda
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
        categories={filterCategories}
      />

      <main className="py-8">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground">
              Inicio
            </Link>
            <ChevronLeft className="h-4 w-4 rotate-180" />
            <span className="text-foreground font-medium">Productos</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar de filtros (desktop) */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <FilterSidebar
                  categories={filterCategories}
                  priceRange={{
                    min: priceRange._min.price?.toNumber() || 0,
                    max: priceRange._max.price?.toNumber() || 100000,
                  }}
                  tags={filterTags}
                  activeFilters={filters}
                  onFilterChange={() => {}}
                />
              </div>
            </aside>

            {/* Contenido principal */}
            <div className="flex-1">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold">Productos</h1>
                  <p className="text-muted-foreground">
                    {total} productos encontrados
                  </p>
                </div>
                <SortDropdown
                  currentSort={sort}
                  onSortChange={() => {}}
                />
              </div>

              {/* Grid de productos */}
              <ProductGrid products={transformedProducts} />

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    baseUrl="/productos"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer
        categories={filterCategories}
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
