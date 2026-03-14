import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createReferralSchema = z.object({
  referralCode: z.string(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Obtener usuario con su código de referido
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        referralCode: true,
        referralsMade: {
          include: {
            referred: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Calcular estadísticas
    const totalReferrals = user.referralsMade.length;
    const completedReferrals = user.referralsMade.filter((r) => r.status === 'COMPLETED' || r.status === 'REWARDED').length;
    const pendingReferrals = user.referralsMade.filter((r) => r.status === 'PENDING').length;
    const rewardedReferrals = user.referralsMade.filter((r) => r.status === 'REWARDED').length;

    // Calcular ganancias totales (asumiendo 10% por referido completado)
    const totalEarnings = rewardedReferrals * 1000; // Ejemplo: $1000 por referido

    return NextResponse.json({
      referralCode: user.referralCode,
      referralUrl: `${process.env.NEXT_PUBLIC_APP_URL}/?ref=${user.referralCode}`,
      totalReferrals,
      completedReferrals,
      pendingReferrals,
      rewardedReferrals,
      totalEarnings,
      conversionRate: totalReferrals > 0 ? (completedReferrals / totalReferrals) * 100 : 0,
      referrals: user.referralsMade.map((r) => ({
        id: r.id,
        referredName: r.referred.name,
        referredEmail: r.referred.email,
        status: r.status,
        createdAt: r.createdAt,
        completedAt: r.completedAt,
      })),
    });
  } catch (error) {
    console.error('Error al obtener referidos:', error);
    return NextResponse.json(
      { error: 'Error al obtener referidos' },
      { status: 500 }
    );
  }
}

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
    const validatedData = createReferralSchema.parse(body);

    // Buscar al referrer por su código
    const referrer = await prisma.user.findUnique({
      where: { referralCode: validatedData.referralCode },
    });

    if (!referrer) {
      return NextResponse.json(
        { error: 'Código de referido inválido' },
        { status: 400 }
      );
    }

    // Verificar que no se refiere a sí mismo
    if (referrer.id === session.user.id) {
      return NextResponse.json(
        { error: 'No puedes usar tu propio código de referido' },
        { status: 400 }
      );
    }

    // Verificar si ya existe un referral
    const existingReferral = await prisma.referral.findUnique({
      where: {
        referrerId_referredId: {
          referrerId: referrer.id,
          referredId: session.user.id,
        },
      },
    });

    if (existingReferral) {
      return NextResponse.json(
        { message: 'Referido ya registrado' },
        { status: 200 }
      );
    }

    // Crear referral
    await prisma.referral.create({
      data: {
        referrerId: referrer.id,
        referredId: session.user.id,
        status: 'PENDING',
      },
    });

    // Actualizar el referido con el código del referrer
    await prisma.user.update({
      where: { id: session.user.id },
      data: { referredBy: referrer.referralCode },
    });

    return NextResponse.json({
      message: 'Referido registrado exitosamente',
    });
  } catch (error) {
    console.error('Error al registrar referido:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Error al registrar referido' },
      { status: 500 }
    );
  }
}

/**
 * Endpoint interno para completar un referido (se llama cuando el referido hace su primera compra)
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { referredId } = z.object({ referredId: z.string() }).parse(body);

    // Buscar el referral
    const referral = await prisma.referral.findFirst({
      where: {
        referredId,
        status: 'PENDING',
      },
      include: {
        referrer: true,
        referred: true,
      },
    });

    if (!referral) {
      return NextResponse.json({ message: 'No hay referral pendiente' });
    }

    // Obtener configuración de recompensas
    const config = await prisma.storeConfig.findMany({
      where: {
        key: { in: ['referral_reward_type', 'referral_reward_value'] },
      },
    });

    const configMap = Object.fromEntries(config.map((c) => [c.key, c.value]));
    const rewardType = (configMap['referral_reward_type'] as string) || 'PERCENTAGE';
    const rewardValue = parseFloat(configMap['referral_reward_value'] as string) || 10;

    // Actualizar referral a COMPLETED
    await prisma.referral.update({
      where: { id: referral.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        rewardType: rewardType as any,
        rewardValue,
      },
    });

    // Generar cupón de recompensa para el referrer
    const couponCode = `REF-${Date.now().toString(36).toUpperCase()}`;
    await prisma.coupon.create({
      data: {
        code: couponCode,
        description: `Recompensa por referido: ${referral.referred.name}`,
        type: rewardType as any,
        value: rewardValue,
        perUserLimit: 1,
        isActive: true,
      },
    });

    // Notificar al referrer
    await prisma.notification.create({
      data: {
        userId: referral.referrerId,
        type: 'REFERRAL_COMPLETED',
        title: '¡Referido completado!',
        message: `${referral.referred.name} realizó su primera compra. Ganaste un cupón de ${rewardValue}${rewardType === 'PERCENTAGE' ? '%' : ' ARS'}.`,
        data: { couponCode, referralId: referral.id },
        channel: 'IN_APP',
      },
    });

    return NextResponse.json({
      message: 'Referido completado exitosamente',
      couponCode,
    });
  } catch (error) {
    console.error('Error al completar referido:', error);
    return NextResponse.json(
      { error: 'Error al completar referido' },
      { status: 500 }
    );
  }
}
