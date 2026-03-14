import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const quoteSchema = z.object({
  postalCode: z.string().optional(),
  province: z.string().optional(),
  totalWeight: z.number().positive(),
  totalAmount: z.number().nonnegative(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = quoteSchema.parse(body);

    if (!validatedData.postalCode && !validatedData.province) {
      return NextResponse.json(
        { error: 'Código postal o provincia requeridos' },
        { status: 400 }
      );
    }

    // Obtener configuración de tienda para retiro en persona
    const storeConfig = await prisma.storeConfig.findMany({
      where: {
        key: { in: ['store_address', 'store_hours', 'contact_phone'] },
      },
    });

    const configMap = Object.fromEntries(
      storeConfig.map((c) => [c.key, c.value])
    );

    // Buscar zona que matchee
    let matchingZone = null;

    if (validatedData.postalCode) {
      const cleanPostalCode = validatedData.postalCode.replace(/\D/g, '');
      const zones = await prisma.shippingZone.findMany({
        where: { isActive: true },
        include: {
          rates: {
            where: { isActive: true },
          },
        },
      });

      // Buscar por código postal
      for (const zone of zones) {
        if (zone.postalCodes.includes(cleanPostalCode)) {
          matchingZone = zone;
          break;
        }
      }
    }

    // Si no encontró por CP, buscar por provincia
    if (!matchingZone && validatedData.province) {
      const normalizedProvince = validatedData.province
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

      const zones = await prisma.shippingZone.findMany({
        where: { isActive: true },
        include: {
          rates: {
            where: { isActive: true },
          },
        },
      });

      for (const zone of zones) {
        const normalizedZoneProvinces = zone.provinces.map((p) =>
          p.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        );

        if (normalizedZoneProvinces.includes(normalizedProvince)) {
          matchingZone = zone;
          break;
        }
      }
    }

    if (!matchingZone) {
      // No hay zona configurada
      const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '541112345678';
      const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hola! Quiero consultar el envío a mi zona.')}`;

      return NextResponse.json({
        available: false,
        error: 'no_zone',
        message: 'No encontramos envíos a tu zona. Por favor contactanos por WhatsApp para consultar.',
        whatsappLink,
        pickup: {
          method: 'PICKUP',
          name: 'Retiro en persona',
          price: 0,
          isFree: true,
          estimatedDays: 'Inmediato',
          address: configMap['store_address'] as string || 'Av. Corrientes 1234, CABA',
          hours: configMap['store_hours'] as string || 'Lun a Vie 9:00 - 18:00',
          phone: configMap['contact_phone'] as string || '+54 11 1234-5678',
        },
      });
    }

    // Filtrar rates por peso máximo si corresponde
    const applicableRates = matchingZone.rates.filter((rate) => {
      if (!rate.maxWeight) return true;
      return validatedData.totalWeight <= rate.maxWeight.toNumber();
    });

    // Transformar a formato de respuesta
    const quotes = applicableRates.map((rate) => {
      const originalPrice = rate.price.toNumber();
      let price = originalPrice;
      let isFree = false;

      if (rate.freeAbove && validatedData.totalAmount >= rate.freeAbove.toNumber()) {
        price = 0;
        isFree = true;
      }

      return {
        method: rate.method,
        name: rate.name,
        price,
        originalPrice,
        isFree,
        estimatedDays: rate.estimatedDays,
      };
    });

    // Ordenar por precio
    quotes.sort((a, b) => a.price - b.price);

    // Agregar retiro en persona
    quotes.push({
      method: 'PICKUP' as const,
      name: 'Retiro en persona',
      price: 0,
      originalPrice: 0,
      isFree: true,
      estimatedDays: 'Inmediato',
      address: configMap['store_address'] as string,
      hours: configMap['store_hours'] as string,
      phone: configMap['contact_phone'] as string,
    });

    return NextResponse.json({
      available: true,
      zone: matchingZone.name,
      quotes,
    });
  } catch (error) {
    console.error('Error al cotizar envío:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Error al cotizar envío' },
      { status: 500 }
    );
  }
}
