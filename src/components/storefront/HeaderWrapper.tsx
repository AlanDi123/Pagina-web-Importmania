import { getActiveThemeOrDefault } from '@/lib/theme';
import Header from './Header';
import { prisma } from '@/lib/prisma';

/**
 * HeaderWrapper - Server Component que obtiene el tema activo y lo pasa al Header
 * 
 * Este componente:
 * 1. Obtiene el tema activo de la base de datos (con fallback)
 * 2. Obtiene las categorías para el menú
 * 3. Pasa los datos al Header cliente
 */
export async function HeaderWrapper() {
  // Obtener tema activo con graceful degradation
  const theme = await getActiveThemeOrDefault();

  // Obtener categorías activas para el menú
  const categories = await prisma.category.findMany({
    where: { isActive: true, parentId: null },
    select: { id: true, name: true, slug: true },
    orderBy: { sortOrder: 'asc' },
    take: 10,
  }).catch(() => []);

  return (
    <Header
      logo={theme.globalSettings.logoUrl || undefined}
      categories={categories}
    />
  );
}
