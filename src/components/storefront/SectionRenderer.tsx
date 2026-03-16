import { prisma } from '@/lib/prisma';
import { HeroBanner } from './HeroBanner';
import { CategoryCarousel } from './CategoryCarousel';
import { NewsletterForm } from './NewsletterForm';
import { ProductGrid } from './ProductGrid';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import type { HomeSection } from '@/lib/validators';
import type { ProductListItem } from '@/types/product';

/**
 * Props para la sección HERO_BANNER
 */
interface HeroBannerSectionProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundImage?: string;
}

/**
 * Props para la sección FEATURED_PRODUCTS
 */
interface FeaturedProductsSectionProps {
  title?: string;
  productsCount?: number;
  showRating?: boolean;
}

/**
 * Props para la sección NEW_PRODUCTS
 */
interface NewProductsSectionProps {
  title?: string;
  productsCount?: number;
  showRating?: boolean;
}

/**
 * Props para la sección CATEGORIES
 */
interface CategoriesSectionProps {
  title?: string;
  categoriesCount?: number;
}

/**
 * Props para la sección TEXT_BLOCK
 */
interface TextBlockSectionProps {
  title?: string;
  content: string;
  textAlign?: 'left' | 'center' | 'right';
  backgroundColor?: string;
}

/**
 * Props para la sección IMAGE_BANNER
 */
interface ImageBannerSectionProps {
  image: string;
  alt?: string;
  link?: string;
  height?: string;
}

/**
 * Props para la sección NEWSLETTER
 */
interface NewsletterSectionProps {
  title?: string;
  description?: string;
}

/**
 * Componente para la sección HERO_BANNER
 */
async function HeroBannerSection({ props }: { props: HeroBannerSectionProps }) {
  const slides = props.backgroundImage
    ? [
        {
          id: 'hero-dynamic',
          title: props.title || '',
          subtitle: props.subtitle || '',
          description: '',
          ctaText: props.buttonText,
          ctaLink: props.buttonLink,
          image: props.backgroundImage,
        },
      ]
    : undefined;

  return <HeroBanner slides={slides} />;
}

/**
 * Componente para la sección FEATURED_PRODUCTS
 */
async function FeaturedProductsSection({ props }: { props: FeaturedProductsSectionProps }) {
  const productsCount = props.productsCount || 8;

  const products = await prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    take: productsCount,
    include: {
      images: {
        where: { isMain: true },
        take: 1,
      },
      categories: {
        include: { category: true },
      },
    },
  });

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
          {props.title || 'Productos Destacados'}
        </h2>
        <ProductGrid products={products as unknown as ProductListItem[]} />
      </div>
    </section>
  );
}

/**
 * Componente para la sección NEW_PRODUCTS
 */
async function NewProductsSection({ props }: { props: NewProductsSectionProps }) {
  const productsCount = props.productsCount || 8;

  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    take: productsCount,
    include: {
      images: {
        where: { isMain: true },
        take: 1,
      },
      categories: {
        include: { category: true },
      },
    },
  });

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
          {props.title || 'Nuevos Productos'}
        </h2>
        <ProductGrid products={products as unknown as ProductListItem[]} />
      </div>
    </section>
  );
}

/**
 * Componente para la sección CATEGORIES
 */
