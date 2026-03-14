import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const shippingZoneSchema = z.object({
  name: z.string().min(1),
  provinces: z.array(z.string()),
  postalCodes: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
});

/**
 * GET /api/envios
 * Lista todas las zonas de envío con tarifas
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

    const zones = await prisma.shippingZone.findMany({
      include: {
        rates: true,
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(zones);
  } catch (error) {
    console.error('Error al obtener zonas de envío:', error);
    return NextResponse.json(
      { error: 'Error al obtener zonas' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/envios
 * Crea nueva zona de envío
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
    const validatedData = shippingZoneSchema.parse(body);

    const zone = await prisma.shippingZone.create({
      data: validatedData,
    });

    return NextResponse.json(zone);
  } catch (error) {
    console.error('Error al crear zona de envío:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Error al crear zona' },
      { status: 500 }
    );
  }
}
