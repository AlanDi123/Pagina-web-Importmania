/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Configurar cabeceras de seguridad incluyendo CSP
  async headers() {
    const isDev = process.env.NODE_ENV === 'development';
    
    // CSP para desarrollo - incluye 'unsafe-eval' para Fast Refresh
    const devCSP = `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' blob:;
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data: https:;
      font-src 'self' data:;
      connect-src 'self' blob: https:;
      frame-src 'self' https:;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
    `.replace(/\s+/g, ' ').trim();

    // CSP para producción - sin 'unsafe-eval'
    const prodCSP = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' blob:;
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data: https:;
      font-src 'self' data:;
      connect-src 'self' blob: https:;
      frame-src 'self' https:;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
    `.replace(/\s+/g, ' ').trim();

    return [
      {
        // Aplicar a todas las rutas excepto API y estáticos
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: isDev ? devCSP : prodCSP,
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
