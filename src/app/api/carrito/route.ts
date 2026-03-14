import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const cartItemSchema = z.object({
  productId: z.string(),
  variantId: z.string().optional(),
  quantity: z.number().int().min(1).max(999),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ items: [] });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            sku: true,
            price: true,
            compareAtPrice: true,
            stock: true,
            isActive: true,
            productType: true,
            images: {
              where: { isMain: true },
              take: 1,
            },
          },
        },
        variant: {
          select: {
            id: true,
            name: true,
            price: true,
            stock: true,
            options: true,
          },
        },
      },
    });

    const items = cartItems.map((item) => ({
      id: item.id,
      productId: item.product.id,
      variantId: item.variantId,
      quantity: item.quantity,
      name: item.product.name,
      slug: item.product.slug,
      sku: item.product.sku,
      price: (item.variant?.price || item.product.price).toNumber(),
      compareAtPrice: item.product.compareAtPrice?.toNumber() || null,
      stock: item.variant?.stock || item.product.stock,
      mainImage: item.product.images[0]?.url || null,
      variantName: item.variant?.name || null,
      variantOptions: item.variant?.options as Record<string, string> | null,
      subtotal: ((item.variant?.price || item.product.price).toNumber()) * item.quantity,
      discountPercentage: item.product.compareAtPrice
        ? Math.round(
            ((item.product.compareAtPrice.toNumber() -
              (item.variant?.price || item.product.price).toNumber()) /
              item.product.compareAtPrice.toNumber()) *
              100
          )
        : null,
      isAvailable: item.product.isActive && (item.variant?.stock || item.product.stock) > 0,
      isDigital: item.product.productType === 'DIGITAL',
    }));

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Error al obtener carrito:', error);
    return NextResponse.json(
      { error: 'Error al obtener carrito' },
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
    const validatedData = cartItemSchema.parse(body);

    // Verificar producto
    const product = await prisma.product.findUnique({
      where: { id: validatedData.productId },
      select: {
        id: true,
        stock: true,
        isActive: true,
        variants: validatedData.variantId
          ? { where: { id: validatedData.variantId } }
          : undefined,
      },
    });

    if (!product || !product.isActive) {
      return NextResponse.json(
        { error: 'Producto no disponible' },
        { status: 400 }
      );
    }

    // Verificar stock
    const availableStock = validatedData.variantId
      ? product.variants?.[0]?.stock || 0
      : product.stock;

    if (availableStock < validatedData.quantity) {
      return NextResponse.json(
        { error: 'Stock insuficiente' },
        { status: 400 }
      );
    }

    // Crear o actualizar item
    const cartItem = await prisma.cartItem.upsert({
      where: {
        userId_productId_variantId: {
          userId: session.user.id,
          productId: validatedData.productId,
          variantId: validatedData.variantId || '',
        },
      },
      update: {
        quantity: {
          increment: validatedData.quantity,
        },
      },
      create: {
        userId: session.user.id,
        productId: validatedData.productId,
        variantId: validatedData.variantId,
        quantity: validatedData.quantity,
      },
    });

    return NextResponse.json({
      message: 'Producto agregado al carrito',
      itemId: cartItem.id,
    });
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Error al agregar al carrito' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    await prisma.cartItem.deleteMany({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ message: 'Carrito vaciado' });
  } catch (error) {
    console.error('Error al vaciar carrito:', error);
    return NextResponse.json(
      { error: 'Error al vaciar carrito' },
      { status: 500 }
    );
  }
}
