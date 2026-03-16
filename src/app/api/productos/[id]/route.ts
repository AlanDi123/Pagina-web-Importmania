import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/productos/[id]
 * Obtener producto por ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        images: true,
        variants: true,
        categories: {
          include: { category: true },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    return NextResponse.json(
      { error: 'Error al obtener producto' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/productos/[id]
 * Actualizar producto
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const product = await prisma.product.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    return NextResponse.json(
      { error: 'Error al actualizar producto' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/productos/[id]
 * Eliminar producto por ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Verificar que el producto existe
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        orderItems: {
          include: {
            order: {
              select: { status: true },
            },
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si tiene orders activas (no DELIVERED o CANCELLED)
    const activeOrders = product.orderItems.filter(
      (item) =>
        item.order.status !== 'DELIVERED' &&
        item.order.status !== 'CANCELLED' &&
        item.order.status !== 'REFUNDED'
    );

    if (activeOrders.length > 0) {
      return NextResponse.json(
        {
          error: 'No se puede eliminar el producto porque tiene pedidos activos',
          activeOrdersCount: activeOrders.length,
        },
        { status: 400 }
      );
    }

    // Eliminar producto (Prisma maneja cascada automáticamente)
    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return NextResponse.json(
      { error: 'Error al eliminar producto' },
      { status: 500 }
    );
  }
}
