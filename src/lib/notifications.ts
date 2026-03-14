import webPush from 'web-push';
import { prisma } from '@/lib/prisma';
import type { NotificationType, NotificationChannel } from '@prisma/client';

/**
 * Configura VAPID para Web Push Notifications
 */
export function configureWebPush() {
  if (!process.env.WEB_PUSH_PUBLIC_KEY || !process.env.WEB_PUSH_PRIVATE_KEY) {
    console.warn('Web Push keys no configuradas');
    return false;
  }

  webPush.setVapidDetails(
    process.env.WEB_PUSH_SUBJECT || 'mailto:soporte@importmania.com.ar',
    process.env.WEB_PUSH_PUBLIC_KEY,
    process.env.WEB_PUSH_PRIVATE_KEY
  );

  return true;
}

/**
 * Envía notificación push a un usuario específico
 */
export async function sendPushNotification(
  userId: string,
  title: string,
  message: string,
  data?: Record<string, unknown>
): Promise<{ success: boolean; error?: string }> {
  if (!configureWebPush()) {
    return { success: false, error: 'Web Push no configurado' };
  }

  try {
    // Obtener suscripciones push del usuario
    const subscriptions = await prisma.notification.findMany({
      where: { userId },
      select: { data: true },
    });

    // Filtrar suscripciones push válidas
    const pushSubscriptions = subscriptions
      .filter((n) => n.data && typeof n.data === 'object' && (n.data as Record<string, unknown>).pushSubscription)
      .map((n) => (n.data as Record<string, unknown>).pushSubscription as PushSubscriptionJSON);

    if (pushSubscriptions.length === 0) {
      return { success: false, error: 'Usuario no tiene suscripciones push' };
    }

    const payload = JSON.stringify({
      title,
      body: message,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      data: {
        ...data,
        url: data?.url || '/cuenta/notificaciones',
      },
    });

    const results = await Promise.allSettled(
      pushSubscriptions.map(async (subscription) => {
        try {
          await webPush.sendNotification(subscription as PushSubscription, payload);
          return true;
        } catch (error) {
          console.error('Error enviando push notification:', error);
          return false;
        }
      })
    );

    const successCount = results.filter((r) => r.status === 'fulfilled' && r.value).length;

    return {
      success: successCount > 0,
      error: successCount === 0 ? 'No se pudo enviar ninguna notificación' : undefined,
    };
  } catch (error) {
    console.error('Error en sendPushNotification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Envía notificación por email
 */
export async function sendEmailNotification(
  to: string,
  type: NotificationType,
  title: string,
  message: string,
  data?: Record<string, unknown>
): Promise<{ success: boolean; error?: string }> {
  try {
    const { sendEmail } = await import('@/lib/email');

    // Mapear tipo de notificación a template de email
    const templateMap: Record<NotificationType, string> = {
      NEW_ORDER: 'order-confirmation',
      PAYMENT_RECEIVED: 'payment-received',
      ORDER_SHIPPED: 'shipping-update',
      ORDER_DELIVERED: 'order-delivered',
      LOW_STOCK: 'low-stock',
      NEW_REVIEW: 'new-review',
      NEW_USER: 'welcome',
      ABANDONED_CART: 'abandoned-cart',
      REFERRAL_COMPLETED: 'referral-completed',
      SYSTEM: 'system',
    };

    // Importar template dinámicamente según el tipo
    // Por ahora usamos un template genérico
    const reactComponent = await createNotificationEmail({
      type,
      title,
      message,
      data,
    });

    const result = await sendEmail({
      to,
      subject: title,
      reactComponent,
    });

    return result;
  } catch (error) {
    console.error('Error en sendEmailNotification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Crea componente de email para notificación
 */
async function createNotificationEmail({
  type,
  title,
  message,
  data,
}: {
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
}) {
  const { NotificationEmail } = await import('@/emails/NotificationEmail');
  return NotificationEmail({ type, title, message, data });
}

/**
 * Envía notificación por WhatsApp (usando API de WhatsApp Business)
 * Nota: Implementación básica, requiere configuración de WhatsApp Business API
 */
export async function sendWhatsAppNotification(
  phoneNumber: string,
  message: string
): Promise<{ success: boolean; error?: string }> {
  // Implementación placeholder para WhatsApp
  // En producción, usar WhatsApp Business API o servicio como Twilio
  console.log(`WhatsApp a ${phoneNumber}: ${message}`);
  return { success: true };
}

/**
 * Envía notificación multi-canal según configuración
 */
export async function sendMultiChannelNotification({
  userId,
  type,
  title,
  message,
  channels,
  data,
}: {
  userId: string | null;
  type: NotificationType;
  title: string;
  message: string;
  channels: NotificationChannel[];
  data?: Record<string, unknown>;
}): Promise<{
  inApp: boolean;
  email: boolean;
  push: boolean;
  whatsapp: boolean;
}> {
  const results = {
    inApp: false,
    email: false,
    push: false,
    whatsapp: false,
  };

  // Notificación in-app (siempre se guarda en DB)
  if (userId) {
    try {
      await prisma.notification.create({
        data: {
          userId,
          type,
          title,
          message,
          data: data as object | null,
          channel: 'IN_APP',
        },
      });
      results.inApp = true;
    } catch (error) {
      console.error('Error guardando notificación in-app:', error);
    }
  }

  // Email
  if (channels.includes('EMAIL') && userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (user?.email) {
      const emailResult = await sendEmailNotification(
        user.email,
        type,
        title,
        message,
        data
      );
      results.email = emailResult.success;
    }
  }

  // Push
  if (channels.includes('PUSH') && userId) {
    const pushResult = await sendPushNotification(userId, title, message, data);
    results.push = pushResult.success;
  }

  // WhatsApp
  if (channels.includes('WHATSAPP') && userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { phone: true },
    });

    if (user?.phone) {
      const whatsappResult = await sendWhatsAppNotification(user.phone, message);
      results.whatsapp = whatsappResult.success;
    }
  }

  return results;
}

/**
 * Obtiene notificaciones no leídas de un usuario
 */
export async function getUnreadNotifications(userId: string) {
  return prisma.notification.findMany({
    where: {
      userId,
      isRead: false,
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
}

/**
 * Marca notificación como leída
 */
export async function markNotificationAsRead(notificationId: string) {
  return prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
}

/**
 * Marca todas las notificaciones como leídas
 */
export async function markAllNotificationsAsRead(userId: string) {
  return prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },
    data: { isRead: true },
  });
}

/**
 * Obtiene conteo de notificaciones no leídas
 */
export async function getUnreadCount(userId: string): Promise<number> {
  return prisma.notification.count({
    where: {
      userId,
      isRead: false,
    },
  });
}

/**
 * Genera VAPID keys para Web Push
 * Ejecutar una vez para generar las keys
 */
export function generateVapidKeys() {
  return webPush.generateVAPIDKeys();
}

export default {
  configureWebPush,
  sendPushNotification,
  sendEmailNotification,
  sendWhatsAppNotification,
  sendMultiChannelNotification,
  getUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadCount,
  generateVapidKeys,
};
