import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Ventas de hoy
    const salesToday = await prisma.order.aggregate({
      where: {
        paidAt: { gte: today },
        status: { not: 'CANCELLED' },
      },
      _sum: { total: true },
      _count: { id: true },
    });

    // Ventas del mes
    const salesMonth = await prisma.order.aggregate({
      where: {
        paidAt: { gte: firstDayOfMonth },
        status: { not: 'CANCELLED' },
      },
      _sum: { total: true },
      _count: { id: true },
    });

    // Pedidos pendientes
    const pendingOrders = await prisma.order.count({
      where: {
        status: { in: ['PENDING', 'PAYMENT_RECEIVED', 'PROCESSING'] },
      },
    });

    // Productos sin stock
    const outOfStockProducts = await prisma.product.count({
      where: {
        isActive: true,
        stock: 0,
      },
    });

    // Productos con stock bajo
    const lowStockProducts = await prisma.product.count({
      where: {
        isActive: true,
        AND: [
          { stock: { lte: 5 } },
          { stock: { gt: 0 } },
        ],
      },
    });

    // Usuarios nuevos del mes
    const newUsersMonth = await prisma.user.count({
      where: {
        createdAt: { gte: firstDayOfMonth },
        role: 'CUSTOMER',
      },
    });

    // Ventas diarias últimos 30 días
    const dailySales = await prisma.order.groupBy({
      by: ['paidAt'],
      where: {
        paidAt: { gte: thirtyDaysAgo },
        status: { not: 'CANCELLED' },
      },
      _sum: { total: true },
    });

    // Agrupar por día
    const salesByDay: Record<string, number> = {};
    dailySales.forEach((sale) => {
      if (sale.paidAt) {
        const date = sale.paidAt.toISOString().split('T')[0];
        salesByDay[date] = (salesByDay[date] || 0) + sale._sum.total?.toNumber() || 0;
      }
    });

    // Pedidos por estado
    const ordersByStatus = await prisma.order.groupBy({
      by: ['status'],
      _count: { id: true },
    });

    // Top 5 productos más vendidos del mes
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          paidAt: { gte: firstDayOfMonth },
          status: { not: 'CANCELLED' },
        },
      },
      _sum: { quantity: true },
      orderBy: {
        _sum: { quantity: 'desc' },
      },
      take: 5,
    });

    const topProductsWithDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            id: true,
            name: true,
            images: { where: { isMain: true }, take: 1 },
          },
        });

        return {
          productId: item.productId,
          name: product?.name || 'Producto eliminado',
          image: product?.images[0]?.url || null,
          unitsSold: item._sum.quantity || 0,
        };
      })
    );

    // Alertas
    const alerts = {
      lowStock: lowStockProducts,
      outOfStock: outOfStockProducts,
      pendingTransfers: await prisma.order.count({
        where: {
          paymentMethod: 'TRANSFER',
          paymentStatus: 'IN_REVIEW',
        },
      }),
      pendingReviews: await prisma.review.count({
        where: { isApproved: false },
      }),
    };

    // Tasa de conversión (pedidos pagados / visitas totales - estimado)
    const totalOrders = await prisma.order.count({
      where: { status: { not: 'CANCELLED' } },
    });

    return NextResponse.json({
      kpis: {
        salesToday: salesToday._sum.total?.toNumber() || 0,
        salesTodayCount: salesToday._count.id,
        salesMonth: salesMonth._sum.total?.toNumber() || 0,
        salesMonthCount: salesMonth._count.id,
        pendingOrders,
        outOfStockProducts,
        lowStockProducts,
        newUsersMonth,
        conversionRate: 2.5, // Esto debería venir de analytics
      },
      salesByDay: Object.entries(salesByDay).map(([date, total]) => ({
        date,
        total,
      })),
      ordersByStatus: ordersByStatus.map((s) => ({
        status: s.status,
        count: s._count.id,
      })),
      topProducts: topProductsWithDetails,
      alerts,
    });
  } catch (error) {
    console.error('Error al obtener dashboard:', error);
    return NextResponse.json(
      { error: 'Error al obtener datos del dashboard' },
      { status: 500 }
    );
  }
}
