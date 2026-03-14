import Link from 'next/link';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';

export default async function NotFoundPage() {
  // Obtener categorías para el header
  const categories = await prisma.category.findMany({
    where: { isActive: true, parentId: null },
    orderBy: { sortOrder: 'asc' },
    take: 8,
  });

  const transformedCategories = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
  }));

  return (
    <>
      <Header logo="" categories={transformedCategories} />

      <main className="min-h-[60vh] flex items-center justify-center py-16">
        <div className="container mx-auto max-w-2xl px-4 text-center">
          <h1 className="text-9xl font-bold text-brand-primary mb-4">404</h1>
          <h2 className="text-3xl font-bold mb-4">Página no encontrada</h2>
          <p className="text-lg text-muted-foreground mb-8">
            La página que estás buscando no existe o fue movida.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/">Volver al inicio</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/productos">Explorar productos</Link>
            </Button>
          </div>

          {/* Búsqueda rápida */}
          <div className="mt-12">
            <p className="text-sm text-muted-foreground mb-4">
              ¿Buscás algo específico?
            </p>
            <form action="/buscar" className="flex gap-2 justify-center">
              <input
                type="text"
                name="q"
                placeholder="Buscar productos..."
                className="px-4 py-2 border rounded-md w-full max-w-md"
              />
              <Button type="submit">Buscar</Button>
            </form>
          </div>
        </div>
      </main>

      <Footer
        categories={transformedCategories}
        socialLinks={{}}
        contactInfo={{}}
      />
    </>
  );
}
