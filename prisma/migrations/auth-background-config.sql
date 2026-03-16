-- =============================================
-- MIGRACIÓN: Agregar campo authBackgroundImageUrl a StoreConfig
-- Para personalizar el fondo de las páginas de autenticación
-- =============================================

-- Insertar o actualizar la configuración de fondo de autenticación
INSERT INTO "store_config" ("key", "value", "createdAt", "updatedAt")
VALUES (
  'authBackgroundImageUrl',
  '"https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"',
  NOW(),
  NOW()
)
ON CONFLICT ("key") DO UPDATE SET
  "value" = EXCLUDED.value,
  "updatedAt" = NOW();

-- =============================================
-- IMÁGENES RECOMENDADAS PARA AUTH BACKGROUND
-- =============================================

-- Opción 1: Tienda/Comercio (Unsplash)
-- https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070

-- Opción 2: Productos minimalistas
-- https://images.unsplash.com/photo-1472851294608-415170d447e0?q=80&w=2070

-- Opción 3: Gradiente abstracto
-- https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2070

-- Opción 4: Oficina moderna
-- https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2070

-- Opción 5: Tecnología/Importación
-- https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070

-- =============================================
-- USO DESDE EL PANEL DE ADMINISTRACIÓN
-- =============================================

-- Para actualizar desde SQL:
-- UPDATE "store_config" 
-- SET "value" = '"https://tu-imagen.com/fondo.jpg"' 
-- WHERE "key" = 'authBackgroundImageUrl';
