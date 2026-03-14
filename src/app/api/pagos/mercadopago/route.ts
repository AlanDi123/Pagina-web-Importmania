import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createPreference } from '@/lib/mercadopago';
import { z } from 'zod';

const checkoutSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    title: z.string(),
    quantity: z.number().int().min(1),
    unit_price: z.number().positive(),
  })),
  orderNumber: z.string(),
});

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
    const validatedData = checkoutSchema.parse(body);

    // Crear preferencia de MercadoPago
    const preference = await createPreference({
      items: validatedData.items,
      payer: {
        email: session.user.email,
        name: session.user.name,
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/failure`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/pending`,
      },
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/pagos/mercadopago/webhook`,
      external_reference: validatedData.orderNumber,
      metadata: {
        userId: session.user.id,
        orderNumber: validatedData.orderNumber,
      },
    });

    return NextResponse.json({
      preferenceId: preference.id,
      initPoint: preference.init_point,
    });
  } catch (error) {
    console.error('Error al crear preferencia:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Error al crear preferencia de pago' },
      { status: 500 }
    );
  }
}
