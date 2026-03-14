import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { DashboardCards } from '@/components/admin/DashboardCards';
import { SalesChart } from '@/components/admin/SalesChart';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatARS } from '@/lib/formatters';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Panel de administración',
};

const ORDER_STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-500',
  PAYMENT_RECEIVED: 'bg-blue-500',
  PROCESSING: 'bg-purple-500',
  SHIPPED: 'bg-cyan-500',
  DELIVERED: 'bg-green-500',
  CANCELLED: 'bg-red-500',
};

export default async function AdminDashboardPage() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Ejecutar queries en grupos pequeños para no saturar conexiones
  const totalOrders = await prisma.order.count();
  const totalRevenue = await prisma.order.aggregate({
    where: { status: { not: 'CANCELLED' } },
    _sum: { total: true },
  });
  const totalCustomers = await prisma.user.count({ where: { role: 'CUSTOMER' } });
  const totalProducts = await prisma.product.count({ where: { isActive: true } });
  
  const lowStockProducts = await prisma.product.count({
    where: { isActive: true, AND: [{ stock: { lte: 5 } }, { stock: { gt: 0 } }] },
  });

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { name: true, email: true } } },
  });

  const ordersByStatus = await prisma.order.groupBy({ by: ['status'], _count: { id: true } });
  
  const salesByDay = await prisma.order.groupBy({
    by: ['createdAt'],
    where: {
      createdAt: { gte: thirtyDaysAgo },
      status: { not: 'CANCELLED' },
    },
    _sum: { total: true },
  });

  // Agrupar ventas por día
  const salesData: Record<string, number> = {};
  salesByDay.forEach((sale) => {
    const date = sale.createdAt.toISOString().split('T')[0];
    salesData[date] = (salesData[date] || 0) + sale._sum.total?.toNumber() || 0;
  });

  const chartData = Object.entries(salesData)
    .map(([date, total]) => ({ date, total }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      {/* KPI Cards */}
      <DashboardCards
        kpis={{
          salesToday: 0,
          salesTodayCount: 0,
          salesMonth: totalRevenue._sum.total?.toNumber() || 0,
          salesMonthCount: totalOrders,
          pendingOrders: ordersByStatus.find((s) => s.status === 'PENDING')?._count.id || 0,
          outOfStockProducts: await prisma.product.count({ where: { isActive: true, stock: 0 } }),
          lowStockProducts,
          newUsersMonth: await prisma.user.count({
            where: { role: 'CUSTOMER', createdAt: { gte: firstDayOfMonth } },
          }),
          conversionRate: 2.5,
        }}
      />

      {/* Gráfico de ventas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Ventas últimos 30 días</h3>
            <SalesChart data={chartData} />
          </div>
        </div>

        {/* Pedidos por estado */}
        <div className="col-span-3 rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Pedidos por estado</h3>
          <div className="space-y-4">
            {ordersByStatus.map((status) => (
              <div key={status.status}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{status.status}</span>
                  <span className="text-sm text-muted-foreground">
                    {status._count.id} pedidos
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${ORDER_STATUS_COLORS[status.status] || 'bg-gray-500'}`}
                    style={{ width: `${(status._count.id / totalOrders) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Últimos pedidos y alertas */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Últimos pedidos */}
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Últimos pedidos</h3>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/pedidos">Ver todos</Link>
            </Button>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.user.name || order.user.email}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatARS(order.total)}</p>
                  <Badge className={ORDER_STATUS_COLORS[order.status] || 'bg-gray-500'}>
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alertas */}
        <div className="space-y-4">
          {lowStockProducts > 0 && (
            <div className="rounded-lg border border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20 p-6">
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
                ⚠️ Stock bajo
              </h3>
              <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                {lowStockProducts} productos están por agotarse
              </p>
              <Button variant="outline" size="sm" className="mt-4" asChild>
                <Link href="/admin/productos?stock=low">Ver productos</Link>
              </Button>
            </div>
          )}

          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Accesos rápidos</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/productos/nuevo">Nuevo producto</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/cupones">Cupones</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/blog/nuevo">Nuevo post</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/configuracion">Configuración</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
