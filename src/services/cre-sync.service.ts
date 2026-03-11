import { XMLParser } from "fast-xml-parser";
import prisma from "@/lib/prisma";
import { FuelType } from "@/generated/prisma/client";

const CRE_PLACES_URL = "https://publicacionexterna.azurewebsites.net/publicaciones/places";
const CRE_PRICES_URL = "https://publicacionexterna.azurewebsites.net/publicaciones/prices";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
});

const asArray = (item: unknown) => {
  if (!item) return [];
  return Array.isArray(item) ? item : [item];
};

// ---------- Tipos internos ----------
interface SyncStats {
  stations_processed: number;
  stations_created_or_updated: number;
  prices_processed: number;
  prices_updated: number;
  duration?: string;
}


type XMLPlace = any;
type XMLPrice = any;

// ---------- Parseo ----------
async function fetchAndParseXML() {
  const [placesRes, pricesRes] = await Promise.all([
    fetch(CRE_PLACES_URL, { cache: "no-store" }),
    fetch(CRE_PRICES_URL, { cache: "no-store" }),
  ]);

  if (!placesRes.ok || !pricesRes.ok) {
    throw new Error("Fallo al conectar con servidores de la CRE");
  }

  const xmlPlaces = await placesRes.text();
  const xmlPrices = await pricesRes.text();

  const placesParsed = parser.parse(xmlPlaces);
  const pricesParsed = parser.parse(xmlPrices);

  return {
    places: asArray(placesParsed.places?.place) as XMLPlace[],
    prices: asArray(pricesParsed.places?.place) as XMLPrice[],
  };
}

async function fetchAndParsePricesXML() {
  const pricesRes = await fetch(CRE_PRICES_URL, { cache: "no-store" });

  if (!pricesRes.ok) {
    throw new Error("Fallo al conectar con servidor de precios CRE");
  }

  const xmlPrices = await pricesRes.text();
  const pricesParsed = parser.parse(xmlPrices);

  return asArray(pricesParsed.places?.place) as XMLPrice[];
}

function parseFuelType(typeStr: string): FuelType | null {
  if (typeStr === "regular") return FuelType.regular;
  if (typeStr === "premium") return FuelType.premium;
  if (typeStr === "diesel") return FuelType.diesel;
  return null;
}

// ---------- SEED COMPLETO (estaciones + precios) ----------
export async function seedFullSync(limit = 0): Promise<SyncStats> {
  const startTime = Date.now();
  const stats: SyncStats = {
    stations_processed: 0,
    stations_created_or_updated: 0,
    prices_processed: 0,
    prices_updated: 0,
  };

  console.log("Iniciando Seed Completo...");

  let { places, prices } = await fetchAndParseXML();

  if (limit > 0) {
    console.log(`MODO PRUEBA: Limitando a ${limit} estaciones.`);
    places = places.slice(0, limit);
  }

  console.log(`Procesando ${places.length} estaciones...`);

  const placeIdToUuid = new Map<number, string>();

  for (const place of places) {
    const placeId = parseInt(place["@_place_id"]);
    if (!placeId) continue;

    const name = place.name || "Estación Desconocida";
    const creId = place.cre_id || `PL/${placeId}/UNKNOWN`;
    const lng = parseFloat(place.location?.x);
    const lat = parseFloat(place.location?.y);

    const station = await prisma.station.upsert({
      where: { placeId },
      update: {
        name,
        creId,
        lastUpdated: new Date(),
      },
      create: {
        placeId,
        creId,
        name,
        brand: "Generica",
      },
    });

    placeIdToUuid.set(placeId, station.id);
    stats.stations_created_or_updated++;

    if (!isNaN(lat) && !isNaN(lng)) {
      await prisma.$executeRaw`
        UPDATE stations 
        SET location = ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326) 
        WHERE id = ${station.id}
      `;
    }

    stats.stations_processed++;
  }

  // Procesar precios
  stats.prices_updated = await upsertPrices(prices, placeIdToUuid);
  stats.prices_processed = stats.prices_updated;

  stats.duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`🎉 Seed terminado en ${stats.duration}s`);

  return stats;
}

// ---------- SYNC SOLO PRECIOS ----------
export async function syncPricesOnly(): Promise<SyncStats> {
  const startTime = Date.now();
  const stats: SyncStats = {
    stations_processed: 0,
    stations_created_or_updated: 0,
    prices_processed: 0,
    prices_updated: 0,
  };

  console.log("Iniciando Sync de Precios...");

  // 1. Obtener mapeo placeId -> uuid de las estaciones que YA existen en DB
  const existingStations = await prisma.station.findMany({
    select: { id: true, placeId: true },
  });

  const placeIdToUuid = new Map<number, string>();
  for (const s of existingStations) {
    placeIdToUuid.set(s.placeId, s.id);
  }

  stats.stations_processed = existingStations.length;
  console.log(`📋 ${existingStations.length} estaciones en DB`);

  // 2. Descargar SOLO el XML de precios
  const pricesList = await fetchAndParsePricesXML();

  // 3. Upsert precios
  stats.prices_updated = await upsertPrices(pricesList, placeIdToUuid);
  stats.prices_processed = stats.prices_updated;

  stats.duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`🎉 Sync de precios terminado en ${stats.duration}s`);

  return stats;
}

// ---------- Helper compartido: Upsert precios ----------
async function upsertPrices(
  pricesList: XMLPrice[],
  placeIdToUuid: Map<number, string>
): Promise<number> {
  let count = 0;

  for (const pEntry of pricesList) {
    const placeId = parseInt(pEntry["@_place_id"]);
    const stationUuid = placeIdToUuid.get(placeId);
    if (!stationUuid) continue;

    const precios = asArray(pEntry.gas_price);

    for (const p of precios) {
      const typeStr = p["@_type"];
      const priceFloat = parseFloat(p["#text"]);
      const fuelType = parseFuelType(typeStr);

      if (!fuelType || isNaN(priceFloat)) continue;

      const priceInt = Math.round(priceFloat * 100);

      await prisma.fuelPrice.upsert({
        where: {
          stationId_type: {
            stationId: stationUuid,
            type: fuelType,
          },
        },
        update: {
          price: priceInt,
          updatedAt: new Date(),
        },
        create: {
          stationId: stationUuid,
          type: fuelType,
          price: priceInt,
        },
      });

      count++;
    }
  }

  return count;
}