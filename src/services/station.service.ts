import prisma from "@/lib/prisma"

interface NearbyStationsParams {
  lat: number
  lng: number
  radiusKm: number
  userId?: string
}

type RawStationResult = {
  id: string
  distance: number
  lat: number
  lng: number
}

export const stationService = {
  async findNearby({ lat, lng, radiusKm, userId }: NearbyStationsParams) {
    const radiusMeters = radiusKm * 1000

    const nearbyIds = await prisma.$queryRaw<RawStationResult[]>`
      SELECT 
        id, 
        ST_DistanceSphere(location::geometry, ST_MakePoint(${lng}, ${lat})) as distance,
        ST_Y(location::geometry) as lat,
        ST_X(location::geometry) as lng
      FROM stations
      WHERE ST_DWithin(location, ST_MakePoint(${lng}, ${lat})::geography, ${radiusMeters})
      ORDER BY distance ASC
    `

    if (nearbyIds.length === 0) return []

    const stations = await prisma.station.findMany({
      where: { id: { in: nearbyIds.map((s) => s.id) } },
      include: {
        prices: true,
        favorites: userId 
          ? { where: { userId }, select: { id: true } } 
          : false,
      },
    })

    return stations
      .map((station) => {
        const geoData = nearbyIds.find((s) => s.id === station.id)
        return {
          ...station,
          distance: geoData?.distance || 0,
          lat: geoData?.lat || 0,
          lng: geoData?.lng || 0,
          isFavorited: Array.isArray(station.favorites) && station.favorites.length > 0,
        }
      })
      .sort((a, b) => a.distance - b.distance)
  },
}