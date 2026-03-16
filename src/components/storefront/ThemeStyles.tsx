import { getActiveThemeOrDefault, generateThemeCSSVariables, getFontFamilyClass } from '@/lib/theme';

/**
 * ThemeStyles - Server Component que genera el estilo CSS para el tema
 * Retorna un elemento <style> con las variables CSS
 */
export async function ThemeStyles() {
  try {
    const theme = await getActiveThemeOrDefault();
    const cssVariables = generateThemeCSSVariables(theme.globalSettings);
    const fontClass = getFontFamilyClass(theme.globalSettings.fontFamily);

    const cssVariablesString = Object.entries(cssVariables)
      .map(([key, value]) => `${key}: ${value};`)
      .join('\n  ');

    // Usar template string con comillas dobles para evitar mismatch de hidratación
    const cssString = `
:root {
  ${cssVariablesString}
}

body {
  font-family: var(--theme-font-family, Inter, system-ui, sans-serif);
}

.${fontClass} {
  font-family: var(--theme-font-family, Inter, system-ui, sans-serif);
}
    `.trim();

    return (
      <style>{cssString}</style>
    );
  } catch (error) {
    console.error('Error al generar ThemeStyles:', error);
    return null;
  }
}
