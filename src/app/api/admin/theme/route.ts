import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { themeSchema } from '@/lib/validators';

/**
 * GET /api/admin/theme
 * Obtiene el tema activo de la tienda
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Buscar el tema activo
    let activeTheme = await prisma.theme.findFirst({
      where: { isActive: true },
    });

    // Si no hay tema activo, crear uno por defecto
    if (!activeTheme) {
      activeTheme = await prisma.theme.create({
        data: {
          name: 'Tema Principal',
          isActive: true,
          globalSettings: {
            primaryColor: '#000000',
            secondaryColor: '#6b7280',
            fontFamily: 'Inter',
            logoUrl: '',
            faviconUrl: '',
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: activeTheme,
    });
  } catch (error) {
    console.error('Error al obtener tema:', error);
    return NextResponse.json(
      { error: 'Error al obtener el tema' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/theme
 * Actualiza el tema activo de la tienda
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

    const body = await request.json();

    // Validar datos con Zod
    const validatedData = themeSchema.parse(body);

    // Desactivar todos los temas primero
    await prisma.theme.updateMany({
      data: { isActive: false },
    });

    // Buscar si existe un tema para actualizar o crear uno nuevo
    const existingTheme = await prisma.theme.findFirst({
      where: { isActive: false },
      orderBy: { updatedAt: 'desc' },
    });

    let updatedTheme;

    if (existingTheme) {
      // Actualizar el tema existente
      updatedTheme = await prisma.theme.update({
        where: { id: existingTheme.id },
        data: {
          name: validatedData.name,
          isActive: true,
          globalSettings: validatedData.globalSettings as unknown as import('@prisma/client').Prisma.InputJsonValue,
        },
      });
    } else {
      // Crear nuevo tema
      updatedTheme = await prisma.theme.create({
        data: {
          name: validatedData.name,
          isActive: true,
          globalSettings: validatedData.globalSettings as unknown as import('@prisma/client').Prisma.InputJsonValue,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: updatedTheme,
      message: 'Tema actualizado correctamente',
    });
  } catch (error) {
    console.error('Error al actualizar tema:', error);

    if (error instanceof Error && 'errors' in error) {
      const zodError = error as import('zod').ZodError;
      return NextResponse.json(
        { error: 'Validación fallida', details: zodError.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error al actualizar el tema' },
      { status: 500 }
    );
  }
}
