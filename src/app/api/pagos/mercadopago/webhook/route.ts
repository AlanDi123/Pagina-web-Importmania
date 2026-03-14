import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getPaymentById, mapPaymentStatus, validateWebhookSignature } from '@/lib/mercadopago';
import { sendOrderConfirmationEmail, sendNewOrderAdminEmail } from '@/lib/email';

/**
 * Webhook de MercadoPago para recibir notificaciones de pago
 */
export async function POST(request: NextRequest) {
  try {
    // Obtener firma del webhook
    const signature = request.headers.get('x-signature') || '';
    const body = await request.text();

    // Validar firma (en producción)
    if (process.env.MP_WEBHOOK_SECRET) {
      const isValid = validateWebhookSignature(signature, body);
      if (!isValid) {
        console.warn('Firma de webhook inválida');
        // En producción retornar error, en desarrollo continuar
      }
    }

    const data = JSON.parse(body);

    // Verificar que es una notificación de pago
    if (data.type !== 'payment') {
      return NextResponse.json({ received: true });
    }

    const paymentId = data.data.id;

    if (!paymentId) {
      return NextResponse.json({ error: 'Payment ID requerido' }, { status: 400 });
    }

    // Obtener detalles del pago desde MercadoPago
    const payment = await getPaymentById(paymentId);

    // Obtener número de orden del external_reference
    const orderNumber = payment.external_reference;

    if (!orderNumber) {
      return NextResponse.json({ error: 'Order number no encontrado' }, { status: 400 });
    }

    // Buscar orden en la base de datos
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 });
    }

    // Mapear estado del pago
    const paymentStatus = mapPaymentStatus(payment.status);

    // Actualizar orden
    const updateData: any = {
      mpPaymentId: paymentId,
      mpStatus: payment.status,
      paymentStatus,
    };

    // Si el pago fue aprobado
    if (paymentStatus === 'APPROVED') {
      updateData.status = 'PAYMENT_RECEIVED';
      updateData.paidAt = new Date(payment.date_approved);
    } else if (paymentStatus === 'REJECTED' || paymentStatus === 'CANCELLED') {
      updateData.status = 'CANCELLED';
      updateData.cancelledAt = new Date();
    }

    await prisma.order.update({
      where: { id: order.id },
      data: updateData,
    });

    // Crear historial de orden
    await prisma.orderHistory.create({
      data: {
        orderId: order.id,
        status: updateData.status,
        comment: `Pago ${payment.status} via MercadoPago`,
        createdBy: 'system',
      },
    });

    // Enviar notificaciones según el estado
    if (paymentStatus === 'APPROVED') {
      // Email al cliente
      await sendOrderConfirmationEmail(order.user.email, {
        orderNumber: order.orderNumber,
        total: order.total.toNumber().toLocaleString('es-AR', {
          style: 'currency',
          currency: 'ARS',
        }),
        items: order.items.map((item) => ({
          name: item.productName,
          quantity: item.quantity,
          price: item.price.toNumber().toLocaleString('es-AR', {
            style: 'currency',
            currency: 'ARS',
          }),
        })),
        shippingMethod: order.shippingMethod,
      });

      // Email al admin
      const adminEmail = process.env.EMAIL_FROM?.replace(/.*<(.*)>/, '$1');
      if (adminEmail) {
        await sendNewOrderAdminEmail(
          adminEmail,
          order.orderNumber,
          order.total.toNumber().toLocaleString('es-AR', {
            style: 'currency',
            currency: 'ARS',
          }),
          order.user.name || order.user.email
        );
      }

      // Crear notificación para el admin
      await prisma.notification.create({
        data: {
          type: 'NEW_ORDER',
          title: 'Nuevo pedido pagado',
          message: `El pedido ${order.orderNumber} fue pagado exitosamente`,
          data: { orderId: order.id, orderNumber },
          channel: 'IN_APP',
        },
      });
    }

    return NextResponse.json({ received: true, success: true });
  } catch (error) {
    console.error('Error en webhook de MercadoPago:', error);
    // Retornar 200 para evitar reintentos infinitos de MercadoPago
    return NextResponse.json({ received: true, error: 'Error procesando webhook' });
  }
}

/**
 * GET para debugging del webhook
 */
export async function GET() {
  return NextResponse.json({
    message: 'Webhook de MercadoPago activo',
    timestamp: new Date().toISOString(),
  });
}
