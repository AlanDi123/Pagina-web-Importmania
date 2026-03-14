import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true, parentId: null },
      include: {
        _count: {
          select: {
            products: {
              where: { isActive: true },
            },
          },
        },
        children: {
          where: { isActive: true },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });

    // Obtener tags únicos de productos activos
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { tags: true },
    });

    const tagCounts: Record<string, number> = {};
    products.forEach((p) => {
      p.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    // Obtener rango de precios
    const priceStats = await prisma.product.aggregate({
      where: { isActive: true },
      _min: { price: true },
      _max: { price: true },
    });

    return NextResponse.json({
      categories: categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        count: c._count.products,
      })),
      tags: Object.entries(tagCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20),
      priceRange: {
        min: priceStats._min.price?.toNumber() || 0,
        max: priceStats._max.price?.toNumber() || 1000000,
      },
    });
  } catch (error) {
    console.error('Error al obtener filtros:', error);
    return NextResponse.json(
      { error: 'Error al obtener filtros' },
      { status: 500 }
    );
  }
}
