import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';
import Link from 'next/link';
import { ProductosTable } from '@/components/admin/ProductosTable';

export const metadata: Metadata = {
  title: 'Productos',
  description: 'Gestión de productos',
};

export default async function ProductosAdminPage({
  searchParams,
}: {
  searchParams: { category?: string; stock?: string; q?: string };
}) {
  const where: any = {};

  if (searchParams.category) {
    where.categories = {
      some: { categoryId: searchParams.category },
    };
  }

  if (searchParams.stock === 'low') {
    where.stock = { lte: 5 };
  }

  if (searchParams.q) {
    where.OR = [
      { name: { contains: searchParams.q, mode: 'insensitive' } },
      { sku: { contains: searchParams.q, mode: 'insensitive' } },
    ];
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      images: { where: { isMain: true }, take: 1 },
      categories: { include: { category: true }, take: 1 },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  const categories = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Productos</h1>
        <Button asChild>
          <Link href="/admin/productos/nuevo">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo producto
          </Link>
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o SKU..."
            defaultValue={searchParams.q}
            className="pl-10"
          />
        </div>
        <select className="border rounded-md px-3 py-2">
          <option value="">Todas las categorías</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tabla con funcionalidad de eliminar */}
      <ProductosTable products={products} />
    </div>
  );
}
