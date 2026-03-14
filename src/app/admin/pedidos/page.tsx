import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { OrderTable } from '@/components/admin/OrderTable';
import { OrderStatus, PaymentStatus, PaymentMethod } from '@prisma/client';

export const metadata: Metadata = {
  title: 'Pedidos',
  description: 'Gestión de pedidos',
};

export default async function PedidosAdminPage({
  searchParams,
}: {
  searchParams: {
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    paymentMethod?: PaymentMethod;
    page?: string;
  };
}) {
  const page = parseInt(searchParams.page || '1');
  const limit = 20;

  const where: any = {};

  if (searchParams.status) {
    where.status = searchParams.status;
  }

  if (searchParams.paymentStatus) {
    where.paymentStatus = searchParams.paymentStatus;
  }

  if (searchParams.paymentMethod) {
    where.paymentMethod = searchParams.paymentMethod;
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: { select: { name: true, email: true } },
        items: { select: { id: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.order.count({ where }),
  ]);

  const transformedOrders = orders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    userId: order.userId,
    customerName: order.user.name || order.user.email,
    customerEmail: order.user.email,
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    shippingMethod: order.shippingMethod,
    total: order.total.toNumber(),
    itemsCount: order.items.length,
    createdAt: order.createdAt,
    paidAt: order.paidAt,
    deliveredAt: order.deliveredAt,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Pedidos</h1>

      <OrderTable
        orders={transformedOrders}
        pagination={{
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit,
        }}
        filters={{
          status: searchParams.status,
          paymentStatus: searchParams.paymentStatus,
          paymentMethod: searchParams.paymentMethod,
        }}
        onFilterChange={() => {}}
        onPageChange={() => {}}
      />
    </div>
  );
}
