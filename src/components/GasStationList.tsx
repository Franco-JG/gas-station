'use client'

import { useEffect, useState } from 'react'
import { getNearbyStations } from '@/actions/get-nearby-stations' // Importamos la acción directa
import { FuelPrice, Station } from '@/generated/prisma/client'
// Importamos tipos inferidos de Prisma si los necesitas, o usamos 'any' temporalmente para aprender

// Tipo extendido con la distancia
type StationWithDistance = Station & {
  prices: FuelPrice[]
  distance: number
}

export default function GasStationList() {
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
            radiusKm: 5 // Buscamos a 5km a la redonda
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
        <div key={station.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{station.brand}</span>
              <h3 className="font-bold text-lg text-gray-900 leading-tight">{station.name}</h3>
            </div>
            <div className="text-right">
              {/* Precio Principal (Regular/Verde) */}
              {station.prices.find(p => p.type === 'regular') && (
                <div className="text-2xl font-black text-emerald-600">
                  ${(station.prices.find(p => p.type === 'regular')!.price / 100).toFixed(2)}
                </div>
              )}
              <div className="text-xs text-gray-400 mt-1">Regular</div>
            </div>
          </div>

          {/* Otros precios */}
          <div className="flex gap-4 text-sm text-gray-600 mb-4 bg-gray-50 p-2 rounded-lg">
             {station.prices.map(p => (
               p.type !== 'regular' && (
                 <div key={p.id} className="flex gap-1">
                   <span className="capitalize font-medium">{p.type}:</span>
                   <span className="font-bold">${(p.price / 100).toFixed(2)}</span>
                 </div>
               )
             ))}
          </div>

          {/* Footer Card */}
          <div className="flex justify-between items-center border-t border-gray-100 pt-3 mt-2">
            <span className="text-sm text-gray-500 flex items-center gap-1">
              📍 {(station.distance / 1000).toFixed(1)} km
            </span>
            <button className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-sm font-semibold rounded-full hover:bg-emerald-100 transition-colors">
              Ver Mapa
            </button>
          </div>
        </div>
      ))}

      {stations.length === 0 && !loading && (
        <div className="text-center text-gray-500 py-10">
          No hay gasolineras en este radio. Intenta aumentar la distancia.
        </div>
      )}
    </div>
  )
}