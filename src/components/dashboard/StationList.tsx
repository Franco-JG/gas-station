'use client';

import { useState, useEffect } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { getNearbyStations } from '@/actions/get-nearby-stations';
import { StationSkeleton, PermissionBanner, StationCard } from '@/components';
import { StationWithDistance } from '@/types';

// Tipado rápido basado en tu respuesta de Prisma
// type StationData = Awaited<ReturnType<typeof getNearbyStations>>;

export function StationList() {
  const { coords, loading: geoLoading, error: geoError, requestLocation } = useGeolocation();
  const [stations, setStations] = useState<StationWithDistance[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Efecto: Cuando tenemos coordenadas, buscamos datos en el Server
  useEffect(() => {
    console.log({
      dataLoading,
      geoLoading
    })
    if (!coords) return; // No tenemos coordenadas, terminamos aquí

    let isCancelled = false;

    // Diferimos el setState para evitar render en cascada
    queueMicrotask(() => {
      if (!isCancelled) setDataLoading(true);
    });

    getNearbyStations({ lat: coords.lat, lng: coords.lng })
      .then((data) => {
        if (!isCancelled) setStations(data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (!isCancelled) setDataLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [coords]);

  // CASO 1: Cargando (Ya sea GPS o Datos del Server) -> Mostramos Skeleton
  if (geoLoading || dataLoading) {
    return (
      <div className='space-y-4 p-4'>
        <div className="flex justify-between items-end px-1">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Cerca de ti
          </h2>
          <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-full">
            {stations.length} resultados
          </span>
        </div>
        <StationSkeleton items={3} />
      </div>
    );
  }

  // CASO 2: Error de Permisos -> Mostramos Banner
  if (geoError) {
    return <PermissionBanner onRetry={requestLocation} />;
  }

  // CASO 3: Éxito -> Mostramos la lista real
  return (
    <div className="space-y-4 p-4">
      {/* Header Informativo */}
      <div className="flex justify-between items-end px-1">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Cerca de ti
        </h2>
        <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-full">
          {stations.length} resultados
        </span>
      </div>
      {stations.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          No hay gasolineras en este radio.
        </div>
      ) : (
        stations.map((station) => (
          // Usamos tu componente StationCard existente
          <StationCard
            key={station.id}
            {...station}
          />
        ))
      )}
    </div>
  );
}