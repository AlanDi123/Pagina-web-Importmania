import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const CRON_SECRET = process.env.CRON_SECRET || 'cron-secret';

/**
 * POST /api/cron/sitemap
 * Genera sitemap dinámico con productos y posts activos
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autorización
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Obtener productos activos
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });

    // Obtener posts publicados
    const posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    });

    // Obtener categorías activas
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      select: { slug: true },
    });

    // Construir XML
    const urlEntries = [
      // Home
      `<url><loc>${baseUrl}</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`,
      // Productos
      `<url><loc>${baseUrl}/productos</loc><changefreq>daily</changefreq><priority>0.9</priority></url>`,
      // Blog
      `<url><loc>${baseUrl}/blog</loc><changefreq>daily</changefreq><priority>0.8</priority></url>`,
      // Categorías
      ...categories.map((cat) =>
        `<url><loc>${baseUrl}/categorias/${cat.slug}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`
      ),
      // Productos individuales
      ...products.map((product) =>
        `<url><loc>${baseUrl}/productos/${product.slug}</loc><lastmod>${product.updatedAt.toISOString()}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>`
      ),
      // Posts individuales
      ...posts.map((post) =>
        `<url><loc>${baseUrl}/blog/${post.slug}</loc><lastmod>${post.updatedAt.toISOString()}</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>`
      ),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries.join('\n')}
</urlset>`;

    // Guardar en public/sitemap-dynamic.xml (en producción esto debería ir a un bucket S3 o similar)
    // Por ahora retornamos el XML directamente
    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error al generar sitemap:', error);
    return NextResponse.json(
      { error: 'Error al generar sitemap' },
      { status: 500 }
    );
  }
}
