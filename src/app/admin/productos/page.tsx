import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatARS } from '@/lib/formatters';
import Image from 'next/image';
import Link from 'next/link';
import { Edit, Trash2, Plus, Search } from 'lucide-react';

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

      {/* Tabla */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Imagen</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted">
                    {product.images[0]?.url ? (
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">Sin img</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                <TableCell>{formatARS(product.price.toNumber())}</TableCell>
                <TableCell>
                  {product.stock <= 0 ? (
                    <Badge variant="destructive">Sin stock</Badge>
                  ) : product.stock <= product.lowStockThreshold ? (
                    <Badge variant="outline">Bajo ({product.stock})</Badge>
                  ) : (
                    product.stock
                  )}
                </TableCell>
                <TableCell>
                  {product.categories[0]?.category.name || '-'}
                </TableCell>
                <TableCell>
                  <Badge variant={product.isActive ? 'default' : 'secondary'}>
                    {product.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/productos/${product.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
