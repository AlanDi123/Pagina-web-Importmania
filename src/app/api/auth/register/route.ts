import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { sendWelcomeEmail } from '@/lib/email';

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional(),
  referralCode: z.string().optional(),
  newsletter: z.boolean().default(false),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 400 }
      );
    }

    // Hashear contraseña
    const hashedPassword = await hash(validatedData.password, 12);

    // Generar código de referido único
    const referralCode = validatedData.referralCode || `ref-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

    // Verificar código de referido (si existe)
    let referrerId: string | null = null;
    if (validatedData.referralCode) {
      const referrer = await prisma.user.findUnique({
        where: { referralCode: validatedData.referralCode },
      });
      if (referrer && referrer.email !== validatedData.email) {
        referrerId = referrer.id;
      }
    }

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email: validatedData.email.toLowerCase(),
        name: validatedData.name,
        hashedPassword,
        phone: validatedData.phone,
        referralCode,
        referredBy: referrerId || undefined,
        isActive: true,
      },
    });

    // Suscribirse al newsletter si corresponde
    if (validatedData.newsletter) {
      await prisma.newsletterSubscriber.create({
        data: {
          email: validatedData.email.toLowerCase(),
          source: 'registro',
        },
      });
    }

    // Crear referido si hay referrer
    if (referrerId) {
      await prisma.referral.create({
        data: {
          referrerId,
          referredId: user.id,
          status: 'PENDING',
        },
      });
    }

    // Enviar email de bienvenida
    await sendWelcomeEmail(user.email, user.name || 'Usuario', referralCode);

    // No retornar contraseña
    const { hashedPassword: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        message: 'Usuario creado exitosamente',
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error en registro:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error al crear usuario' },
      { status: 500 }
    );
  }
}
