import { PrismaClient, UserRole, ProductType, CouponType, ShippingMethod } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * Seed data para desarrollo
 * Ejecutar con: npx prisma db seed
 */
async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // ============================================
  // 1. Usuario Admin
  // ============================================
  console.log('📝 Creando usuario admin...');

  const hashedPassword = await hash('Admin123!', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@importmania.com.ar' },
    update: {},
    create: {
      email: 'admin@importmania.com.ar',
      name: 'Administrador',
      hashedPassword,
      role: UserRole.ADMIN,
      isActive: true,
      emailVerified: new Date(),
      referralCode: 'admin-ref',
    },
  });

  console.log(`✅ Admin creado: ${admin.email}`);

  // ============================================
  // 2. Usuario cliente de ejemplo
  // ============================================
  console.log('👤 Creando usuario cliente...');

  const customerPassword = await hash('Cliente123!', 12);

  const customer = await prisma.user.upsert({
    where: { email: 'cliente@ejemplo.com' },
    update: {},
    create: {
      email: 'cliente@ejemplo.com',
      name: 'Juan Cliente',
      hashedPassword: customerPassword,
      role: UserRole.CUSTOMER,
      isActive: true,
      emailVerified: new Date(),
      phone: '+54 11 1234-5678',
      referralCode: 'juan-ref',
    },
  });

  console.log(`✅ Cliente creado: ${customer.email}`);

  // ============================================
  // 3. Categorías
  // ============================================
  console.log('📂 Creando categorías...');

  const tecnologia = await prisma.category.create({
    data: {
      name: 'Tecnología',
      slug: 'tecnologia',
      description: 'Productos de tecnología e informática',
      isActive: true,
      sortOrder: 1,
    },
  });

  const accesorios = await prisma.category.create({
    data: {
      name: 'Accesorios',
      slug: 'accesorios',
      description: 'Accesorios y complementos',
      isActive: true,
      sortOrder: 2,
    },
  });

  const hogar = await prisma.category.create({
    data: {
      name: 'Hogar',
      slug: 'hogar',
      description: 'Productos para el hogar',
      isActive: true,
      sortOrder: 3,
    },
  });

  // Subcategorías
  await prisma.category.create({
    data: {
      name: 'Audio',
      slug: 'audio',
      parentId: tecnologia.id,
      isActive: true,
      sortOrder: 1,
    },
  });

  await prisma.category.create({
    data: {
      name: 'Cables y Cargadores',
      slug: 'cables-cargadores',
      parentId: accesorios.id,
      isActive: true,
      sortOrder: 1,
    },
  });

  console.log(`✅ Categorías creadas`);

  // ============================================
  // 4. Productos de ejemplo
  // ============================================
  console.log('📦 Creando productos...');

  const productos = [
    {
      name: 'Auriculares Bluetooth Premium',
      slug: 'auriculares-bluetooth-premium',
      description: '<p>Auriculares inalámbricos con cancelación de ruido activa, batería de 30 horas y sonido de alta fidelidad.</p><ul><li>Bluetooth 5.0</li><li>Cancelación de ruido</li><li>Batería 30hs</li></ul>',
      shortDescription: 'Auriculares inalámbricos con cancelación de ruido',
      sku: 'AUR-001',
      price: 45000,
      compareAtPrice: 59000,
      productType: ProductType.PHYSICAL,
      isActive: true,
      isFeatured: true,
      stock: 25,
      lowStockThreshold: 5,
      weight: 250,
      dimensions: { length: 20, width: 18, height: 8 },
      tags: ['audio', 'bluetooth', 'inalámbrico'],
      averageRating: 4.5,
      reviewCount: 12,
    },
    {
      name: 'Cable USB-C a Lightning 2m',
      slug: 'cable-usbc-lightning-2m',
      description: '<p>Cable de carga rápida certificado MFi. Compatible con iPhone y iPad.</p>',
      shortDescription: 'Cable de carga rápida MFi',
      sku: 'CAB-001',
      price: 8500,
      productType: ProductType.PHYSICAL,
      isActive: true,
      isFeatured: false,
      stock: 100,
      lowStockThreshold: 10,
      weight: 50,
      tags: ['cable', 'usb-c', 'lightning'],
    },
    {
      name: 'Soporte para Celular Automotriz',
      slug: 'soporte-celular-auto',
      description: '<p>Soporte magnético para ventilación del auto. Rotación 360°.</p>',
      shortDescription: 'Soporte magnético para auto',
      sku: 'SOP-001',
      price: 6900,
      compareAtPrice: 9900,
      productType: ProductType.PHYSICAL,
      isActive: true,
      isFeatured: false,
      stock: 50,
      lowStockThreshold: 10,
      weight: 100,
      tags: ['soporte', 'auto', 'magnético'],
    },
    {
      name: 'Power Bank 10000mAh',
      slug: 'power-bank-10000mah',
      description: '<p>Batería externa de alta capacidad con carga rápida. Dos puertos USB.</p>',
      shortDescription: 'Batería externa 10000mAh',
      sku: 'POW-001',
      price: 12500,
      productType: ProductType.PHYSICAL,
      isActive: true,
      isFeatured: true,
      stock: 30,
      lowStockThreshold: 5,
      weight: 220,
      tags: ['batería', 'carga', 'portátil'],
    },
    {
      name: 'Luz LED Inteligente WiFi',
      slug: 'luz-led-wifi',
      description: '<p>Bombilla LED inteligente controlada por WiFi. 16 millones de colores. Compatible con Alexa y Google Home.</p>',
      shortDescription: 'Bombilla LED inteligente WiFi',
      sku: 'LED-001',
      price: 7800,
      compareAtPrice: 10500,
      productType: ProductType.PHYSICAL,
      isActive: true,
      isFeatured: false,
      stock: 40,
      lowStockThreshold: 10,
      weight: 80,
      tags: ['hogar', 'led', 'wifi', 'smart'],
    },
  ];

  for (const prod of productos) {
    await prisma.product.create({
      data: {
        ...prod,
        price: prod.price,
        compareAtPrice: prod.compareAtPrice || null,
        images: {
          create: {
            url: `https://placehold.co/400x400/00BFFF/white?text=${encodeURIComponent(prod.name.substring(0, 20))}`,
            alt: prod.name,
            isMain: true,
            sortOrder: 0,
          },
        },
        categories: {
          create: {
            categoryId: tecnologia.id,
          },
        },
      },
    });
  }

  console.log(`✅ ${productos.length} productos creados`);

  // ============================================
  // 5. Cupones de ejemplo
  // ============================================
  console.log('🎫 Creando cupones...');

  await prisma.coupon.create({
    data: {
      code: 'BIENVENIDA10',
      description: '10% de descuento para primera compra',
      type: CouponType.PERCENTAGE,
      value: 10,
      minPurchase: 10000,
      maxDiscount: 5000,
      usageLimit: 1000,
      perUserLimit: 1,
      isActive: true,
    },
  });

  await prisma.coupon.create({
    data: {
      code: 'ENVIOGRATIS',
      description: 'Envío gratis en cualquier compra',
      type: CouponType.FREE_SHIPPING,
      value: 0,
      minPurchase: 30000,
      isActive: true,
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
    },
  });

  await prisma.coupon.create({
    data: {
      code: 'FIJO2000',
      description: '$2000 de descuento',
      type: CouponType.FIXED_AMOUNT,
      value: 2000,
      minPurchase: 20000,
      usageLimit: 500,
      perUserLimit: 2,
      isActive: true,
    },
  });

  console.log(`✅ Cupones creados`);

  // ============================================
  // 6. Posts de blog
  // ============================================
  console.log('📝 Creando posts de blog...');

  await prisma.blogPost.create({
    data: {
      title: 'Cómo elegir los mejores auriculares Bluetooth',
      slug: 'como-elegir-auriculares-bluetooth',
      content: '<p>Elegir los auriculares Bluetooth adecuados puede ser una tarea abrumadora...</p>',
      excerpt: 'Guía completa para elegir los mejores auriculares inalámbricos según tus necesidades.',
      isPublished: true,
      publishedAt: new Date(),
      tags: ['audio', 'bluetooth', 'guía'],
      viewCount: 150,
    },
  });

  await prisma.blogPost.create({
    data: {
      title: '5 Consejos para cuidar la batería de tu celular',
      slug: 'consejos-cuidar-bateria-celular',
      content: '<p>La batería es uno de los componentes más importantes de tu smartphone...</p>',
      excerpt: 'Descubrí cómo extender la vida útil de la batería de tu dispositivo.',
      isPublished: true,
      publishedAt: new Date(),
      tags: ['batería', 'celular', 'consejos'],
      viewCount: 230,
    },
  });

  console.log(`✅ Posts de blog creados`);

  // ============================================
  // 7. Zonas de envío
  // ============================================
  console.log('🚚 Creando zonas de envío...');

  const amba = await prisma.shippingZone.create({
    data: {
      name: 'AMBA',
      provinces: ['Buenos Aires', 'Ciudad Autónoma de Buenos Aires'],
      isActive: true,
    },
  });

  await prisma.shippingRate.create({
    data: {
      zoneId: amba.id,
      method: ShippingMethod.HOME_DELIVERY,
      name: 'Envío Estándar AMBA',
      price: 2500,
      freeAbove: 50000,
      estimatedDays: '1-2 días hábiles',
      isActive: true,
    },
  });

  await prisma.shippingRate.create({
    data: {
      zoneId: amba.id,
      method: ShippingMethod.HOME_DELIVERY,
      name: 'Envío Express AMBA',
      price: 4500,
      freeAbove: 70000,
      estimatedDays: '24 horas',
      isActive: true,
    },
  });

  const interior = await prisma.shippingZone.create({
    data: {
      name: 'Interior',
      provinces: [
        'Córdoba',
        'Santa Fe',
        'Mendoza',
        'Tucumán',
        'Salta',
      ],
      isActive: true,
    },
  });

  await prisma.shippingRate.create({
    data: {
      zoneId: interior.id,
      method: ShippingMethod.CORREO_ARGENTINO,
      name: 'Correo Argentino',
      price: 4500,
      freeAbove: 80000,
      estimatedDays: '3-5 días hábiles',
      isActive: true,
    },
  });

  const patagonia = await prisma.shippingZone.create({
    data: {
      name: 'Patagonia',
      provinces: [
        'Río Negro',
        'Neuquén',
        'Chubut',
        'Santa Cruz',
        'Tierra del Fuego',
      ],
      isActive: true,
    },
  });

  await prisma.shippingRate.create({
    data: {
      zoneId: patagonia.id,
      method: ShippingMethod.CORREO_ARGENTINO,
      name: 'Correo Argentino Patagonia',
      price: 6500,
      freeAbove: 100000,
      estimatedDays: '5-7 días hábiles',
      isActive: true,
    },
  });

  console.log(`✅ Zonas de envío creadas`);

  // ============================================
  // 8. Configuración de la tienda
  // ============================================
  console.log('⚙️ Creando configuración de la tienda...');

  const storeConfigs = [
    { key: 'store_name', value: 'iMPORTMANIA' },
    { key: 'store_slogan', value: 'Productos importados de calidad' },
    { key: 'contact_email', value: 'hola@importmania.com.ar' },
    { key: 'contact_phone', value: '+54 11 1234-5678' },
    { key: 'store_address', value: 'Av. Corrientes 1234, CABA' },
    { key: 'store_hours', value: 'Lun a Vie 9:00 - 18:00' },
    { key: 'instagram_url', value: 'https://instagram.com/importmania' },
    { key: 'facebook_url', value: 'https://facebook.com/importmania' },
    { key: 'tiktok_url', value: 'https://tiktok.com/@importmania' },
    { key: 'whatsapp_number', value: '541112345678' },
    { key: 'bank_cbu', value: '0000003123456789012345' },
    { key: 'bank_alias', value: 'IMPORTMANIA.SRL' },
    { key: 'bank_holder', value: 'iMPORTMANIA S.R.L.' },
    { key: 'bank_cuit', value: '30-12345678-9' },
    { key: 'bank_name', value: 'Banco Nación' },
    { key: 'transfer_discount_percent', value: 10 },
    { key: 'promo_bar_text', value: '¡Envío gratis en compras mayores a $50.000!' },
    { key: 'promo_bar_enabled', value: true },
    { key: 'referrals_enabled', value: true },
    { key: 'referral_reward_type', value: 'PERCENTAGE' },
    { key: 'referral_reward_value', value: 10 },
    { key: 'referral_discount_for_referred', value: true },
  ];

  for (const config of storeConfigs) {
    await prisma.storeConfig.upsert({
      where: { key: config.key },
      update: { value: config.value as object },
      create: config as { key: string; value: object },
    });
  }

  console.log(`✅ Configuración de tienda creada`);

  // ============================================
  // Resumen
  // ============================================
  console.log('\n✅ Seed completado exitosamente!\n');
  console.log('📊 Resumen:');
  console.log('   - 1 usuario admin (admin@importmania.com.ar / Admin123!)');
  console.log('   - 1 usuario cliente (cliente@ejemplo.com / Cliente123!)');
  console.log('   - 3 categorías principales + 2 subcategorías');
  console.log('   - 5 productos de ejemplo');
  console.log('   - 3 cupones de descuento');
  console.log('   - 2 posts de blog');
  console.log('   - 3 zonas de envío con tarifas');
  console.log('   - Configuración general de la tienda\n');
  console.log('🚀 Para iniciar el servidor: npm run dev\n');
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
