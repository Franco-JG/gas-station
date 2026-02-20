'use server'
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { StationWithDistance } from "@/types"

interface GetStationsProps {
  lat: number
  lng: number
  radiusKm?: number
}

export async function getNearbyStations({ lat, lng, radiusKm = 3 }: GetStationsProps) {
  try {

    const session = await auth();
    const currentUserId = session?.user?.id
    // 1. Convertir radio a metros para PostGIS
    const radiusMeters = radiusKm * 1000

    console.log(`📍 Server Action: Buscando cerca de [${lat}, ${lng}] radio ${radiusKm}km`)

    // Obtenemos solo IDs y Distancia para ser eficientes.
    // ST_DistanceSphere: Distancia lineal en metros.
    // ST_DWithin: Filtro booleano "está dentro de".
    
    type RawResult = {
      id: string
      distance: number
      lat: number
      lng: number
    }

    const nearbyIds = await prisma.$queryRaw<RawResult[]>`
      SELECT 
        id, 
        ST_DistanceSphere(location::geometry, ST_MakePoint(${lng}, ${lat})) as distance,
        ST_Y(location::geometry) as lat,
        ST_X(location::geometry) as lng
      FROM stations
      WHERE ST_DWithin(location, ST_MakePoint(${lng}, ${lat})::geography, ${radiusMeters})
      ORDER BY distance ASC
      LIMIT 10;
    `

    if (nearbyIds.length === 0) {
      return []
    }

    // Usamos los IDs encontrados para traer la info completa (Marcas, Precios, etc.)
    const stations = await prisma.station.findMany({
      where: {
        id: {
          in: nearbyIds.map((s) => s.id)
        }
      },
      include: {
        prices: true,
        favorites: currentUserId ? {
          where: { userId: currentUserId },
          select: { id: true } // Solo necesitamos saber si existe
        } : false
      }
    })

    // 4. MEZCLAR RESULTADOS (Merge)
    // Unimos la data de Prisma con la "distancia" que calculó PostGIS
    const result = stations.map((station) => {
      const geoData = nearbyIds.find((s) => s.id === station.id)
      
      // console.log(JSON.stringify(geoData, null, 2))
      return {
        ...station,
        distance: geoData?.distance || 0, // Agregamos la propiedad distancia
        lat: geoData?.lat || 0,
        lng: geoData?.lng || 0,
        isFavorited: station.favorites.length > 0 // Si hay registro en favorites, es favorito
      }
    })

    // 5. ORDENAR FINAL
    // Postgres ya ordenó los IDs, pero al hacer el "findMany", Prisma no garantiza el orden.
    // Reordenamos en JS por distancia.
    return result.sort((a, b) => a.distance - b.distance)

  } catch (error) {
    console.error('❌ Error en getNearbyStations:', error)
    // En Server Actions, si lanzas error, el cliente lo recibe. 
    // Retornamos array vacío para no romper la UI.
    return [] 
  }
}