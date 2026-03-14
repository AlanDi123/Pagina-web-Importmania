import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const blogPostSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().optional(),
  content: z.string().min(1),
  excerpt: z.string().max(500).optional(),
  coverImage: z.string().url().optional().nullable(),
  authorName: z.string().optional(),
  isPublished: z.boolean().default(false),
  publishedAt: z.coerce.date().optional().nullable(),
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional(),
  tags: z.array(z.string()).default([]),
});

/**
 * GET - Listar posts publicados
 * Query params: page, limit, tag, search
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '9');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');

    const where: any = {
      isPublished: true,
    };

    if (tag) {
      where.tags = { has: tag };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const posts = await prisma.blogPost.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        authorName: true,
        isPublished: true,
        publishedAt: true,
        viewCount: true,
        tags: true,
        createdAt: true,
      },
    });

    const total = await prisma.blogPost.count({ where });

    const transformedPosts = posts.map((post) => ({
      ...post,
      readingTime: Math.ceil(post.content.split(' ').length / 200),
    }));

    return NextResponse.json({
      posts: transformedPosts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error('Error al obtener posts:', error);
    return NextResponse.json(
      { error: 'Error al obtener posts' },
      { status: 500 }
    );
  }
}

/**
 * POST - Crear post (admin)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = blogPostSchema.parse(body);

    // Generar slug si no se proporciona
    let slug = validatedData.slug;
    if (!slug) {
      slug = validatedData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Verificar si el slug ya existe
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const post = await prisma.blogPost.create({
      data: {
        ...validatedData,
        slug,
        publishedAt: validatedData.isPublished ? new Date() : validatedData.publishedAt,
      },
    });

    return NextResponse.json({
      success: true,
      post: {
        id: post.id,
        title: post.title,
        slug: post.slug,
      },
    });
  } catch (error) {
    console.error('Error al crear post:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Error al crear post' },
      { status: 500 }
    );
  }
}

/**
 * PUT - Editar post (admin)
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID requerido' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = blogPostSchema.parse(body);

    // Verificar si el post existe
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'Post no encontrado' },
        { status: 404 }
      );
    }

    // Generar slug si se cambió el título y no se proporcionó slug
    let slug = validatedData.slug || existing.slug;
    if (!validatedData.slug && validatedData.title !== existing.title) {
      slug = validatedData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...validatedData,
        slug,
        publishedAt: validatedData.isPublished && !existing.isPublished
          ? new Date()
          : validatedData.publishedAt || existing.publishedAt,
      },
    });

    return NextResponse.json({
      success: true,
      post: {
        id: post.id,
        title: post.title,
        slug: post.slug,
      },
    });
  } catch (error) {
    console.error('Error al actualizar post:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Error al actualizar post' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Eliminar post (admin)
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID requerido' },
        { status: 400 }
      );
    }

    await prisma.blogPost.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar post:', error);
    return NextResponse.json(
      { error: 'Error al eliminar post' },
      { status: 500 }
    );
  }
}
