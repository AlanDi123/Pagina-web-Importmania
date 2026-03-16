import { z } from 'zod';
import { themeGlobalSettingsSchema, themeSchema, pageSchema, mediaSchema } from '@/lib/validators';

// =============================================
// TIPOS PARA THEME
// =============================================

/**
 * Tipo inferido para la configuración global del tema
 * Requiere: primaryColor, secondaryColor, fontFamily, logoUrl
 * Opcional: faviconUrl
 */
export type ThemeGlobalSettings = z.infer<typeof themeGlobalSettingsSchema>;

/**
 * Tipo estricto para Theme con validación de globalSettings
 */
export type Theme = z.infer<typeof themeSchema>;

/**
 * Tipo para crear un nuevo tema (sin id ni timestamps)
 */
export type CreateThemeInput = z.input<typeof themeSchema>;

// =============================================
// TIPOS PARA PAGE
// =============================================

/**
 * Tipo inferido para Page
 */
export type Page = z.infer<typeof pageSchema>;

/**
 * Tipo para crear una nueva página
 */
export type CreatePageInput = z.input<typeof pageSchema>;

// =============================================
// TIPOS PARA MEDIA
// =============================================

/**
 * Tipo inferido para Media
 */
export type Media = z.infer<typeof mediaSchema>;

/**
 * Tipo para crear un nuevo archivo multimedia
 */
export type CreateMediaInput = z.input<typeof mediaSchema>;

// =============================================
// UTILIDADES DE VALIDACIÓN
// =============================================

/**
 * Valida que los settings del tema sean correctos
 * @throws {z.ZodError} Si la validación falla
 */
export function validateThemeGlobalSettings(data: unknown): ThemeGlobalSettings {
  return themeGlobalSettingsSchema.parse(data);
}

/**
 * Valida de forma segura los settings del tema
 * @returns Objeto con success, data (si éxito) o error (si falla)
 */
export function safeValidateThemeGlobalSettings(
  data: unknown
): { success: true; data: ThemeGlobalSettings } | { success: false; error: z.ZodError } {
  return themeGlobalSettingsSchema.safeParse(data) as 
    | { success: true; data: ThemeGlobalSettings }
    | { success: false; error: z.ZodError };
}
