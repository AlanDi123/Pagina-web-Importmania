import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const couponSchema = z.object({
  code: z.string().min(1).toUpperCase(),
  description: z.string().optional(),
  type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING']),
  value: z.number().positive(),
  minPurchase: z.number().positive().optional().nullable(),
  maxDiscount: z.number().positive().optional().nullable(),
  usageLimit: z.number().int().positive().optional().nullable(),
  perUserLimit: z.number().int().positive().default(1),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
  isActive: z.boolean().default(true),
  applicableCategories: z.array(z.string()).default([]),
  applicableProducts: z.array(z.string()).default([]),
});

/**
 * GET /api/admin/cupones
 * Lista todos los cupones
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(coupons);
  } catch (error) {
    console.error('Error al obtener cupones:', error);
    return NextResponse.json(
      { error: 'Error al obtener cupones' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/cupones
 * Crea nuevo cupón
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = couponSchema.parse(body);

    const coupon = await prisma.coupon.create({
      data: validatedData,
    });

    return NextResponse.json(coupon);
  } catch (error) {
    console.error('Error al crear cupón:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Error al crear cupón' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/cupones
 * Actualiza cupón
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'id requerido' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = couponSchema.partial().parse(body);

    const coupon = await prisma.coupon.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(coupon);
  } catch (error) {
    console.error('Error al actualizar cupón:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Error al actualizar cupón' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/cupones
 * Elimina cupón
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'id requerido' },
        { status: 400 }
      );
    }

    await prisma.coupon.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar cupón:', error);
    return NextResponse.json(
      { error: 'Error al eliminar cupón' },
      { status: 500 }
    );
  }
}
