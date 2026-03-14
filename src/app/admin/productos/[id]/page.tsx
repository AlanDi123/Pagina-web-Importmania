import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ProductForm } from '@/components/admin/ProductForm';

interface ProductoEditPageProps {
  params: { id: string };
}

export const metadata: Metadata = {
  title: 'Editar Producto',
  description: 'Editar producto',
};

export default async function ProductoEditPage({ params }: ProductoEditPageProps) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      images: true,
      variants: true,
      categories: true,
    },
  });

  if (!product) {
    notFound();
  }

  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold">Editar Producto</h1>
      </div>

      <ProductForm
        product={product}
        categories={categories}
        mode="edit"
      />
    </div>
  );
}
