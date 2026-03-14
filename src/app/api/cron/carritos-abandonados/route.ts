import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendAbandonedCartEmail } from '@/lib/email';

const CRON_SECRET = process.env.CRON_SECRET || 'cron-secret';

/**
 * POST - Cron job para carritos abandonados
 * Protegido con header Authorization: Bearer <CRON_SECRET>
 * Ejecutar cada 6 horas
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autorización
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Buscar carritos abandonados
    // Usuarios con items en carrito agregados hace más de 24 horas
    // Y que no tienen un pedido creado después de la última actualización del carrito
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const abandonedCarts = await prisma.cartItem.groupBy({
      by: ['userId'],
      where: {
        addedAt: {
          lt: twentyFourHoursAgo,
        },
      },
    });

    let emailsSent = 0;

    for (const cart of abandonedCarts) {
      const user = await prisma.user.findUnique({
        where: { id: cart.userId },
        include: {
          cartItems: {
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
          orders: {
            where: {
              createdAt: { gt: twentyFourHoursAgo },
            },
            take: 1,
          },
        },
      });

      // Si el usuario no existe o no tiene email, saltar
      if (!user || !user.email) {
        continue;
      }

      // Si el usuario hizo un pedido después de abandonar el carrito, saltar
      if (user.orders.length > 0) {
        continue;
      }

      // Si el carrito está vacío, saltar
      if (user.cartItems.length === 0) {
        continue;
      }

      // Preparar datos del email
      const cartItems = user.cartItems.map((item) => ({
        name: item.product.name,
        price: item.product.price.toNumber().toLocaleString('es-AR', {
          style: 'currency',
          currency: 'ARS',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }),
        image: item.product.images[0]?.url,
      }));

      const cartTotal = user.cartItems.reduce(
        (sum, item) => sum + item.product.price.toNumber() * item.quantity,
        0
      );

      // Enviar email
      try {
        await sendAbandonedCartEmail(user.email, {
          userName: user.name || user.email,
          items: cartItems,
          total: cartTotal.toLocaleString('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          recoveryUrl: `${process.env.NEXT_PUBLIC_APP_URL}/carrito`,
        });

        emailsSent++;

        // Crear notificación para el admin
        await prisma.notification.create({
          data: {
            type: 'ABANDONED_CART',
            title: 'Carrito abandonado recuperado',
            message: `Se envió email de recuperación a ${user.email}`,
            data: {
              userId: user.id,
              userEmail: user.email,
              itemsCount: user.cartItems.length,
              cartTotal,
            },
            channel: 'IN_APP',
          },
        });
      } catch (emailError) {
        console.error(`Error al enviar email a ${user.email}:`, emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Se enviaron ${emailsSent} emails de carritos abandonados`,
      emailsSent,
    });
  } catch (error) {
    console.error('Error en cron de carritos abandonados:', error);
    return NextResponse.json(
      { error: 'Error al procesar carritos abandonados' },
      { status: 500 }
    );
  }
}
