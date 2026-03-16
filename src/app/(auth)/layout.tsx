import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import AuthProviders from './auth-providers';
import '@/app/(storefront)/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'iMPORTMANIA - Autenticación',
  description: 'Iniciá sesión o creá tu cuenta',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-AR" suppressHydrationWarning>
      <body className={cn('min-h-screen font-sans antialiased', inter.variable)}>
        <AuthProviders>
          <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            {/* Columna Izquierda - Formulario */}
            <div className="flex flex-col justify-center px-8 lg:px-20 py-12 bg-background">
              {/* Link volver */}
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Volver a la tienda
              </Link>
              
              {/* Formulario */}
              <div className="w-full max-w-sm">
                {children}
              </div>
            </div>

            {/* Columna Derecha - Branding (lg+) */}
            <div className="hidden lg:relative lg:flex lg:flex-col lg:items-center lg:justify-center bg-zinc-900">
              {/* Imagen de fondo */}
              <div className="absolute inset-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"
                  alt="Background"
                  className="h-full w-full object-cover opacity-50"
                />
              </div>
              
              {/* Overlay oscuro */}
              <div className="absolute inset-0 bg-black/40" />
              
              {/* Contenido centrado */}
              <div className="relative z-10 text-center px-8">
                <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
                  iMPORTMANIA
                </h1>
                <p className="text-lg text-white/80 max-w-md">
                  Tu tienda de productos importados de confianza
                </p>
              </div>
            </div>
          </div>
        </AuthProviders>
      </body>
    </html>
  );
}
