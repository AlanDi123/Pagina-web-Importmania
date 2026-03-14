import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { OrderDetail } from '@/components/admin/OrderDetail';

interface PedidoDetailPageProps {
  params: { id: string };
}

export const metadata: Metadata = {
  title: 'Detalle de Pedido',
  description: 'Ver detalle de pedido',
};

export default async function PedidoDetailPage({ params }: PedidoDetailPageProps) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      address: true,
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              images: { where: { isMain: true }, take: 1 },
            },
          },
        },
      },
      history: { orderBy: { createdAt: 'asc' } },
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <OrderDetail order={order} />
    </div>
  );
}
