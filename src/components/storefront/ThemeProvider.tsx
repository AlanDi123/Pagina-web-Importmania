import { getActiveThemeOrDefault, generateThemeCSSVariables, getFontFamilyClass } from '@/lib/theme';

/**
 * ThemeProvider - Server Component que inyecta variables CSS del tema activo
 *
 * Este componente:
 * 1. Obtiene el tema activo de la base de datos (con fallback si falla)
 * 2. Genera variables CSS custom properties
 * 3. Retorna los datos para que el layout los use
 *
 * @param children - Children components
 */
export async function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Obtener tema activo con graceful degradation
  const theme = await getActiveThemeOrDefault();

  // Generar variables CSS
  const cssVariables = generateThemeCSSVariables(theme.globalSettings);

  // Obtener clase de fuente
  const fontClass = getFontFamilyClass(theme.globalSettings.fontFamily);

  // Convertir variables a string CSS
  const cssVariablesString = Object.entries(cssVariables)
    .map(([key, value]) => `${key}: ${value};`)
    .join('\n  ');

  // Inyectar CSS directamente en globals.css via variable
  // Retornamos solo el wrapper con la clase de fuente
  return (
    <div className={fontClass} style={{ '--theme-css': cssVariablesString } as React.CSSProperties}>
      {children}
    </div>
  );
}

/**
 * Hook helper para obtener el tema en componentes cliente
 * Nota: Para usar en componentes cliente, pasar el tema como prop desde un Server Component
 */
export interface ThemeContextValue {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  logoUrl: string;
  faviconUrl: string;
}
