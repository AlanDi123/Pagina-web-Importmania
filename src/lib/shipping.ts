import { prisma } from '@/lib/prisma';
import type { ShippingMethod, ShippingRate, ShippingZone } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

/**
 * Datos para cotizar envío
 */
export interface ShippingQuoteInput {
  postalCode?: string;
  province?: string;
  totalWeight: number; // en gramos
  totalAmount: number; // en ARS
}

/**
 * Resultado de cotización de envío
 */
export interface ShippingQuote {
  method: ShippingMethod;
  name: string;
  price: number;
  originalPrice: number; // Precio antes de aplicar freeAbove
  isFree: boolean;
  estimatedDays: string;
  zoneName: string;
}

/**
 * Provincias de Argentina para matching
 */
const ARGENTINA_PROVINCES = [
  'Buenos Aires',
  'Ciudad Autónoma de Buenos Aires',
  'CABA',
  'Catamarca',
  'Chaco',
  'Chubut',
  'Córdoba',
  'Corrientes',
  'Entre Ríos',
  'Formosa',
  'Jujuy',
  'La Pampa',
  'La Rioja',
  'Mendoza',
  'Misiones',
  'Neuquén',
  'Río Negro',
  'Salta',
  'San Juan',
  'San Luis',
  'Santa Cruz',
  'Santa Fe',
  'Santiago del Estero',
  'Tierra del Fuego',
  'Tucumán',
];

/**
 * Normaliza el nombre de una provincia para matching
 */
function normalizeProvince(province: string): string {
  const normalized = province
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

  // Mapeo de alias
  const aliasMap: Record<string, string> = {
    caba: 'ciudad autonoma de buenos aires',
    'buenos aires': 'buenos aires',
    cordoba: 'cordoba',
    'rio negro': 'rio negro',
  };

  return aliasMap[normalized] || normalized;
}

/**
 * Busca la zona de envío que matchea con el código postal o provincia
 */
async function findMatchingZone(
  postalCode?: string,
  province?: string
): Promise<ShippingZone | null> {
  const zones = await prisma.shippingZone.findMany({
    where: { isActive: true },
    include: {
      rates: {
        where: { isActive: true },
      },
    },
  });

  if (!postalCode && !province) {
    return null;
  }

  const normalizedProvince = province ? normalizeProvince(province) : '';

  for (const zone of zones) {
    // Match por código postal
    if (postalCode && zone.postalCodes.length > 0) {
      const cleanPostalCode = postalCode.replace(/\D/g, '');
      if (zone.postalCodes.includes(cleanPostalCode)) {
        return zone;
      }
    }

    // Match por provincia
    if (normalizedProvince && zone.provinces.length > 0) {
      const normalizedZoneProvinces = zone.provinces.map((p) =>
        normalizeProvince(p)
      );

      if (normalizedZoneProvinces.includes(normalizedProvince)) {
        return zone;
      }
    }
  }

  return null;
}

/**
 * Calcula el precio final del envío aplicando freeAbove si corresponde
 */
function calculateFinalPrice(
  rate: ShippingRate,
  totalAmount: number
): { price: number; originalPrice: number; isFree: boolean } {
  const originalPrice = rate.price.toNumber();

  if (rate.freeAbove) {
    const freeAboveThreshold = rate.freeAbove.toNumber();
    if (totalAmount >= freeAboveThreshold) {
      return { price: 0, originalPrice, isFree: true };
    }
  }

  return { price: originalPrice, originalPrice, isFree: false };
}

/**
 * Cotiza envío para una ubicación y carrito específicos
 */
