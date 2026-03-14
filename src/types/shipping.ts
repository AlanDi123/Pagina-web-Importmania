import type { ShippingZone, ShippingRate, ShippingMethod, Address } from '@prisma/client';

/**
 * Zona de envío con tarifas
 */
export interface ShippingZoneWithRates extends ShippingZone {
  rates: ShippingRate[];
}

/**
 * Cotización de envío
 */
export interface ShippingQuote {
  method: ShippingMethod;
  name: string;
  price: number;
  originalPrice: number;
  isFree: boolean;
  estimatedDays: string;
  zoneName: string;
}

/**
 * Datos para cotizar envío
 */
export interface ShippingQuoteInput {
  postalCode?: string;
  province?: string;
  totalWeight: number;
  totalAmount: number;
}

/**
 * Dirección completa para envío
 */
export interface ShippingAddress extends Address {
  fullName?: string;
  phone?: string;
}

/**
 * Método de envío seleccionado
 */
export interface SelectedShippingMethod {
  method: ShippingMethod;
  name: string;
  price: number;
  isFree: boolean;
  estimatedDays: string;
  trackingAvailable: boolean;
}

/**
 * Configuración de zona de envío (formulario admin)
 */
export interface ShippingZoneFormData {
  name: string;
  provinces: string[];
  postalCodes: string[];
  isActive: boolean;
}

/**
 * Configuración de tarifa de envío (formulario admin)
 */
export interface ShippingRateFormData {
  zoneId: string;
  method: ShippingMethod;
  name: string;
  price: number;
  freeAbove?: number | null;
  estimatedDays: string;
  maxWeight?: number | null;
  isActive: boolean;
}

/**
 * Calculadora de envío (resultado)
 */
export interface ShippingCalculatorResult {
  available: boolean;
  quotes: ShippingQuote[];
  message?: string;
  whatsappLink?: string;
}

/**
 * Información de retiro en persona
 */
export interface PickupInfo {
  address: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
  hours: string;
  instructions?: string;
}

/**
 * Estado del envío para tracking
 */
export interface ShippingStatus {
  status: 'pending' | 'processing' | 'shipped' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed' | 'returned';
  statusLabel: string;
  location?: string;
  timestamp: Date;
  description: string;
}

/**
 * Tracking completo de envío
 */
export interface ShippingTracking {
  trackingCode: string;
  carrier: string;
  carrierUrl?: string;
  currentStatus: ShippingStatus;
  history: ShippingStatus[];
  estimatedDelivery?: Date;
  deliveredAt?: Date;
}

/**
 * Provincias de Argentina con códigos
 */
export interface ArgentinaProvince {
  name: string;
  code: string;
  postalCodeRange: { from: string; to: string };
}

/**
 * Configuración de envíos del store
 */
export interface StoreShippingConfig {
  freeShippingThreshold: number;
  defaultWeight: number;
  handlingTime: number; // días hábiles
  pickupEnabled: boolean;
  pickupInfo: PickupInfo;
  whatsappForUnavailable: boolean;
  whatsappNumber: string;
}

/**
 * Resumen de envío para checkout
 */
export interface ShippingSummary {
  method: ShippingMethod;
  methodName: string;
  cost: number;
  isFree: boolean;
  estimatedDays: string;
  address?: ShippingAddress;
  isPickup: boolean;
  pickupInfo?: PickupInfo;
}
