import { prisma } from '@/lib/prisma';
import type { ThemeGlobalSettings, HomeSection } from '@/lib/validators';

/**
 * Configuración de tema por defecto (fallback)
 * Se usa cuando no hay tema activo en la base de datos
 * o cuando ocurre un error al cargar el tema
 */
export const DEFAULT_THEME_SETTINGS: ThemeGlobalSettings = {
  primaryColor: '#00BFFF',      // Celeste iMPORTMANIA
  secondaryColor: '#2ECC71',    // Verde iMPORTMANIA
  fontFamily: 'Inter',
  logoUrl: '',
  faviconUrl: '',
  homeSections: [
    {
      id: 'default-hero',
      type: 'HERO_BANNER',
      order: 0,
      isVisible: true,
      props: {
        title: 'Bienvenido a iMPORTMANIA',
        subtitle: 'Productos importados de calidad',
        buttonText: 'Ver Productos',
        buttonLink: '/productos',
      },
    },
    {
      id: 'default-featured',
      type: 'FEATURED_PRODUCTS',
      order: 1,
      isVisible: true,
      props: {
        title: 'Productos Destacados',
        productsCount: 8,
        showRating: true,
      },
    },
  ],
};

/**
 * Tipos de temas soportados
 */
export interface ThemeConfig {
  id: string;
  name: string;
  isActive: boolean;
  globalSettings: ThemeGlobalSettings;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Obtiene el tema activo de la base de datos con graceful degradation
 * @returns Promise con la configuración del tema o el tema por defecto
 */
export async function getActiveTheme(): Promise<ThemeConfig | null> {
  try {
    const theme = await prisma.theme.findFirst({
      where: { isActive: true },
    });

    if (!theme) {
      return null;
    }

    return {
      ...theme,
      // Asegurar que globalSettings tenga la estructura correcta
      globalSettings: {
        ...DEFAULT_THEME_SETTINGS,
        ...(theme.globalSettings as ThemeGlobalSettings),
      },
    };
  } catch (error) {
    console.error('Error al cargar el tema activo:', error);
    return null;
  }
}

/**
 * Obtiene el tema activo o retorna el tema por defecto
 * Útil para componentes que necesitan el tema sí o sí
 * @returns Promise con la configuración del tema (nunca null)
 */
export async function getActiveThemeOrDefault(): Promise<ThemeConfig> {
  const theme = await getActiveTheme();

  if (!theme) {
    return {
      id: 'default',
      name: 'Tema por Defecto',
      isActive: false,
      globalSettings: DEFAULT_THEME_SETTINGS,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  return theme;
}

/**
 * Obtiene solo la configuración global del tema activo
 * @returns Promise con ThemeGlobalSettings o el default
 */
export async function getThemeSettings(): Promise<ThemeGlobalSettings> {
  const theme = await getActiveThemeOrDefault();
  return theme.globalSettings;
}

/**
 * Mapea la fontFamily del tema a una clase de Tailwind
 * @param fontFamily - Nombre de la fuente
 * @returns Clase de Tailwind correspondiente
 */
export function getFontFamilyClass(fontFamily: string): string {
  const fontMap: Record<string, string> = {
    'Inter': 'font-sans',
    'Roboto': 'font-sans',
    'Playfair Display': 'font-serif',
    'Poppins': 'font-sans',
    'Open Sans': 'font-sans',
    'Montserrat': 'font-sans',
    'Lato': 'font-sans',
  };

  return fontMap[fontFamily] || 'font-sans';
}

/**
 * Genera las variables CSS para el tema
 * @param settings - Configuración del tema
 * @returns Objeto con variables CSS
 */
export function generateThemeCSSVariables(settings: ThemeGlobalSettings): Record<string, string> {
  return {
    '--primary-color': settings.primaryColor,
    '--secondary-color': settings.secondaryColor,
    '--theme-font-family': settings.fontFamily,
    '--theme-logo-url': settings.logoUrl ? `url("${settings.logoUrl}")` : 'none',
    '--theme-favicon-url': settings.faviconUrl || '',
  };
}
