import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { hash, compare } from 'bcryptjs';
import { z } from 'zod';

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Contraseña actual requerida'),
  newPassword: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

/**
 * POST /api/users/change-password
 * Cambia contraseña del usuario
 */
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
    const validatedData = changePasswordSchema.parse(body);

    // Obtener usuario con hashedPassword
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { hashedPassword: true },
    });

    if (!user?.hashedPassword) {
      return NextResponse.json(
        { error: 'Contraseña actual no encontrada' },
        { status: 400 }
      );
    }

    // Verificar contraseña actual
    const isPasswordValid = await compare(validatedData.currentPassword, user.hashedPassword);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Contraseña actual incorrecta' },
        { status: 400 }
      );
    }

    // Hashear nueva contraseña
    const hashedPassword = await hash(validatedData.newPassword, 12);

    // Actualizar contraseña
    await prisma.user.update({
      where: { id: session.user.id },
      data: { hashedPassword },
    });

    return NextResponse.json({
      success: true,
      message: 'Contraseña actualizada exitosamente',
    });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Error al cambiar contraseña' },
      { status: 500 }
    );
  }
}
