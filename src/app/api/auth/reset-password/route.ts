import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { z } from 'zod';

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token requerido'),
  newPassword: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

/**
 * POST /api/auth/reset-password
 * Resetea contraseña con token válido
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = resetPasswordSchema.parse(body);

    // Buscar token válido
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token: validatedData.token },
    });

    if (!verificationToken || verificationToken.expires < new Date()) {
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 400 }
      );
    }

    // Hashear nueva contraseña
    const hashedPassword = await hash(validatedData.newPassword, 12);

    // Actualizar contraseña del usuario
    await prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { hashedPassword },
    });

    // Eliminar token usado
    await prisma.verificationToken.delete({
      where: { token: validatedData.token },
    });

    return NextResponse.json({
      success: true,
      message: 'Contraseña actualizada exitosamente',
    });
  } catch (error) {
    console.error('Error en reset-password:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Error al resetear contraseña' },
      { status: 500 }
    );
  }
}
