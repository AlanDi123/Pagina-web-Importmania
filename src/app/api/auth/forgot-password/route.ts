import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';
import { hash } from 'bcryptjs';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});

/**
 * POST /api/auth/forgot-password
 * Genera token de reseteo y envía email
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = forgotPasswordSchema.parse(body);
    const email = validatedData.email.toLowerCase();

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Siempre retornar 200 para evitar enumeración de usuarios
    if (!user) {
      return NextResponse.json({ success: true, message: 'Si el email existe, recibirás un link de recuperación' });
    }

    // Generar token
    const token = await hash(`${email}-${Date.now()}-${Math.random()}`, 12);
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

    // Guardar token (reutilizamos VerificationToken)
    await prisma.verificationToken.upsert({
      where: {
        identifier_token: {
          identifier: email,
          token,
        },
      },
      create: {
        identifier: email,
        token,
        expires,
      },
      update: {
        expires,
      },
    });

    // Enviar email
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${encodeURIComponent(token)}`;
    
    try {
      await sendPasswordResetEmail(email, resetUrl);
    } catch (emailError) {
      console.error('Error al enviar email de reset:', emailError);
      // No fallamos si el email falla, pero logueamos
    }

    return NextResponse.json({
      success: true,
      message: 'Si el email existe, recibirás un link de recuperación',
    });
  } catch (error) {
    console.error('Error en forgot-password:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Error al procesar solicitud' },
      { status: 500 }
    );
  }
}