export async function quoteShipping(
  input: ShippingQuoteInput
): Promise<ShippingQuote[]> {
  const { postalCode, province, totalWeight, totalAmount } = input;

  // Intentar encontrar zona matching
  const zone = await findMatchingZone(postalCode, province);

  if (!zone) {
    // No hay zona configurada para esta ubicación
    // Retornar solo retiro en persona
    return [
      {
        method: 'PICKUP',
        name: 'Retiro en persona',
        price: 0,
        originalPrice: 0,
        isFree: true,
        estimatedDays: 'Inmediato',
        zoneName: 'Local',
      },
    ];
  }

  // Filtrar rates por peso máximo si corresponde
  const applicableRates = zone.rates.filter((rate) => {
    if (!rate.maxWeight) return true;
    return totalWeight <= rate.maxWeight.toNumber();
  });

  // Transformar a ShippingQuote
  const quotes: ShippingQuote[] = applicableRates.map((rate) => {
    const { price, originalPrice, isFree } = calculateFinalPrice(
      rate,
      totalAmount
    );

    return {
      method: rate.method as ShippingMethod,
      name: rate.name,
      price,
      originalPrice,
      isFree,
      estimatedDays: rate.estimatedDays,
      zoneName: zone.name,
    };
  });

  // Siempre incluir retiro en persona
  quotes.push({
    method: 'PICKUP',
    name: 'Retiro en persona',
    price: 0,
    originalPrice: 0,
    isFree: true,
    estimatedDays: 'Inmediato',
    zoneName: 'Local',
  });

  // Ordenar por precio (más barato primero)
  return quotes.sort((a, b) => a.price - b.price);
}

/**
 * Obtiene todas las zonas de envío activas con sus tarifas
 */
export async function getAllShippingZones() {
  return prisma.shippingZone.findMany({
    where: { isActive: true },
    include: {
      rates: {
        orderBy: { price: 'asc' },
      },
    },
    orderBy: { name: 'asc' },
  });
}

/**
 * Valida si un método de envío está disponible para una zona
 */
export async function isShippingMethodAvailable(
  method: ShippingMethod,
  postalCode?: string,
  province?: string
): Promise<boolean> {
  const zone = await findMatchingZone(postalCode, province);

  if (!zone) {
    // Solo retiro en persona disponible
    return method === 'PICKUP';
  }

  return zone.rates.some(
    (rate) => rate.method === method && rate.isActive
  );
}

/**
 * Calcula el costo de envío para un método específico
 */
export async function calculateShippingCost(
  method: ShippingMethod,
  input: ShippingQuoteInput
): Promise<{ price: number; isFree: boolean; estimatedDays: string } | null> {
  const quotes = await quoteShipping(input);
  const quote = quotes.find((q) => q.method === method);

  if (!quote) {
    return null;
  }

  return {
    price: quote.price,
    isFree: quote.isFree,
    estimatedDays: quote.estimatedDays,
  };
}

/**
 * Obtiene el monto mínimo para envío gratis en una zona
 */
export async function getFreeShippingThreshold(
  postalCode?: string,
  province?: string
): Promise<number | null> {
  const zone = await findMatchingZone(postalCode, province);

  if (!zone) {
    return null;
  }

  // Obtener el freeAbove más bajo de todas las tarifas
  const freeAboveValues = zone.rates
    .filter((rate) => rate.freeAbove)
    .map((rate) => rate.freeAbove!.toNumber());

  if (freeAboveValues.length === 0) {
    return null;
  }

  return Math.min(...freeAboveValues);
}

/**
 * Formatea un mensaje de envío para mostrar al usuario
 */
export function formatShippingMessage(quote: ShippingQuote): string {
  if (quote.isFree) {
    return `¡Envío gratis! (${quote.estimatedDays})`;
  }

  const priceFormatted = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(quote.price);

  return `${priceFormatted} (${quote.estimatedDays})`;
}

/**
 * Verifica si el carrito califica para envío gratis
 */
export function qualifiesForFreeShipping(
  totalAmount: number,
  postalCode?: string,
  province?: string
): Promise<boolean> {
  return getFreeShippingThreshold(postalCode, province).then(
    (threshold) => threshold !== null && totalAmount >= threshold
  );
}

export default {
  quoteShipping,
  getAllShippingZones,
  isShippingMethodAvailable,
  calculateShippingCost,
  getFreeShippingThreshold,
  formatShippingMessage,
  qualifiesForFreeShipping,
};
