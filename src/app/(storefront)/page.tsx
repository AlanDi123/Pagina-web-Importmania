import { SectionRenderer, getHomeSections } from '@/components/storefront/SectionRenderer';

export const revalidate = 3600; // ISR: Revalidar cada 1 hora

export default async function HomePage() {
  // Obtener secciones de la home desde el tema activo
  const homeSections = await getHomeSections();

  return (
    <main>
      {homeSections.length > 0 ? (
        homeSections.map((section) => (
          <SectionRenderer key={section.id} section={section} />
        ))
      ) : (
        // Fallback: mostrar contenido por defecto si no hay secciones
        <div className="container mx-auto max-w-7xl px-4 py-12 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Bienvenido a iMPORTMANIA
          </h1>
          <p className="text-muted-foreground mb-8">
            Tu tienda de productos importados de confianza
          </p>
          <p className="text-sm text-muted-foreground">
            Configurá las secciones de la home desde el panel de administración
            <br />
            <code className="bg-muted px-2 py-1 rounded mt-2 inline-block">
              /admin/apariencia
            </code>
          </p>
        </div>
      )}
    </main>
  );
}
