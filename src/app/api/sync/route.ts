
import { NextResponse } from 'next/server';
import { XMLParser } from 'fast-xml-parser';
import prisma from '@/lib/prisma';
import { FuelType } from '@/generated/prisma/client';

// Configuración: No cachear esta ruta (siempre fresca)
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 60 segundos (Vercel Hobby limit)

// URLs oficiales de la CRE
const CRE_PLACES_URL = 'https://publicacionexterna.azurewebsites.net/publicaciones/places';
const CRE_PRICES_URL = 'https://publicacionexterna.azurewebsites.net/publicaciones/prices';

// Configuración del Parser XML
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_"
});

// Helper: Convierte siempre a Array (el XML es inconsistente con 1 vs muchos items)
const asArray = (item: any) => {
  if (!item) return [];
  return Array.isArray(item) ? item : [item];
};

export async function GET(request: Request) {
  // 1. SEGURIDAD: Verificar Bearer Token
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. LECTURA DE PARÁMETRO LIMIT (Para pruebas)
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '0');

  const startTime = Date.now();
  const stats = { 
    stations_processed: 0, 
    stations_created_or_updated: 0, 
    prices_processed: 0 
  };

  try {
    console.log('🚀 Iniciando Sincronización CRE...');

    // 3. DESCARGAR XMLs (Paralelo)
    const [placesRes, pricesRes] = await Promise.all([
      fetch(CRE_PLACES_URL, { cache: 'no-store' }),
      fetch(CRE_PRICES_URL, { cache: 'no-store' })
    ]);

    if (!placesRes.ok || !pricesRes.ok) {
      throw new Error('Fallo al conectar con servidores de la CRE');
    }

    const xmlPlaces = await placesRes.text();
    const xmlPrices = await pricesRes.text();

    // 4. PARSEAR XML
    console.log('📦 Parseando XMLs...');
    const placesParsed = parser.parse(xmlPlaces);
    const pricesParsed = parser.parse(xmlPrices);

    let placesList = asArray(placesParsed.places?.place);
    const pricesList = asArray(pricesParsed.places?.place);

    // --- APLICAR LÍMITE (SOLO SI SE PIDE) ---
    if (limit > 0) {
      console.log(`✂️ MODO PRUEBA: Limitando a ${limit} estaciones.`);
      placesList = placesList.slice(0, limit);
    }

    console.log(`📍 Procesando ${placesList.length} estaciones...`);

    // Mapa en Memoria: place_id (XML) -> id (UUID DB)
    // Esto evita buscar en DB cada vez que insertamos un precio.
    const placeIdToUuid = new Map<number, string>();

    // -------------------------------------------------------
    // 5. PROCESAR ESTACIONES (Stations)
    // -------------------------------------------------------
    for (const place of placesList) {
      const placeId = parseInt(place['@_place_id']);
      if (!placeId) continue;

      const name = place.name || 'Estación Desconocida';
      const creId = place.cre_id || `PL/${placeId}/UNKNOWN`;
      
      // Coordenadas (X=Lng, Y=Lat)
      const lng = parseFloat(place.location?.x);
      const lat = parseFloat(place.location?.y);

      // UPSERT (Crear o Actualizar)
      const station = await prisma.station.upsert({
        where: { placeId: placeId },
        update: {
          name,
          creId,
          lastUpdated: new Date(),
          // Nota: brand se queda como estaba si ya existe
        },
        create: {
          placeId,
          creId,
          name,
          brand: 'Generica', // Valor default seguro
        }
      });

      // Guardar mapeo para usarlo en precios
      placeIdToUuid.set(placeId, station.id);
      stats.stations_created_or_updated++;

      // Actualizar Geometría PostGIS (SQL Raw necesario)
      if (!isNaN(lat) && !isNaN(lng)) {
        await prisma.$executeRaw`
          UPDATE stations 
          SET location = ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326) 
          WHERE id = ${station.id}
        `;
      }
      
      stats.stations_processed++;
    }

    // -------------------------------------------------------
    // 6. PROCESAR PRECIOS (FuelPrices)
    // -------------------------------------------------------
    console.log(`💰 Buscando precios para las estaciones procesadas...`);
    
    for (const pEntry of pricesList) {
      const placeId = parseInt(pEntry['@_place_id']);
      
      // Recuperamos el UUID real de la estación desde nuestro mapa
      const stationUuid = placeIdToUuid.get(placeId);

      // SI limit > 0, stationUuid será undefined para la mayoría,
      // así que saltamos eficientemente lo que no nos interesa.
      if (!stationUuid) continue;

      const precios = asArray(pEntry.gas_price);

      for (const p of precios) {
        const typeStr = p['@_type']; // "regular", "premium", "diesel"
        const priceFloat = parseFloat(p['#text']);

        // Validar tipos permitidos
        let fuelType: FuelType | null = null;
        if (typeStr === 'regular') fuelType = FuelType.regular;
        if (typeStr === 'premium') fuelType = FuelType.premium;
        if (typeStr === 'diesel') fuelType = FuelType.diesel;

        // Validar datos sanos
        if (!fuelType || isNaN(priceFloat)) continue;

        const priceInt = Math.round(priceFloat * 100); // Guardar en Centavos

        // UPSERT Precio
        await prisma.fuelPrice.upsert({
          where: {
            stationId_type: {
              stationId: stationUuid,
              type: fuelType
            }
          },
          update: {
            price: priceInt,
            updatedAt: new Date()
          },
          create: {
            stationId: stationUuid,
            type: fuelType,
            price: priceInt
          }
        });
        
        stats.prices_processed++;
      }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`🎉 Sincronización terminada en ${duration}s`);

    return NextResponse.json({
      success: true,
      duration: `${duration}s`,
      stats: {
        total_places_in_xml: placesParsed.places?.place?.length || 0,
        ...stats
      }
    });

  } catch (error: any) {
    console.error('❌ Error Fatal en Sync:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor', 
      details: error.message 
    }, { status: 500 });
  }
}