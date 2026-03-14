import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const shippingRateSchema = z.object({
  zoneId: z.string(),
  method: z.enum(['HOME_DELIVERY', 'ANDREANI', 'OCA', 'CORREO_ARGENTINO', 'PICKUP']),
  name: z.string(),
  price: z.number().positive(),
  freeAbove: z.number().positive().optional().nullable(),
  estimatedDays: z.string(),
  maxWeight: z.number().positive().optional().nullable(),
  isActive: z.boolean().default(true),
});

/**
 * POST /api/envios/rates
 * Crea nueva tarifa de envío
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

    const searchParams = request.nextUrl.searchParams;
    const zoneId = searchParams.get('zoneId');

    if (!zoneId) {
      return NextResponse.json(
        { error: 'zoneId requerido' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = shippingRateSchema.parse({ ...body, zoneId });

    const rate = await prisma.shippingRate.create({
      data: validatedData,
    });

    return NextResponse.json(rate);
  } catch (error) {
    console.error('Error al crear tarifa de envío:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Error al crear tarifa' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/envios/rates
 * Actualiza tarifa de envío
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
    const rateId = searchParams.get('rateId');

    if (!rateId) {
      return NextResponse.json(
        { error: 'rateId requerido' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = shippingRateSchema.partial().parse(body);

    const rate = await prisma.shippingRate.update({
      where: { id: rateId },
      data: validatedData,
    });

    return NextResponse.json(rate);
  } catch (error) {
    console.error('Error al actualizar tarifa:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Error al actualizar tarifa' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/envios/rates
 * Elimina tarifa de envío
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
    const rateId = searchParams.get('rateId');

    if (!rateId) {
      return NextResponse.json(
        { error: 'rateId requerido' },
        { status: 400 }
      );
    }

    await prisma.shippingRate.delete({
      where: { id: rateId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar tarifa:', error);
    return NextResponse.json(
      { error: 'Error al eliminar tarifa' },
      { status: 500 }
    );
  }
}
