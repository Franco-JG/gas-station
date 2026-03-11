import { FuelPrice, Station, Favorite } from "@/generated/prisma/client"

// Tipo extendido con la distancia
export interface StationWithDistance extends Station {
  distance: number,
  lat: number,
  lng: number
  isFavorited: boolean
  prices: FuelPrice[]
  favorites?: Favorite[]
}

// Respuesta estándar para actions
export interface ActionResult<T = undefined> {
  success: boolean
  error?: string
  data?: T
}

// Coordenadas geográficas
export interface Coordinates {
  lat: number
  lng: number
}

// Re-exportar tipos de Prisma útiles
export type { Station, FuelPrice, Favorite, User } from "@/generated/prisma/client"