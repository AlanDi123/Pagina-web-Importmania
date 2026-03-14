import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { type Database } from '@/types/supabase';

/**
 * Cliente de Supabase para el navegador (client-side)
 * Usa la clave anónima pública
 */
export function createBrowserClient(): SupabaseClient<Database> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL no está definida');
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY no está definida');
  }

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    }
  );
}

/**
 * Cliente de Supabase para el servidor (server-side)
 * Usa la clave anónima pública con cookies para SSR
 */
export function createServerClient(
  cookieStore: { get: (name: string) => string | undefined }
): SupabaseClient<Database> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL no está definida');
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY no está definida');
  }

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        headers: {
          Authorization: `Bearer ${cookieStore.get('supabase-auth-token') || ''}`,
        },
      },
    }
  );
}

/**
 * Cliente de Supabase para operaciones administrativas (server-side only)
 * Usa la service role key - NUNCA exponer al cliente
 */
export function createAdminClient(): SupabaseClient<Database> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL no está definida');
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY no está definida');
  }

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

/**
 * Cliente de Supabase Storage para uploads
 */
export const storage = {
  /**
   * Obtener URL pública de una imagen desde Supabase Storage
   */
  getPublicUrl(bucket: string, path: string): string {
    const supabase = createBrowserClient();
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  },

  /**
   * Obtener URL firmada con expiración para archivos privados
   */
  async getSignedUrl(
    bucket: string,
    path: string,
    expiresIn: number = 3600
  ): Promise<string | null> {
    const supabase = createAdminClient();
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error || !data) {
      console.error('Error al obtener URL firmada:', error);
      return null;
    }

    return data.signedUrl;
  },
};

export default createBrowserClient;
