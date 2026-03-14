import { Resend } from 'resend';
import { render } from '@react-email/components';
import type { ReactElement } from 'react';

/**
 * Cliente de Resend para envío de emails
 */
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

/**
 * Verifica que Resend esté configurado
 */
export function isEmailConfigured(): boolean {
  return !!resend && !!process.env.RESEND_API_KEY;
}

/**
 * Tipos de emails soportados
 */
export type EmailType =
  | 'welcome'
  | 'order-confirmation'
  | 'shipping-update'
  | 'abandoned-cart'
  | 'password-reset'
  | 'review-request'
  | 'referral-invite'
  | 'newsletter'
  | 'transfer-pending'
  | 'transfer-approved'
  | 'transfer-rejected'
  | 'new-order-admin'
  | 'low-stock-alert';

/**
 * Datos comunes para todos los emails
 */
export interface EmailBaseData {
  to: string | string[];
  subject: string;
}

/**
 * Envía un email usando Resend
 * @param to Destinatario(s)
 * @param subject Asunto del email
 * @param reactComponent Componente React Email a renderizar
 * @param headers Headers adicionales
 */
export async function sendEmail({
  to,
  subject,
  reactComponent,
  headers,
}: {
  to: string | string[];
  subject: string;
  reactComponent: ReactElement;
  headers?: Record<string, string>;
}): Promise<{ success: boolean; error?: string; id?: string }> {
  if (!resend) {
    console.warn('Resend no está configurado. Email no enviado.');
    console.log('Email preview:', await render(reactComponent));
    return { success: false, error: 'Resend no configurado' };
  }

  try {
    const html = await render(reactComponent, { pretty: true });

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'iMPORTMANIA <onboarding@resend.dev>',
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      headers,
    });

    if (error) {
      console.error('Error al enviar email:', error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (error) {
    console.error('Error al enviar email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Envía email de bienvenida a nuevo usuario
 */
export async function sendWelcomeEmail(to: string, name: string, referralCode?: string) {
  // Se importará dinámicamente el template cuando exista
  const { WelcomeEmail } = await import('@/emails/WelcomeEmail');
  const reactComponent = WelcomeEmail({ name, referralCode });

  return sendEmail({
    to,
    subject: '¡Bienvenido a iMPORTMANIA! 🎉',
    reactComponent,
  });
}

/**
 * Envía email de confirmación de pedido
 */
export async function sendOrderConfirmationEmail(
  to: string,
  orderData: {
    orderNumber: string;
    total: string;
    items: Array<{ name: string; quantity: number; price: string }>;
    shippingMethod: string;
    estimatedDelivery?: string;
  }
) {
  const { OrderConfirmation } = await import('@/emails/OrderConfirmation');
  const reactComponent = OrderConfirmation(orderData);

  return sendEmail({
    to,
    subject: `Confirmación de pedido ${orderData.orderNumber}`,
    reactComponent,
  });
}

/**
 * Envía email de actualización de envío
 */
export async function sendShippingUpdateEmail(
  to: string,
  orderNumber: string,
  status: string,
  trackingCode?: string,
  trackingUrl?: string
) {
  const { ShippingUpdate } = await import('@/emails/ShippingUpdate');
  const reactComponent = ShippingUpdate({
    orderNumber,
    status,
    trackingCode,
    trackingUrl,
  });

  return sendEmail({
    to,
    subject: `Actualización de tu pedido ${orderNumber}`,
    reactComponent,
  });
}

/**
 * Envía email de carrito abandonado
 */
export async function sendAbandonedCartEmail(
  to: string,
  data: {
    userName: string;
    items: Array<{ name: string; price: string; image?: string }>;
    total: string;
    recoveryUrl: string;
  }
) {
  const { AbandonedCart } = await import('@/emails/AbandonedCart');
  const reactComponent = AbandonedCart({
    userName: data.userName,
    items: data.items,
    total: data.total,
    recoveryUrl: data.recoveryUrl,
  });

  return sendEmail({
    to,
    subject: '¿Olvidaste algo en tu carrito? 🛒',
    reactComponent,
  });
}

/**
 * Envía email de reseteo de contraseña
 */
export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const { PasswordReset } = await import('@/emails/PasswordReset');
  const reactComponent = PasswordReset({ resetUrl });

  return sendEmail({
    to,
    subject: 'Recuperar tu contraseña - iMPORTMANIA',
    reactComponent,
  });
}

/**
 * Envía email de solicitud de reseña
 */
export async function sendReviewRequestEmail(
  to: string,
  productName: string,
  reviewUrl: string
) {
  const { ReviewRequest } = await import('@/emails/ReviewRequest');
  const reactComponent = ReviewRequest({ productName, reviewUrl });

  return sendEmail({
    to,
    subject: `¿Qué te pareció tu ${productName}?`,
    reactComponent,
  });
}

/**
 * Envía notificación al admin sobre nuevo pedido
 */
export async function sendNewOrderAdminEmail(
  to: string,
  orderNumber: string,
  total: string,
  customerName: string
) {
  const { NewOrderAdmin } = await import('@/emails/NewOrderAdmin');
  const reactComponent = NewOrderAdmin({ orderNumber, total, customerName });

  return sendEmail({
    to,
    subject: `🆕 Nuevo pedido: ${orderNumber}`,
    reactComponent,
  });
}

/**
 * Envía alerta de stock bajo
 */
export async function sendLowStockAlertEmail(
  to: string,
  productName: string,
  currentStock: number,
  threshold: number
) {
  const { LowStockAlert } = await import('@/emails/LowStockAlert');
  const reactComponent = LowStockAlert({ productName, currentStock, threshold });

  return sendEmail({
    to,
    subject: `⚠️ Stock bajo: ${productName}`,
    reactComponent,
  });
}

export default resend;
