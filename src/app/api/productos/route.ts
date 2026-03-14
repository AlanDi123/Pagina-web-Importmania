import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const sort = searchParams.get('sort') || 'relevance';
    const search = searchParams.get('q') || '';
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const inStock = searchParams.get('inStock') === 'true';
    const isFeatured = searchParams.get('featured') === 'true';

    // Construir where clause
    const where: any = {
      isActive: true,
    };

    // Búsqueda por texto
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Categoría
    if (category) {
      where.categories = {
        some: {
          category: {
            slug: category,
          },
        },
      };
    }

    // Precio
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    // Stock
    if (inStock) {
      where.stock = { gt: 0 };
    }

    // Destacados
    if (isFeatured) {
      where.isFeatured = true;
    }

    // Ordenamiento
    let orderBy: any = {};
    switch (sort) {
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'bestselling':
        orderBy = { salesCount: 'desc' };
        break;
      case 'rating':
        orderBy = { averageRating: 'desc' };
        break;
      default:
        orderBy = { sortOrder: 'asc', createdAt: 'desc' };
    }

    // Obtener productos
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          images: {
            where: { isMain: true },
            take: 1,
          },
          categories: {
            include: {
              category: {
                select: { id: true, name: true, slug: true },
              },
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    // Transformar productos
    const transformedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      shortDescription: product.shortDescription,
      sku: product.sku,
      price: product.price.toNumber(),
      compareAtPrice: product.compareAtPrice?.toNumber() || null,
      productType: product.productType,
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      stock: product.stock,
      averageRating: product.averageRating.toNumber(),
      reviewCount: product.reviewCount,
      salesCount: product.salesCount,
      mainImage: product.images[0]?.url || null,
      categories: product.categories.map((c) => c.category.name),
      tags: product.tags,
      createdAt: product.createdAt,
    }));

    return NextResponse.json({
      products: transformedProducts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const product = await prisma.product.create({
      data: {
        ...body,
        price: body.price,
        compareAtPrice: body.compareAtPrice || null,
        costPrice: body.costPrice || null,
        categories: body.categoryIds
          ? {
              create: body.categoryIds.map((categoryId: string) => ({
                categoryId,
              })),
            }
          : undefined,
        images: body.images
          ? {
              create: body.images.map((img: any, index: number) => ({
                url: img.url,
                alt: img.alt || '',
                isMain: img.isMain || index === 0,
                sortOrder: index,
              })),
            }
          : undefined,
      },
      include: {
        images: true,
        categories: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error al crear producto:', error);
    return NextResponse.json(
      { error: 'Error al crear producto' },
      { status: 500 }
    );
  }
}
