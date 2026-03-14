import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { PromoBar } from '@/components/storefront/PromoBar';
import { Breadcrumbs } from '@/components/storefront/Breadcrumbs';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Artículos y novedades de iMPORTMANIA',
};

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' },
    take: 20,
  });

  const storeConfig = await prisma.storeConfig.findMany();

  const config = Object.fromEntries(storeConfig.map((c) => [c.key, c.value]));

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
              { label: 'Blog' },
            ]}
          />

          <div className="mt-8">
            <h1 className="text-4xl font-bold mb-4 text-center">Blog</h1>
            <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Consejos, novedades y todo lo que necesitás saber sobre nuestros productos
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="group border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {post.coverImage && (
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>
                        {format(post.publishedAt || post.createdAt, 'd MMMM yyyy', {
                          locale: es,
                        })}
                      </span>
                      <span>•</span>
                      <span>{post.viewCount} vistas</span>
                    </div>
                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="text-xl font-semibold group-hover:text-brand-primary transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                    </Link>
                    {post.excerpt && (
                      <p className="text-muted-foreground line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-block text-brand-primary font-medium hover:underline"
                    >
                      Leer más →
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {posts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground">
                  Pronto publicaremos nuevos artículos.
                </p>
              </div>
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
