import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { mediaSchema } from '@/lib/validators';

/**
 * GET /api/media
 * Obtiene todos los archivos multimedia
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const media = await prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({
      success: true,
      data: media,
    });
  } catch (error) {
    console.error('Error al obtener medios:', error);
    return NextResponse.json(
      { error: 'Error al obtener los medios' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/media
 * Registra un nuevo archivo multimedia en la base de datos
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
    const validatedData = mediaSchema.parse(body);

    const media = await prisma.media.create({
      data: validatedData,
    });

    return NextResponse.json({
      success: true,
      data: media,
    });
  } catch (error) {
    console.error('Error al registrar medio:', error);

    if (error instanceof Error && 'errors' in error) {
      const zodError = error as import('zod').ZodError;
      return NextResponse.json(
        { error: 'Validación fallida', details: zodError.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error al registrar el medio' },
      { status: 500 }
    );
  }
}
