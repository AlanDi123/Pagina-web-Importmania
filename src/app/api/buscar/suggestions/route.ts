import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get('q') || '';

    if (!q || q.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    // Buscar productos
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { sku: { contains: q, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        images: {
          where: { isMain: true },
          take: 1,
        },
      },
      take: 5,
    });

    // Buscar categorías
    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
        name: { contains: q, mode: 'insensitive' },
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
      take: 3,
    });

    const suggestions = [
      ...products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        type: 'product' as const,
        price: p.price.toNumber(),
        image: p.images[0]?.url || null,
      })),
      ...categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        type: 'category' as const,
      })),
    ];

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Error al buscar sugerencias:', error);
    return NextResponse.json(
      { error: 'Error al buscar sugerencias' },
      { status: 500 }
    );
  }
}
