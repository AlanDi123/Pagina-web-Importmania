import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const validateCouponSchema = z.object({
  code: z.string(),
  cartTotal: z.number(),
  productIds: z.array(z.string()).optional(),
  categoryIds: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = validateCouponSchema.parse(body);

    const coupon = await prisma.coupon.findUnique({
      where: { code: validatedData.code.toUpperCase() },
      include: {
        orders: {
          where: { userId: request.headers.get('x-user-id') || '' },
        },
      },
    });

    if (!coupon) {
      return NextResponse.json(
        {
          isValid: false,
          errorType: 'INVALID_CODE',
          errorMessage: 'Cupón inválido',
        },
        { status: 400 }
      );
    }

    // Verificar si está activo
    if (!coupon.isActive) {
      return NextResponse.json(
        {
          isValid: false,
          errorType: 'INACTIVE',
          errorMessage: 'Cupón no activo',
        },
        { status: 400 }
      );
    }

    // Verificar fechas
    const now = new Date();
    if (coupon.startDate && now < coupon.startDate) {
      return NextResponse.json(
        {
          isValid: false,
          errorType: 'NOT_STARTED',
          errorMessage: 'Cupón aún no disponible',
        },
        { status: 400 }
      );
    }

    if (coupon.endDate && now > coupon.endDate) {
      return NextResponse.json(
        {
          isValid: false,
          errorType: 'EXPIRED',
          errorMessage: 'Cupón expirado',
        },
        { status: 400 }
      );
    }

    // Verificar límite de usos
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json(
        {
          isValid: false,
          errorType: 'USAGE_LIMIT_REACHED',
          errorMessage: 'Cupón sin usos disponibles',
        },
        { status: 400 }
      );
    }

    // Verificar límite por usuario
    if (coupon.perUserLimit && coupon.orders.length >= coupon.perUserLimit) {
      return NextResponse.json(
        {
          isValid: false,
          errorType: 'USER_LIMIT_REACHED',
          errorMessage: 'Ya usaste este cupón',
        },
        { status: 400 }
      );
    }

    // Verificar compra mínima
    if (coupon.minPurchase && validatedData.cartTotal < coupon.minPurchase.toNumber()) {
      return NextResponse.json(
        {
          isValid: false,
          errorType: 'MIN_PURCHASE_NOT_MET',
          errorMessage: `Requiere compra mínima de $${coupon.minPurchase.toNumber().toLocaleString('es-AR')}`,
        },
        { status: 400 }
      );
    }

    // Verificar productos/categorías aplicables
    if (
      coupon.applicableProducts.length > 0 &&
      validatedData.productIds &&
      !validatedData.productIds.some((id) => coupon.applicableProducts.includes(id))
    ) {
      return NextResponse.json(
        {
          isValid: false,
          errorType: 'PRODUCT_NOT_APPLICABLE',
          errorMessage: 'Cupón no aplicable a los productos del carrito',
        },
        { status: 400 }
      );
    }

    if (
      coupon.applicableCategories.length > 0 &&
      validatedData.categoryIds &&
      !validatedData.categoryIds.some((id) => coupon.applicableCategories.includes(id))
    ) {
      return NextResponse.json(
        {
          isValid: false,
          errorType: 'CATEGORY_NOT_APPLICABLE',
          errorMessage: 'Cupón no aplicable a las categorías del carrito',
        },
        { status: 400 }
      );
    }

    // Calcular descuento
    let discountAmount = 0;

    if (coupon.type === 'PERCENTAGE') {
      discountAmount = (validatedData.cartTotal * coupon.value.toNumber()) / 100;
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount.toNumber()) {
        discountAmount = coupon.maxDiscount.toNumber();
      }
    } else if (coupon.type === 'FIXED_AMOUNT') {
      discountAmount = Math.min(coupon.value.toNumber(), validatedData.cartTotal);
    }
    // FREE_SHIPPING no calcula descuento aquí

    return NextResponse.json({
      isValid: true,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        type: coupon.type,
        value: coupon.value.toNumber(),
        discountAmount,
        minPurchase: coupon.minPurchase?.toNumber() || null,
        maxDiscount: coupon.maxDiscount?.toNumber() || null,
      },
    });
  } catch (error) {
    console.error('Error al validar cupón:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Error al validar cupón' },
      { status: 500 }
    );
  }
}
