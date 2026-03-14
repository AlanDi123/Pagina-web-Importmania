import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const notificationConfigSchema = z.object({
  adminEmail: z.string().email().optional(),
  notificationConfig: z.array(z.object({
    type: z.string(),
    label: z.string(),
    inApp: z.boolean(),
    email: z.boolean(),
    push: z.boolean(),
    whatsapp: z.boolean(),
  })).optional(),
});

/**
 * POST /api/notificaciones/config
 * Guarda configuración de notificaciones
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
    const validatedData = notificationConfigSchema.parse(body);

    const updates: Promise<any>[] = [];

    if (validatedData.adminEmail) {
      updates.push(
        prisma.storeConfig.upsert({
          where: { key: 'notification_admin_email' },
          update: { value: validatedData.adminEmail },
          create: { key: 'notification_admin_email', value: validatedData.adminEmail },
        })
      );
    }

    if (validatedData.notificationConfig) {
      updates.push(
        prisma.storeConfig.upsert({
          where: { key: 'notification_config' },
          update: { value: validatedData.notificationConfig },
          create: { key: 'notification_config', value: validatedData.notificationConfig },
        })
      );
    }

    await Promise.all(updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al guardar configuración de notificaciones:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Error al guardar configuración' },
      { status: 500 }
    );
  }
}
