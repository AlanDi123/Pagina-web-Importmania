import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import CategoriasAdminPage from './categorias-client';

export const metadata: Metadata = {
  title: 'Categorías',
  description: 'Gestión de categorías',
};

export default async function CategoriasPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { products: true } },
      parent: true,
    },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
  });

  return <CategoriasAdminPage initialCategories={categories} />;
}
