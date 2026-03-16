import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { ThemeEditorClient } from './theme-editor-client';
import type { ThemeGlobalSettings } from '@/lib/validators';
import type { Theme } from '@prisma/client';

export const metadata: Metadata = {
  title: 'Apariencia | Theme Editor',
  description: 'Personaliza el diseño y apariencia de tu tienda',
};

export default async function AparienciaAdminPage() {
  // Obtener el tema activo
  const activeTheme = await prisma.theme.findFirst({
    where: { isActive: true },
  });

  // Obtener todos los medios subidos para el selector de logo
  const media = await prisma.media.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  // Valores por defecto si no hay tema
  const defaultSettings: ThemeGlobalSettings = {
    primaryColor: '#000000',
    secondaryColor: '#6b7280',
    fontFamily: 'Inter',
    logoUrl: '',
    faviconUrl: '',
    homeSections: [],
  };

  const themeData = activeTheme
    ? { ...activeTheme, globalSettings: activeTheme.globalSettings as ThemeGlobalSettings }
    : {
        id: '',
        name: 'Tema Principal',
        isActive: false,
        globalSettings: defaultSettings,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Theme & { globalSettings: ThemeGlobalSettings };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Personalizar Tienda</h1>
        <p className="text-muted-foreground mt-1">
          Configura los colores, tipografía y logo de tu tienda
        </p>
      </div>

      <ThemeEditorClient
        initialTheme={themeData}
        availableMedia={media}
      />
    </div>
  );
}
