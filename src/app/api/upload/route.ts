import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase';
import { z } from 'zod';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const uploadSchema = z.object({
  bucket: z.enum(['product-images', 'blog-images', 'transfer-receipts', 'store-assets', 'user-avatars']),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const bucket = formData.get('bucket') as string;

    // Validar bucket
    const validatedBucket = uploadSchema.parse({ bucket }).bucket;

    if (!file) {
      return NextResponse.json(
        { error: 'Archivo requerido' },
        { status: 400 }
      );
    }

    // Validar tipo de archivo
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de archivo no permitido. Solo JPG, PNG y WebP.' },
        { status: 400 }
      );
    }

    // Validar tamaño
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'El archivo no puede superar los 5MB' },
        { status: 400 }
      );
    }

    // Generar nombre único
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `${crypto.randomUUID()}.${fileExtension}`;
    const path = `${session.user.id}/${fileName}`;

    // Convertir File a Blob
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Subir a Supabase Storage
    const supabase = createAdminClient();
    const { data, error } = await supabase.storage
      .from(validatedBucket)
      .upload(path, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('Error al subir archivo:', error);
      return NextResponse.json(
        { error: 'Error al subir archivo', details: error.message },
        { status: 500 }
      );
    }

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from(validatedBucket)
      .getPublicUrl(data.path);

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      path: data.path,
    });
  } catch (error) {
    console.error('Error en upload:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Bucket inválido' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Error al subir archivo' },
      { status: 500 }
    );
  }
}
