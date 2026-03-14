import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const wishlist = await prisma.wishlistItem.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            compareAtPrice: true,
            stock: true,
            averageRating: true,
            images: {
              where: { isMain: true },
              take: 1,
            },
          },
        },
      },
      orderBy: { addedAt: 'desc' },
    });

    const items = wishlist.map((item) => ({
      productId: item.product.id,
      name: item.product.name,
      slug: item.product.slug,
      price: item.product.price.toNumber(),
      compareAtPrice: item.product.compareAtPrice?.toNumber() || null,
      mainImage: item.product.images[0]?.url || null,
      isAvailable: item.product.stock > 0,
      stock: item.product.stock,
      averageRating: item.product.averageRating.toNumber(),
      addedAt: item.addedAt.getTime(),
    }));

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Error al obtener favoritos:', error);
    return NextResponse.json(
      { error: 'Error al obtener favoritos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Debes iniciar sesión' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'Producto requerido' },
        { status: 400 }
      );
    }

    // Verificar producto
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, isActive: true },
    });

    if (!product || !product.isActive) {
      return NextResponse.json(
        { error: 'Producto no disponible' },
        { status: 400 }
      );
    }

    // Crear o toggle
    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    if (existing) {
      await prisma.wishlistItem.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ message: 'Eliminado de favoritos', action: 'removed' });
    } else {
      await prisma.wishlistItem.create({
        data: {
          userId: session.user.id,
          productId,
        },
      });
      return NextResponse.json({ message: 'Agregado a favoritos', action: 'added' });
    }
  } catch (error) {
    console.error('Error al modificar favoritos:', error);
    return NextResponse.json(
      { error: 'Error al modificar favoritos' },
      { status: 500 }
    );
  }
}
