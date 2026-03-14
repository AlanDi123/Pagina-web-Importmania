import { Decimal } from '@prisma/client/runtime/library';

/**
 * Formatea un número a pesos argentinos (ARS)
 * Formato: $ 15.000,00 (punto de miles, coma decimal)
 */
export function formatARS(amount: number | Decimal | string | null | undefined): string {
  if (amount === null || amount === undefined) return '$ 0,00';

  const numAmount = typeof amount === 'string'
    ? parseFloat(amount)
    : amount instanceof Decimal
      ? amount.toNumber()
      : amount;

  if (isNaN(numAmount)) return '$ 0,00';

  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numAmount);
}

/**
 * Formatea un número a pesos argentinos sin símbolo
 * Formato: 15.000,00
 */
export function formatARSNoSymbol(
  amount: number | Decimal | string | null | undefined
): string {
  const formatted = formatARS(amount);
  return formatted.replace('$', '').trim();
}

/**
 * Formatea un número entero con separador de miles
 * Formato: 15.000
 */
export function formatNumber(num: number | string): string {
  const numValue = typeof num === 'string' ? parseFloat(num) : num;

  if (isNaN(numValue)) return '0';

  return new Intl.NumberFormat('es-AR').format(numValue);
}

/**
 * Formatea una fecha a formato argentino
 * Ej: 7 de marzo de 2024
 */
export function formatDateES(date: Date | string | null | undefined): string {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return '';

  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(dateObj);
}

/**
 * Formatea una fecha corta
 * Ej: 07/03/2024
 */
export function formatDateShort(date: Date | string | null | undefined): string {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return '';

  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(dateObj);
}

/**
 * Formatea una fecha con hora
 * Ej: 7 de marzo de 2024, 15:30
 */
export function formatDateWithTime(date: Date | string | null | undefined): string {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return '';

  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}

/**
 * Formatea una fecha relativa (hace X tiempo)
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'justo ahora';
  if (diffMins < 60) return `hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
  if (diffHours < 24) return `hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
  if (diffDays < 7) return `hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;

  return formatDateES(date);
}

/**
 * Calcula el tiempo estimado de entrega
 * @param days Días hábiles estimados
 */
export function formatEstimatedDelivery(days: number): string {
  if (days <= 0) return 'Inmediato';
  if (days === 1) return '1 día hábil';
  if (days <= 5) return `${days} días hábiles`;

  const weeks = Math.floor(days / 5);
  const remainingDays = days % 5;

  if (remainingDays === 0) {
    return weeks === 1 ? '1 semana hábil' : `${weeks} semanas hábiles`;
  }

  return `${weeks} semana${weeks > 1 ? 's' : ''} y ${remainingDays} día${remainingDays > 1 ? 's' : ''} hábiles`;
}

/**
 * Formatea dimensiones (largo x ancho x alto)
 */
export function formatDimensions(
  dimensions: { length?: number; width?: number; height?: number } | null | undefined
): string {
  if (!dimensions) return '';

  const { length, width, height } = dimensions;

  if (!length || !width || !height) return '';

  return `${length} x ${width} x ${height} cm`;
}

/**
 * Formatea peso en gramos o kilogramos
 */
export function formatWeight(weight: number | Decimal | string | null | undefined): string {
  if (weight === null || weight === undefined) return '';

  const numWeight = typeof weight === 'string'
    ? parseFloat(weight)
    : weight instanceof Decimal
      ? weight.toNumber()
      : weight;

  if (isNaN(numWeight)) return '';

  if (numWeight >= 1000) {
    return `${(numWeight / 1000).toFixed(2)} kg`;
  }

  return `${numWeight} g`;
}

/**
 * Formatea tamaño de archivo (bytes a KB, MB, GB)
 */
export function formatFileSize(bytes: number | string): string {
  const numBytes = typeof bytes === 'string' ? parseInt(bytes, 10) : bytes;

  if (isNaN(numBytes)) return '';
  if (numBytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(numBytes) / Math.log(k));

  return `${parseFloat((numBytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Formatea porcentaje
 */
export function formatPercentage(value: number | Decimal | string): string {
  const numValue = typeof value === 'string'
    ? parseFloat(value)
    : value instanceof Decimal
      ? value.toNumber()
      : value;

  if (isNaN(numValue)) return '0%';

  return `${numValue.toFixed(2)}%`;
}

/**
 * Abrevia números grandes (1.5K, 2.3M)
 */
export function abbreviateNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Formatea rating con estrellas
 */
export function formatRating(rating: number | Decimal | string): string {
  const numRating = typeof rating === 'string'
    ? parseFloat(rating)
    : rating instanceof Decimal
      ? rating.toNumber()
      : rating;

  if (isNaN(numRating)) return '0.0';

  return numRating.toFixed(1);
}
