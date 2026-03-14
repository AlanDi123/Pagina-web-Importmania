import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET - XML Feed para Google Shopping / Google Merchant Center
 * Retorna todos los productos activos con stock > 0
 */
export async function GET(request: NextRequest) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        stock: { gt: 0 },
      },
      include: {
        images: {
          where: { isMain: true },
          take: 1,
        },
        categories: {
          include: {
            category: {
              select: { name: true },
            },
          },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Construir XML
    const xmlItems = products
      .map((product) => {
        const productUrl = `${baseUrl}/productos/${product.slug}`;
        const imageUrl = product.images[0]?.url || `${baseUrl}/placeholder.jpg`;
        const price = product.price.toNumber().toFixed(2);
        const category = product.categories[0]?.category.name || 'General';
        const description = stripHtml(product.description || product.shortDescription || '').substring(0, 5000);

        return `
    <item>
      <g:id>${escapeXml(product.sku)}</g:id>
      <g:title>${escapeXml(product.name)}</g:title>
      <g:description>${escapeXml(description)}</g:description>
      <g:link>${escapeXml(productUrl)}</g:link>
      <g:image_link>${escapeXml(imageUrl)}</g:image_link>
      <g:price>${price} ARS</g:price>
      <g:availability>in_stock</g:availability>
      <g:condition>new</g:condition>
      <g:brand>iMPORTMANIA</g:brand>
      <g:google_product_category>${escapeXml(category)}</g:google_product_category>
      <g:mpn>${escapeXml(product.sku)}</g:mpn>
      <g:identifier_exists>false</g:identifier_exists>
    </item>`;
      })
      .join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>iMPORTMANIA - Productos</title>
    <link>${escapeXml(baseUrl)}</link>
    <description>Feed de productos de iMPORTMANIA para Google Shopping</description>
    <language>es-AR</language>${xmlItems}
  </channel>
</rss>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // Cachear por 1 hora
      },
    });
  } catch (error) {
    console.error('Error al generar feed de Google Shopping:', error);
    return NextResponse.json(
      { error: 'Error al generar feed' },
      { status: 500 }
    );
  }
}

/**
 * Escapa caracteres especiales para XML
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Elimina tags HTML de un string
 */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}
