import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/config
 * Retorna toda la configuración de la tienda
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

    const config = await prisma.storeConfig.findMany();
    const configObj = Object.fromEntries(config.map((c) => [c.key, c.value]));

    return NextResponse.json(configObj);
  } catch (error) {
    console.error('Error al obtener configuración:', error);
    return NextResponse.json(
      { error: 'Error al obtener configuración' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/config
 * Guarda configuración de la tienda
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

    // Guardar cada key-value como StoreConfig
    const updates = Object.entries(body).map(async ([key, value]) => {
      await prisma.storeConfig.upsert({
        where: { key },
        update: { value: value as object },
        create: { key, value: value as object },
      });
    });

    await Promise.all(updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al guardar configuración:', error);
    return NextResponse.json(
      { error: 'Error al guardar configuración' },
      { status: 500 }
    );
  }
}
