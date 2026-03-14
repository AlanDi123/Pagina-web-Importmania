import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createOrderSchema = z.object({
  addressId: z.string().optional(),
  address: z.object({
    street: z.string(),
    number: z.string(),
    floor: z.string().optional(),
    apartment: z.string().optional(),
    city: z.string(),
    province: z.string(),
    postalCode: z.string(),
    country: z.string().default('Argentina'),
    phone: z.string().optional(),
    notes: z.string().optional(),
  }).optional(),
  shippingMethod: z.enum(['HOME_DELIVERY', 'ANDREANI', 'OCA', 'CORREO_ARGENTINO', 'PICKUP']),
  paymentMethod: z.enum(['MERCADOPAGO', 'TRANSFER', 'CASH']),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(z.object({
    productId: z.string(),
    variantId: z.string().optional(),
    quantity: z.number().int().min(1),
    price: z.number(),
  })),
  subtotal: z.number(),
  shippingCost: z.number(),
  discount: z.number(),
  total: z.number(),
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
    const validatedData = createOrderSchema.parse(body);

    // Generar número de orden único
    const orderNumber = `IMP-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Crear orden con transacción
    const order = await prisma.$transaction(async (tx) => {
      // Crear dirección si se proporciona
      let addressId: string | null = null;
      if (validatedData.address) {
        const address = await tx.address.create({
          data: {
            ...validatedData.address,
            userId: session.user.id!,
          },
        });
        addressId = address.id;
      } else if (validatedData.addressId) {
        addressId = validatedData.addressId;
      }

      // Crear orden
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: session.user.id!,
          addressId,
          status: 'PENDING',
          paymentStatus: 'PENDING',
          paymentMethod: validatedData.paymentMethod,
          shippingMethod: validatedData.shippingMethod,
          subtotal: validatedData.subtotal,
          shippingCost: validatedData.shippingCost,
          discount: validatedData.discount,
          total: validatedData.total,
          couponCode: validatedData.couponCode,
          notes: validatedData.notes,
          items: {
            create: validatedData.items.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
              price: item.price,
              subtotal: item.price * item.quantity,
              // Snapshot del producto
              productName: '', // Se debería obtener del producto
              sku: '',
              isDigital: false,
            })),
          },
        },
        include: {
          items: true,
          user: true,
        },
      });

      // Actualizar stock y ventas
      for (const item of validatedData.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
            salesCount: { increment: item.quantity },
          },
        });

        // Actualizar stock de variante si existe
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: {
              stock: { decrement: item.quantity },
            },
          });
        }
      }

      // Actualizar cupón si se usó
      if (validatedData.couponCode) {
        await tx.coupon.update({
          where: { code: validatedData.couponCode },
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

    // Si es transferencia, retornar datos bancarios
    if (validatedData.paymentMethod === 'TRANSFER') {
      const bankConfig = await prisma.storeConfig.findMany({
        where: {
          key: { in: ['bank_cbu', 'bank_alias', 'bank_holder', 'bank_cuit', 'bank_name'] },
        },
      });

      const bankDetails = Object.fromEntries(
        bankConfig.map((c) => [c.key, c.value])
      );

      return NextResponse.json({
        success: true,
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          total: order.total.toNumber(),
        },
        bankDetails,
      });
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total.toNumber(),
      },
    });
  } catch (error) {
    console.error('Error al crear orden:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Error al crear orden' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        items: {
          take: 1,
          select: {
            product: {
              select: {
                images: {
                  where: { isMain: true },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    const total = await prisma.order.count({
      where: { userId: session.user.id },
    });

    return NextResponse.json({
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
    });
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    return NextResponse.json(
      { error: 'Error al obtener pedidos' },
      { status: 500 }
    );
  }
}
