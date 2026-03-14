import MercadoPagoConfig, { Preference, Payment } from 'mercadopago';
import type { PreferenceRequest } from 'mercadopago/dist/clients/preference/commonTypes';

/**
 * Cliente de MercadoPago configurado
 */
const mercadopagoClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || '',
  options: {
    timeout: 5000,
    idempotencyKey: 'random-key',
  },
});

/**
 * Verifica que las credenciales de MercadoPago estén configuradas
 */
export function isMercadoPagoConfigured(): boolean {
  return !!process.env.MP_ACCESS_TOKEN;
}

/**
 * Crea una preferencia de pago en MercadoPago
 * @param preference Datos de la preferencia
 * @returns ID de la preferencia creada
 */
export async function createPreference(
  preference: PreferenceRequest
): Promise<{ id: string; init_point: string }> {
  if (!isMercadoPagoConfigured()) {
    throw new Error('MercadoPago no está configurado');
  }

  try {
    const client = new Preference(mercadopagoClient);
    const result = await client.create({ body: preference });

    return {
      id: result.id,
      init_point: result.init_point,
    };
  } catch (error) {
    console.error('Error al crear preferencia de MercadoPago:', error);
    throw new Error('No se pudo crear la preferencia de pago');
  }
}

/**
 * Busca un pago por su ID de MercadoPago
 */
export async function getPaymentById(paymentId: string) {
  if (!isMercadoPagoConfigured()) {
    throw new Error('MercadoPago no está configurado');
  }

  try {
    const client = new Payment(mercadopagoClient);
    return await client.get({ id: paymentId });
  } catch (error) {
    console.error('Error al obtener pago de MercadoPago:', error);
    throw new Error('No se pudo obtener la información del pago');
  }
}

/**
 * Valida la firma del webhook de MercadoPago
 * @param signature Firma HMAC del webhook
 * @param requestBody Body de la request
 * @returns true si la firma es válida
 */
export function validateWebhookSignature(
  signature: string,
  requestBody: string
): boolean {
  const webhookSecret = process.env.MP_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.warn('MP_WEBHOOK_SECRET no configurado, skipping validation');
    return true;
  }

  const crypto = require('crypto');
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(requestBody, 'utf-8')
    .digest('hex');

  return signature === expectedSignature;
}

/**
 * Mapea el estado de pago de MercadoPago a nuestro sistema
 */
export function mapPaymentStatus(mpStatus: string): 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'PENDING' | 'REFUNDED' {
  const statusMap: Record<string, 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'PENDING' | 'REFUNDED'> = {
    approved: 'APPROVED',
    rejected: 'REJECTED',
    cancelled: 'CANCELLED',
    pending: 'PENDING',
    in_process: 'PENDING',
    in_mediation: 'PENDING',
    charged_back: 'REJECTED',
    refunded: 'REFUNDED',
  };

  return statusMap[mpStatus.toLowerCase()] || 'PENDING';
}

export default mercadopagoClient;
