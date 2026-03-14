import { Inter, JetBrains_Mono } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { initializeTheme } from '@/stores/uiStore';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'iMPORTMANIA',
    template: '%s | iMPORTMANIA',
  },
  description: 'Tu tienda online de productos importados en Argentina. Envíos a todo el país. Pagá con MercadoPago, transferencia o efectivo.',
  keywords: ['productos importados', 'tienda online', 'Argentina', 'e-commerce', 'MercadoPago'],
  authors: [{ name: 'iMPORTMANIA' }],
  creator: 'iMPORTMANIA',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'iMPORTMANIA',
    title: 'iMPORTMANIA',
    description: 'Tu tienda online de productos importados en Argentina',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'iMPORTMANIA',
    description: 'Tu tienda online de productos importados en Argentina',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Inicializar tema en el cliente
  initializeTheme();

  return (
    <html lang="es-AR" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable,
          jetbrainsMono.variable
        )}
      >
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'hsl(var(--background))',
              color: 'hsl(var(--foreground))',
              border: '1px solid hsl(var(--border))',
            },
            success: {
              iconTheme: {
                primary: '#2ECC71',
                secondary: 'white',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: 'white',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
