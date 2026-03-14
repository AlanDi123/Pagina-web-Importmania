import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { PromoBar } from '@/components/storefront/PromoBar';
import { Breadcrumbs } from '@/components/storefront/Breadcrumbs';
import { Badge } from '@/components/ui/badge';
import { ShareButtons } from '@/components/storefront/ShareButtons';
import Image from 'next/image';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface BlogPostPageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
    select: {
      title: true,
      excerpt: true,
      coverImage: true,
    },
  });

  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  });

  if (!post || !post.isPublished) {
    notFound();
  }

  // Incrementar vistas
  await prisma.blogPost.update({
    where: { id: post.id },
    data: { viewCount: { increment: 1 } },
  });

  // Obtener config
  const storeConfig = await prisma.storeConfig.findMany();
  const config = Object.fromEntries(storeConfig.map((c) => [c.key, c.value]));

  const readingTime = Math.ceil(post.content.split(' ').length / 200);

  return (
    <>
      <PromoBar
        text={(config.promoBarText as string) || '¡Envío gratis en compras mayores a $50.000!'}
        enabled={(config.promoBarEnabled as boolean) || true}
      />

      <Header logo={config.logo as string} categories={[]} />

      <main className="py-8">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Inicio', href: '/' },
              { label: 'Blog', href: '/blog' },
              { label: post.title },
            ]}
          />

          <article className="mt-8">
            {/* Header */}
            <header className="mb-8">
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <span>
                  {format(post.publishedAt || post.createdAt, "d 'de' MMMM 'de' yyyy", {
                    locale: es,
                  })}
                </span>
                <span>•</span>
                <span>{readingTime} min de lectura</span>
                <span>•</span>
                <span>{post.viewCount} vistas</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
              {post.excerpt && (
                <p className="text-xl text-muted-foreground">{post.excerpt}</p>
              )}
            </header>

            {/* Imagen de portada */}
            {post.coverImage && (
              <div className="relative aspect-video mb-8 rounded-lg overflow-hidden">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 900px"
                  priority
                />
              </div>
            )}

            {/* Contenido */}
            <div
              className="prose prose-lg dark:prose-invert max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Compartir */}
            <div className="border-t pt-8">
              <h3 className="text-lg font-semibold mb-4">Compartir</h3>
              <ShareButtons
                title={post.title}
                url={`${process.env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}`}
              />
            </div>
          </article>
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
