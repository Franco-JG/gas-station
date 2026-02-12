'use client'

import { useEffect, useState } from 'react'
import { getNearbyStations } from '@/actions/get-nearby-stations' // Importamos la acción directa
import { StationWithDistance } from '@/types'
import { StationCard } from './StationCard'
// Importamos tipos inferidos de Prisma si los necesitas, o usamos 'any' temporalmente para aprender

export function StationList() {
  const [stations, setStations] = useState<StationWithDistance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    // 1. Pedir permiso de ubicación al navegador
    if (!navigator.geolocation) {
      setError('Geolocalización no soportada por tu navegador')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setCoords({ lat: latitude, lng: longitude })

        try {
          const data = await getNearbyStations({
            lat: latitude,
            lng: longitude,
            radiusKm: 6 // Buscamos a 6km a la redonda
          })

          setStations(data)
        } catch (err) {
          setError('Error al obtener gasolineras')
        } finally {
          setLoading(false)
        }
      },
      (err) => {
        console.error(err)
        setError('Necesitamos tu ubicación para mostrarte precios cercanos.')
        setLoading(false)
      }
    )
  }, [])

  if (loading) return <div className="p-8 text-center animate-pulse">Buscando combustible barato... ⛽</div>

  if (error) return (
    <div className="p-8 text-center text-red-500">
      <p>{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg"
      >
        Intentar de nuevo
      </button>
    </div>
  )

  return (
    <div className="space-y-4 pb-20"> {/* pb-20 para dar espacio si pones bottom bar */}

      {/* Header Info */}
      <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 mb-6">
        <h2 className="text-emerald-800 font-semibold">📍 Cerca de ti</h2>
        <p className="text-sm text-emerald-600">
          Encontramos {stations.length} estaciones en tu zona.
        </p>
      </div>

      {/* Lista de Tarjetas */}
      {stations.map((station) => (
        <StationCard key={station.id} {...station} />
      ))}

      {stations.length === 0 && !loading && (
        <div className="text-center text-gray-500 py-10">
          No hay gasolineras en este radio. Intenta aumentar la distancia.
        </div>
      )}
    </div>
  )
}