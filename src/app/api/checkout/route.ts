import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { createPreference } from '@/lib/mercadopago';
import { sendOrderConfirmationEmail, sendNewOrderAdminEmail } from '@/lib/email';

const checkoutSchema = z.object({
  addressId: z.string().optional(),
  shippingMethod: z.enum(['HOME_DELIVERY', 'ANDREANI', 'OCA', 'CORREO_ARGENTINO', 'PICKUP']),
  shippingRateId: z.string().optional(),
  paymentMethod: z.enum(['MERCADOPAGO', 'TRANSFER', 'CASH']),
  couponCode: z.string().optional(),
  notes: z.string().max(500).optional(),
  transferReceipt: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = checkoutSchema.parse(body);

    // Obtener carrito del usuario
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            price: true,
            stock: true,
            isActive: true,
            productType: true,
            images: { where: { isMain: true }, take: 1 },
          },
        },
        variant: {
          select: {
            id: true,
            name: true,
            price: true,
            stock: true,
          },
        },
      },
    });

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Carrito vacío' },
        { status: 400 }
      );
    }

    // Validar stock de cada item
    for (const item of cartItems) {
      if (!item.product.isActive) {
        return NextResponse.json(
          { error: `El producto "${item.product.name}" ya no está disponible` },
          { status: 400 }
        );
      }

      const availableStock = item.variant?.stock || item.product.stock;
      if (availableStock < item.quantity) {
        return NextResponse.json(
          { error: `Stock insuficiente para "${item.product.name}". Stock disponible: ${availableStock}` },
          { status: 400 }
        );
      }
    }

    // Validar cupón si se envió
    let coupon;
    let discountAmount = 0;

    if (validatedData.couponCode) {
      coupon = await prisma.coupon.findUnique({
        where: { code: validatedData.couponCode.toUpperCase() },
      });

      if (!coupon || !coupon.isActive) {
        return NextResponse.json(
          { error: 'Cupón inválido o no activo' },
          { status: 400 }
        );
      }

      // Calcular descuento
      const subtotal = cartItems.reduce((sum, item) => {
        const price = item.variant?.price || item.product.price;
        return sum + price.toNumber() * item.quantity;
      }, 0);

      if (coupon.type === 'PERCENTAGE') {
        discountAmount = (subtotal * coupon.value.toNumber()) / 100;
        if (coupon.maxDiscount) {
          discountAmount = Math.min(discountAmount, coupon.maxDiscount.toNumber());
        }
      } else if (coupon.type === 'FIXED_AMOUNT') {
        discountAmount = Math.min(coupon.value.toNumber(), subtotal);
      }
    }

    // Calcular envío
    let shippingCost = 0;
    if (validatedData.shippingRateId && validatedData.shippingMethod !== 'PICKUP') {
      const shippingRate = await prisma.shippingRate.findUnique({
        where: { id: validatedData.shippingRateId },
      });

      if (shippingRate) {
        const subtotal = cartItems.reduce((sum, item) => {
          const price = item.variant?.price || item.product.price;
          return sum + price.toNumber() * item.quantity;
        }, 0);

        shippingCost = shippingRate.price.toNumber();
        if (shippingRate.freeAbove && subtotal >= shippingRate.freeAbove.toNumber()) {
          shippingCost = 0;
        }
      }
    }

    // Calcular totales
    const subtotal = cartItems.reduce((sum, item) => {
      const price = item.variant?.price || item.product.price;
      return sum + price.toNumber() * item.quantity;
    }, 0);

    // Descuento por transferencia
    let transferDiscount = 0;
    if (validatedData.paymentMethod === 'TRANSFER') {
      const transferDiscountConfig = await prisma.storeConfig.findUnique({
        where: { key: 'transfer_discount_percent' },
      });
      const transferDiscountPercent = transferDiscountConfig
        ? (transferDiscountConfig.value as any) || 10
        : 10;
      transferDiscount = (subtotal - discountAmount) * (transferDiscountPercent / 100);
    }

    const total = subtotal - discountAmount - transferDiscount + shippingCost;

    // Generar número de orden único
    const orderNumber = `IMP-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Crear orden con transacción
    const order = await prisma.$transaction(async (tx) => {
      // Crear orden
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: session.user.id!,
          addressId: validatedData.addressId,
          status: validatedData.paymentMethod === 'CASH' && validatedData.shippingMethod === 'PICKUP'
            ? 'PICKUP_READY'
            : 'PENDING',
          paymentStatus: validatedData.paymentMethod === 'TRANSFER'
            ? 'IN_REVIEW'
            : 'PENDING',
          paymentMethod: validatedData.paymentMethod,
          shippingMethod: validatedData.shippingMethod,
          subtotal,
          shippingCost,
          discount: discountAmount,
          transferDiscount,
          total,
          couponCode: validatedData.couponCode?.toUpperCase(),
          notes: validatedData.notes,
          transferReceipt: validatedData.transferReceipt,
          items: {
            create: cartItems.map((item) => ({
              productId: item.product.id,
              variantId: item.variantId,
              productName: item.product.name,
              variantName: item.variant?.name,
              sku: item.product.sku,
              price: (item.variant?.price || item.product.price).toNumber(),
              quantity: item.quantity,
              subtotal: (item.variant?.price || item.product.price).toNumber() * item.quantity,
              isDigital: item.product.productType === 'DIGITAL',
            })),
          },
          history: {
            create: {
              status: validatedData.paymentMethod === 'CASH' && validatedData.shippingMethod === 'PICKUP'
                ? 'PICKUP_READY'
                : 'PENDING',
              comment: 'Pedido creado',
              createdBy: 'system',
            },
          },
        },
        include: {
          items: true,
          user: true,
        },
      });

      // Descontar stock
      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.product.id },
          data: {
            stock: { decrement: item.quantity },
            salesCount: { increment: item.quantity },
          },
        });

        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: {
              stock: { decrement: item.quantity },
            },
          });
        }
      }

      // Actualizar cupón
      if (coupon) {
        await tx.coupon.update({
          where: { id: coupon.id },
          data: {
            usageCount: { increment: 1 },
          },
        });
      }

      // Vaciar carrito
      await tx.cartItem.deleteMany({
        where: { userId: session.user.id! },
      });

      return order;
    });

    // Si es MercadoPago, crear preferencia
    let paymentUrl: string | undefined;
    if (validatedData.paymentMethod === 'MERCADOPAGO') {
      try {
        const preference = await createPreference({
          items: order.items.map((item) => ({
            id: item.productId,
            title: item.productName,
            quantity: item.quantity,
            unit_price: item.price,
          })),
          payer: {
            email: order.user.email,
            name: order.user.name || undefined,
          },
          back_urls: {
            success: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
            failure: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/failure`,
            pending: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/pending`,
          },
          notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/pagos/mercadopago/webhook`,
          external_reference: orderNumber,
          metadata: {
            userId: session.user.id,
            orderNumber,
          },
        });

        paymentUrl = preference.init_point;

        // Actualizar orden con preference ID
        await prisma.order.update({
          where: { id: order.id },
          data: { mpPaymentId: preference.id },
        });
      } catch (error) {
        console.error('Error al crear preferencia de MercadoPago:', error);
      }
    }

    // Enviar email de confirmación (async, no bloquea)
    sendOrderConfirmationEmail(order.user.email, {
      orderNumber: order.orderNumber,
      total: total.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }),
      items: order.items.map((item) => ({
        name: item.productName,
        quantity: item.quantity,
        price: item.price.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }),
      })),
      shippingMethod: validatedData.shippingMethod,
    }).catch(console.error);

    // Enviar email al admin
    const adminEmail = process.env.EMAIL_FROM?.replace(/.*<(.*)>/, '$1');
    if (adminEmail) {
      sendNewOrderAdminEmail(
        adminEmail,
        order.orderNumber,
        total.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }),
        order.user.name || order.user.email
      ).catch(console.error);
    }

    // Crear notificación para el admin
    await prisma.notification.create({
      data: {
        type: 'NEW_ORDER',
        title: 'Nuevo pedido recibido',
        message: `El pedido ${orderNumber} fue creado exitosamente`,
        data: { orderId: order.id, orderNumber },
        channel: 'IN_APP',
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      total,
      paymentUrl,
    });
  } catch (error) {
    console.error('Error en checkout:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Error al procesar el pedido' },
      { status: 500 }
    );
  }
}
