import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { sendShippingUpdateEmail } from '@/lib/email';

const updateOrderSchema = z.object({
  status: z.enum(['PENDING', 'PAYMENT_RECEIVED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'PICKUP_READY', 'PICKED_UP']).optional(),
  comment: z.string().optional(),
  trackingCode: z.string().optional(),
  trackingUrl: z.string().optional(),
  adminNotes: z.string().optional(),
});

/**
 * GET /api/pedidos/[id]
 * Obtiene detalle de pedido por ID
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

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
      return NextResponse.json(
        { error: 'Pedido no encontrado' },
        { status: 404 }
      );
    }

    // Verificar ownership o admin
    if (order.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error al obtener pedido:', error);
    return NextResponse.json(
      { error: 'Error al obtener pedido' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/pedidos/[id]
 * Actualiza pedido (solo ADMIN)
 */
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado - Solo admin' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = updateOrderSchema.parse(body);

    const order = await prisma.order.findUnique({
      where: { id: params.id },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Pedido no encontrado' },
        { status: 404 }
      );
    }

    // Actualizar pedido con transacción
    await prisma.$transaction(async (tx) => {
      // Actualizar datos principales
      const updateData: any = {};
      
      if (validatedData.status !== undefined) {
        updateData.status = validatedData.status;
      }
      if (validatedData.trackingCode !== undefined) {
        updateData.trackingCode = validatedData.trackingCode;
      }
      if (validatedData.trackingUrl !== undefined) {
        updateData.trackingUrl = validatedData.trackingUrl;
      }
      if (validatedData.adminNotes !== undefined) {
        updateData.adminNotes = validatedData.adminNotes;
      }

      await tx.order.update({
        where: { id: params.id },
        data: updateData,
      });

      // Crear entrada en historial si cambió estado
      if (validatedData.status) {
        await tx.orderHistory.create({
          data: {
            orderId: params.id,
            status: validatedData.status,
            comment: validatedData.comment || 'Estado actualizado por admin',
            createdBy: session.user!.email || 'admin',
          },
        });
      }

      // Actualizar paidAt si corresponde
      if (validatedData.status === 'PAYMENT_RECEIVED' && !order.paidAt) {
        await tx.order.update({
          where: { id: params.id },
          data: { paidAt: new Date() },
        });
      }

      // Enviar email de actualización si cambió a SHIPPED
      if (validatedData.status === 'SHIPPED') {
        try {
          await sendShippingUpdateEmail(
            order.user.email,
            order.orderNumber,
            'SHIPPED',
            validatedData.trackingCode || undefined,
            validatedData.trackingUrl || undefined
          );
        } catch (emailError) {
          console.error('Error al enviar email de shipping:', emailError);
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al actualizar pedido:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Error al actualizar pedido' },
      { status: 500 }
    );
  }
}
