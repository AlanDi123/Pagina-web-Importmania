import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    if (!q) {
      return NextResponse.json({ products: [], total: 0 });
    }

    const where = {
      isActive: true,
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { shortDescription: { contains: q, mode: 'insensitive' } },
        { tags: { has: q } },
        { sku: { contains: q, mode: 'insensitive' } },
      ],
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          images: {
            where: { isMain: true },
            take: 1,
          },
        },
        orderBy: { salesCount: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    const transformedProducts = products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price.toNumber(),
      mainImage: p.images[0]?.url || null,
      category: p.categories[0]?.category.name || null,
    }));

    return NextResponse.json({
      products: transformedProducts,
      total,
    });
  } catch (error) {
    console.error('Error en búsqueda:', error);
    return NextResponse.json(
      { error: 'Error al buscar' },
      { status: 500 }
    );
  }
}
