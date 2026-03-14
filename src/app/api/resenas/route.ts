import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createReviewSchema = z.object({
  productId: z.string(),
  orderId: z.string().optional(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(100).optional(),
  comment: z.string().max(1000).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get('productId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!productId) {
      return NextResponse.json(
        { error: 'productId requerido' },
        { status: 400 }
      );
    }

    const where: any = { productId, isApproved: true };

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      }),
      prisma.review.count({ where }),
    ]);

    const transformedReviews = reviews.map((r) => ({
      id: r.id,
      userId: r.userId,
      userName: r.user.name,
      userAvatar: r.user.avatar,
      rating: r.rating,
      title: r.title,
      comment: r.comment,
      isVerified: r.isVerified,
      createdAt: r.createdAt,
    }));

    return NextResponse.json({
      reviews: transformedReviews,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
    });
  } catch (error) {
    console.error('Error al obtener reseñas:', error);
    return NextResponse.json(
      { error: 'Error al obtener reseñas' },
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
    const validatedData = createReviewSchema.parse(body);

    // Verificar producto
    const product = await prisma.product.findUnique({
      where: { id: validatedData.productId },
      select: { id: true, isActive: true },
    });

    if (!product || !product.isActive) {
      return NextResponse.json(
        { error: 'Producto no disponible' },
        { status: 400 }
      );
    }

    // Verificar que el usuario compró el producto
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId: validatedData.productId,
        order: {
          userId: session.user.id,
          status: { in: ['DELIVERED', 'PICKED_UP'] },
        },
      },
    });

    // Verificar si ya tiene reseña
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: validatedData.productId,
        },
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'Ya dejaste una reseña para este producto' },
        { status: 400 }
      );
    }

    // Crear reseña
    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        productId: validatedData.productId,
        orderId: validatedData.orderId,
        rating: validatedData.rating,
        title: validatedData.title,
        comment: validatedData.comment,
        isVerified: !!hasPurchased,
        isApproved: true, // Auto-aprobada, o false si requiere moderación
      },
    });

    // Recalcular averageRating y reviewCount del producto
    const stats = await prisma.review.aggregate({
      where: { productId: validatedData.productId, isApproved: true },
      _avg: { rating: true },
      _count: { id: true },
    });

    await prisma.product.update({
      where: { id: validatedData.productId },
      data: {
        averageRating: stats._avg.rating || 0,
        reviewCount: stats._count.id,
      },
    });

    // Crear notificación para el admin
    await prisma.notification.create({
      data: {
        type: 'NEW_REVIEW',
        title: 'Nueva reseña recibida',
        message: `Un usuario dejó una reseña de ${review.rating} estrellas en un producto`,
        data: { reviewId: review.id, productId: validatedData.productId },
        channel: 'IN_APP',
      },
    });

    return NextResponse.json({
      message: 'Reseña enviada exitosamente',
      review: {
        id: review.id,
        rating: review.rating,
        title: review.title,
        comment: review.comment,
      },
    });
  } catch (error) {
    console.error('Error al crear reseña:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Error al crear reseña' },
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

    const searchParams = request.nextUrl.searchParams;
    const reviewId = searchParams.get('id');

    if (!reviewId) {
      return NextResponse.json(
        { error: 'reviewId requerido' },
        { status: 400 }
      );
    }

    // Verificar que la reseña existe y pertenece al usuario o es admin
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { id: true, userId: true, productId: true },
    });

    if (!review) {
      return NextResponse.json(
        { error: 'Reseña no encontrada' },
        { status: 404 }
      );
    }

    if (review.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No tienes permiso para eliminar esta reseña' },
        { status: 403 }
      );
    }

    await prisma.review.delete({
      where: { id: reviewId },
    });

    // Recalcular estadísticas del producto
    const stats = await prisma.review.aggregate({
      where: { productId: review.productId, isApproved: true },
      _avg: { rating: true },
      _count: { id: true },
    });

    await prisma.product.update({
      where: { id: review.productId },
      data: {
        averageRating: stats._avg.rating || 0,
        reviewCount: stats._count.id,
      },
    });

    return NextResponse.json({ message: 'Reseña eliminada' });
  } catch (error) {
    console.error('Error al eliminar reseña:', error);
    return NextResponse.json(
      { error: 'Error al eliminar reseña' },
      { status: 500 }
    );
  }
}
