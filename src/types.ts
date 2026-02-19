import { FuelPrice, Station } from "./generated/prisma/client"

// Tipo extendido con la distancia
export type StationWithDistance = Station & {
  prices: FuelPrice[]
  distance: number,
  lat: number,
  lng: number
  isFavorited: boolean
}