/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  generateRobotsTxt: true,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: [
    '/admin/*',
    '/api/*',
    '/cuenta/*',
    '/carrito',
    '/checkout',
    '/buscar',
    '/_next/*',
    '/*?*',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/cuenta/',
          '/carrito',
          '/checkout',
          '/buscar',
        ],
      },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/sitemap.xml`,
    ],
  },
  transform: async (config, path) => {
    // URLs dinámicas con prioridad alta
    if (path.match(/^\/productos\/[^/]+$/)) {
      return {
        loc: path,
        changefreq: config.changefreq,
        priority: 0.8,
        lastmod: new Date().toISOString(),
      };
    }

    // Categorías con prioridad media-alta
    if (path.match(/^\/categorias\/[^/]+$/)) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: new Date().toISOString(),
      };
    }

    // Blog posts
    if (path.match(/^\/blog\/[^/]+$/)) {
      return {
        loc: path,
        changefreq: 'monthly',
        priority: 0.6,
        lastmod: new Date().toISOString(),
      };
    }

    // Default
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
    };
  },
};