async function CategoriesSection({ props }: { props: CategoriesSectionProps }) {
  const categoriesCount = props.categoriesCount || 8;

  const categories = await prisma.category.findMany({
    where: { isActive: true, parentId: null },
    orderBy: { sortOrder: 'asc' },
    take: categoriesCount,
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
          {props.title || 'Categorías'}
        </h2>
        <CategoryCarousel categories={categories} />
      </div>
    </section>
  );
}

/**
 * Componente para la sección TEXT_BLOCK
 */
function TextBlockSection({ props }: { props: TextBlockSectionProps }) {
  const textAlign = props.textAlign || 'center';
  const backgroundColor = props.backgroundColor;

  return (
    <section
      className="py-12"
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8 sm:p-12">
            {props.title && (
              <h2
                className={`text-2xl sm:text-3xl font-bold mb-4 text-${textAlign}`}
              >
                {props.title}
              </h2>
            )}
            <div
              className={`text-lg text-muted-foreground prose prose-lg max-w-none text-${textAlign}`}
              dangerouslySetInnerHTML={{ __html: props.content }}
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

/**
 * Componente para la sección IMAGE_BANNER
 */
function ImageBannerSection({ props }: { props: ImageBannerSectionProps }) {
  const content = (
    <div className="relative w-full overflow-hidden" style={{ height: props.height || '400px' }}>
      <Image
        src={props.image}
        alt={props.alt || 'Banner'}
        fill
        className="object-cover"
        sizes="100vw"
      />
    </div>
  );

  if (props.link) {
    return (
      <Link href={props.link} className="block">
        {content}
      </Link>
    );
  }

  return content;
}

/**
 * Componente para la sección NEWSLETTER
 */
function NewsletterSection({ props }: { props: NewsletterSectionProps }) {
  return (
    <section className="py-12 bg-brand-primary/10">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold">
            {props.title || 'Suscribite al Newsletter'}
          </h2>
          {props.description && (
            <p className="text-muted-foreground">{props.description}</p>
          )}
        </div>
        <NewsletterForm />
      </div>
    </section>
  );
}

/**
 * Componente principal que renderiza una sección basada en su tipo
 * Maneja errores gracefulmente si el tipo no existe
 */
export async function SectionRenderer({ section }: { section: HomeSection }) {
  // Saltar secciones ocultas
  if (section.isVisible === false) {
    return null;
  }

  try {
    switch (section.type) {
      case 'HERO_BANNER':
        return <HeroBannerSection props={section.props as unknown as HeroBannerSectionProps} />;

      case 'FEATURED_PRODUCTS':
        return <FeaturedProductsSection props={section.props as unknown as FeaturedProductsSectionProps} />;

      case 'NEW_PRODUCTS':
        return <NewProductsSection props={section.props as unknown as NewProductsSectionProps} />;

      case 'CATEGORIES':
        return <CategoriesSection props={section.props as unknown as CategoriesSectionProps} />;

      case 'TEXT_BLOCK':
        return <TextBlockSection props={section.props as unknown as TextBlockSectionProps} />;

      case 'IMAGE_BANNER':
        return <ImageBannerSection props={section.props as unknown as ImageBannerSectionProps} />;

      case 'NEWSLETTER':
        return <NewsletterSection props={section.props as unknown as NewsletterSectionProps} />;

      default:
        // Manejo graceful para tipos de sección desconocidos
        console.warn(`Tipo de sección desconocido: ${section.type}`);
        return (
          <div className="container mx-auto px-4 py-8">
            <Card className="border-destructive bg-destructive/10">
              <CardContent className="p-4">
                <p className="text-destructive text-sm">
                  Sección no soportada: <code>{section.type}</code>
                </p>
              </CardContent>
            </Card>
          </div>
        );
    }
  } catch (error) {
    console.error(`Error al renderizar sección ${section.type} (${section.id}):`, error);
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="p-4">
            <p className="text-destructive text-sm">
              Error al cargar la sección: <code>{section.type}</code>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
}

/**
 * Obtiene las secciones de la home ordenadas
 */
export async function getHomeSections() {
  try {
    const theme = await prisma.theme.findFirst({
      where: { isActive: true },
    });

    if (!theme || !theme.globalSettings) {
      return [];
    }

    const settings = theme.globalSettings as { homeSections?: HomeSection[] };
    const sections = settings.homeSections || [];

    // Filtrar secciones visibles y ordenar por order
    return sections
      .filter((section) => section.isVisible !== false)
      .sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error('Error al obtener secciones de la home:', error);
    return [];
  }
}
