import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina clases de Tailwind de forma inteligente
 * Elimina clases duplicadas y respeta las utilidades de Tailwind
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Debounce para funciones que se ejecutan frecuentemente
 * @param fn Función a debouncear
 * @param delay Tiempo en ms
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
) {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Throttle para limitar ejecución de funciones
 * @param fn Función a throttlear
 * @param limit Tiempo en ms
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number
) {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Genera un slug a partir de un string
 * Ej: "Producto de Ejemplo" -> "producto-de-ejemplo"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Genera un número de orden único
 * Formato: IMP-YYYY-NNNNN
 */
export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, '0');
  return `IMP-${year}-${random}`;
}

/**
 * Genera un SKU único para productos
 * Formato: PROD-XXXXXX
 */
export function generateSKU(prefix = 'PROD'): string {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${random}`;
}

/**
 * Trunca un texto a una longitud máxima
 * @param text Texto a truncar
 * @param maxLength Longitud máxima
 * @param suffix Sufijo para indicar truncamiento
 */
export function truncate(
  text: string,
  maxLength: number,
  suffix: string = '...'
): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Capitaliza la primera letra de cada palabra
 */
export function capitalize(text: string): string {
  return text
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Remueve HTML tags de un string
 */
export function stripHtml(html: string): string {
  if (typeof window !== 'undefined') {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Verifica si un string es un email válido
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Verifica si un string es un teléfono válido (Argentina)
 */
export function isValidPhoneArgentina(phone: string): boolean {
  const phoneRegex = /^(\+54|0)?11[0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Formatea un número de teléfono argentino
 * Ej: 541112345678 -> +54 11 1234-5678
 */
export function formatPhoneArgentina(phone: string): string {
  const clean = phone.replace(/\D/g, '');
  if (clean.length === 12) {
    return `+${clean.slice(0, 2)} ${clean.slice(2, 4)} ${clean.slice(4, 8)}-${clean.slice(8)}`;
  }
  return phone;
}

/**
 * Obtiene el dominio de una URL
 */
export function getDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}

/**
 * Verifica si estamos en un entorno de desarrollo
 */
export const isDev = process.env.NODE_ENV === 'development';

/**
 * Verifica si estamos en un entorno de producción
 */
export const isProd = process.env.NODE_ENV === 'production';

/**
 * Obtiene la URL base de la aplicación
 */
export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}

/**
 * Convierte un objeto a query string
 */
export function objectToQueryString(obj: Record<string, unknown>): string {
  return Object.entries(obj)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');
}

/**
 * Parsea un query string a objeto
 */
export function parseQueryString(queryString: string): Record<string, string> {
  const params: Record<string, string> = {};
  const search = queryString.startsWith('?') ? queryString.slice(1) : queryString;

  search.split('&').forEach((pair) => {
    const [key, value] = pair.split('=');
    if (key) {
      params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    }
  });

  return params;
}

/**
 * Calcula el porcentaje de descuento
 */
export function calculateDiscountPercentage(
  originalPrice: number,
  salePrice: number
): number {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

/**
 * Verifica si una fecha es válida
 */
export function isValidDate(date: unknown): date is Date {
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Obtiene la diferencia en días entre dos fechas
 */
export function daysBetween(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round((date2.getTime() - date1.getTime()) / oneDay);
}

/**
 * Verifica si una fecha está entre un rango
 */
export function isDateBetween(
  date: Date,
  startDate: Date | null,
  endDate: Date | null
): boolean {
  if (!startDate && !endDate) return true;
  if (startDate && date < startDate) return false;
  if (endDate && date > endDate) return false;
  return true;
}

/**
 * Sleep utility para delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry utility para reintentar operaciones fallidas
 */
export async function retry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    await sleep(delay);
    return retry(fn, retries - 1, delay * 2);
  }
}
