'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

/**
 * Hook para manejar autenticación y sesión del usuario
 */
export function useAuth() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const user = session?.user;
  const isAuthenticated = !!session;
  const isLoading = status === 'loading';
  const isAdmin = user?.role === 'ADMIN';

  /**
   * Iniciar sesión con credenciales
   */
  const login = useCallback(async (email: string, password: string, callbackUrl?: string) => {
    const { signIn } = await import('next-auth/react');
    
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      throw new Error(result.error);
    }

    // Actualizar sesión
    await update();

    // Redirigir
    const redirectUrl = callbackUrl || pathname === '/login' ? '/' : pathname;
    router.push(redirectUrl);
    router.refresh();

    return result;
  }, [router, pathname, update]);

  /**
   * Iniciar sesión con Google
   */
  const loginWithGoogle = useCallback(async (callbackUrl?: string) => {
    const { signIn } = await import('next-auth/react');
    
    await signIn('google', {
      callbackUrl: callbackUrl || '/',
    });
  }, []);

  /**
   * Registrarse (crear nueva cuenta)
   */
  const register = useCallback(async (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    referralCode?: string;
  }) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al registrar');
    }

    // Auto-login después del registro
    return login(data.email, data.password);
  }, [login]);

  /**
   * Cerrar sesión
   */
  const logout = useCallback(async () => {
    const { signOut } = await import('next-auth/react');
    await signOut({ redirect: false });
    router.push('/');
    router.refresh();
  }, [router]);

  /**
   * Recuperar contraseña
   */
  const resetPassword = useCallback(async (email: string) => {
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al enviar email');
    }

    return response.json();
  }, []);

  /**
   * Actualizar perfil
   */
  const updateProfile = useCallback(async (data: {
    name?: string;
    email?: string;
    phone?: string;
    avatar?: string;
  }) => {
    const response = await fetch('/api/users/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al actualizar perfil');
    }

    // Actualizar sesión
    await update();
    return response.json();
  }, [update]);

  /**
   * Cambiar contraseña
   */
  const changePassword = useCallback(async (data: {
    currentPassword: string;
    newPassword: string;
  }) => {
    const response = await fetch('/api/users/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al cambiar contraseña');
    }

    return response.json();
  }, []);

  /**
   * Verificar email
   */
  const verifyEmail = useCallback(async (token: string) => {
    const response = await fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al verificar email');
    }

    await update();
    return response.json();
  }, [update]);

  return {
    // Estado
    user,
    isAuthenticated,
    isLoading,
    isAdmin,
    status,
    
    // Acciones
    login,
    loginWithGoogle,
    register,
    logout,
    resetPassword,
    updateProfile,
    changePassword,
    verifyEmail,
    updateSession: update,
    
    // Helpers
    requiresAuth: !isLoading && !isAuthenticated,
    requiresAdmin: !isLoading && !isAdmin,
  };
}

/**
 * Hook para requerir autenticación
 * Redirige al login si no está autenticado
 */
export function useRequireAuth(redirectUrl = '/login') {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectUrl);
    }
  }, [isAuthenticated, isLoading, router, redirectUrl]);

  return { isAuthenticated, isLoading };
}

/**
 * Hook para requerir rol de admin
 * Redirige al home si no es admin
 */
export function useRequireAdmin() {
  const { isAdmin, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (!isAdmin) {
        router.push('/');
      }
    }
  }, [isAdmin, isLoading, isAuthenticated, router]);

  return { isAdmin, isLoading, isAuthenticated };
}

export default useAuth;
