'use client';

import { useState, useEffect } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { getNearbyStations } from '@/components/dashboard/actions/actions';
import { StationSkeleton, PermissionBanner, StationCard } from '@/components';
import { StationWithDistance } from '@/types';
import { LuListFilter } from 'react-icons/lu';

// Tipado rápido basado en tu respuesta de Prisma
// type StationData = Awaited<ReturnType<typeof getNearbyStations>>;

export function StationList() {
  const { coords, loading: geoLoading, error: geoError, requestLocation } = useGeolocation();
  const [stations, setStations] = useState<StationWithDistance[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const radius = 4; // km

  // Efecto: Cuando tenemos coordenadas, buscamos datos en el Server
  useEffect(() => {

    if (!coords) return; // No tenemos coordenadas, terminamos aquí

    let isCancelled = false;

    // Diferimos el setState para evitar render en cascada
    queueMicrotask(() => {
      if (!isCancelled) setDataLoading(true);
    });

    getNearbyStations({ lat: coords.lat, lng: coords.lng, radiusKm: radius })
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
        <div className="flex justify-between items-center">
          <div className='leading-none space-y-1'>
            <div className="rounded h-5 w-40 animate-shimmer"></div>
            <div className='rounded animate-shimmer w-60 h-3'></div>
          </div>
          <div className='rounded-full animate-shimmer h-6 w-20'></div>
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
      <div className="flex justify-between items-center">
        <div className='leading-none space-y-1'>
          <h2 className="leading-none text-lg font-bold capitalize text-title">
            Estaciones cercanas
          </h2>
          <span className='leading-none text-xs text-subtitle'>{`Se encontraron ${stations.length} estaciones en ${radius} km`}</span>
        </div>
        <span className="flex gap-1 cursor-pointer bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <LuListFilter className='text-title' />
          <span className='font-semibold text-title text-xs'>Precio</span>
        </span>
      </div>
      {/* Lista de estaciones */}
      {stations.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          No hay gasolineras en este radio.
        </div>
      ) : (
        stations.map((station) => (
          <StationCard
            key={station.id}
            {...station}
          />
        ))
      )}
    </div>
  );
}