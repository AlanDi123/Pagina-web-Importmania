import { prisma } from '@/lib/prisma';
import { formatARS } from '@/lib/formatters';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function AdminDashboardPage() {
  // Obtener KPIs
  const [
    totalOrders,
    totalRevenue,
    totalCustomers,
    totalProducts,
    lowStockProducts,
    recentOrders,
    ordersByStatus,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({
      where: { status: { not: 'CANCELLED' } },
      _sum: { total: true },
    }),
    prisma.user.count({
      where: { role: 'CUSTOMER' },
    }),
    prisma.product.count({
      where: { isActive: true },
    }),
    prisma.product.count({
      where: {
        isActive: true,
        stock: { lte: 5 },
      },
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    }),
    prisma.order.groupBy({
      by: ['status'],
      _count: { id: true },
    }),
  ]);

  // Ventas de los últimos 30 días
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const salesByDay = await prisma.order.groupBy({
    by: ['createdAt'],
    where: {
      createdAt: { gte: thirtyDaysAgo },
      status: { not: 'CANCELLED' },
    },
    _sum: { total: true },
  });

  // Agrupar por día
  const salesData: Record<string, number> = {};
  salesByDay.forEach((sale) => {
    const date = sale.createdAt.toISOString().split('T')[0];
    salesData[date] = (salesData[date] || 0) + sale._sum.total?.toNumber() || 0;
  });

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas del Mes</CardTitle>
            <span className="text-2xl">💰</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatARS(totalRevenue._sum.total || 0)}
            </div>
            <p className="text-xs text-text-secondary mt-1">
              Total histórico
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Totales</CardTitle>
            <span className="text-2xl">📦</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-text-secondary mt-1">
              Pedidos realizados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <span className="text-2xl">👥</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-text-secondary mt-1">
              Usuarios registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos Activos</CardTitle>
            <span className="text-2xl">🛍️</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-text-secondary mt-1">
              {lowStockProducts} con stock bajo
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Pedidos por estado */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Pedidos por Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ordersByStatus.map((status) => (
                <div key={status.status} className="flex items-center">
                  <div className="w-full">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-text-primary">
                        {status.status}
                      </span>
                      <span className="ml-auto text-sm text-text-secondary">
                        {status._count.id} pedidos
                      </span>
                    </div>
                    <div className="mt-2 h-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                      <div
                        className="h-2 bg-brand-primary rounded-full"
                        style={{
                          width: `${(status._count.id / totalOrders) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Últimos pedidos */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Últimos Pedidos</CardTitle>
            <CardDescription>Los 5 pedidos más recientes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      {order.orderNumber}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {order.user.name || order.user.email}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">
                      {formatARS(order.total)}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {order.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas de stock bajo */}
      {lowStockProducts > 0 && (
        <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ⚠️ Stock Bajo
            </CardTitle>
            <CardDescription>
              {lowStockProducts} productos están por agotarse
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a
              href="/admin/productos?stock=low"
              className="text-sm text-brand-primary hover:underline font-medium"
            >
              Ver productos →
            </a>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
