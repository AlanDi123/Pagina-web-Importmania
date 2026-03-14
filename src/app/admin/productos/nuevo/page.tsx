import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { ProductForm } from '@/components/admin/ProductForm';

export const metadata: Metadata = {
  title: 'Nuevo Producto',
  description: 'Crear nuevo producto',
};

export default async function NuevoProductoPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold">Nuevo Producto</h1>
      </div>

      <ProductForm
        categories={categories}
        mode="create"
      />
    </div>
  );
}
