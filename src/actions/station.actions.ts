"use server"

import { auth } from "@/lib/auth"
import { stationService } from "@/services/station.service"
import type { StationWithDistance } from "@/types"

interface GetStationsParams {
  lat: number
  lng: number
  radiusKm?: number
}

export async function getNearbyStations({ 
  lat, 
  lng, 
  radiusKm = 3 
}: GetStationsParams): Promise<StationWithDistance[]> {

  try {
    const session = await auth()

    return await stationService.findNearby({
      lat,
      lng,
      radiusKm,
      userId: session?.user?.id,
    })
  } catch (error) {
    console.error("Error en getNearbyStations:", error)
    return []
  }
}