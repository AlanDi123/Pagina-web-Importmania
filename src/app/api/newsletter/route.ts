import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const newsletterSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = newsletterSchema.parse(body);

    const email = validatedData.email.toLowerCase();

    // Verificar si ya está suscrito
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.isActive) {
        return NextResponse.json(
          { error: 'Ya estás suscrito al newsletter' },
          { status: 400 }
        );
      } else {
        // Reactivar suscripción
        await prisma.newsletterSubscriber.update({
          where: { id: existing.id },
          data: { isActive: true },
        });
      }
    } else {
      // Crear nuevo suscriptor
      await prisma.newsletterSubscriber.create({
        data: {
          email,
          source: 'website',
        },
      });
    }

    return NextResponse.json({
      message: '¡Gracias por suscribirte!',
    });
  } catch (error) {
    console.error('Error al suscribirse:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Error al suscribirse' },
      { status: 500 }
    );
  }
}
