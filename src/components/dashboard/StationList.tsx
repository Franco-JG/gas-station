'use client';

import { useState, useEffect } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { getNearbyStations } from '@/actions';
import { StationSkeleton, PermissionBanner } from '@/components';
import { StationCard } from "@/components/station/StationCard";
import type { StationWithDistance } from '@/types';

interface StationListProps {
  radiusKm: number;
}

export const StationList = ({ radiusKm }: StationListProps) => {
  const { coords, loading: geoLoading, error: geoError, requestLocation } = useGeolocation();
  const [stations, setStations] = useState<StationWithDistance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!coords) return;

    const fetchStations = async (radius: number) => {
      setLoading(true);
      const data = await getNearbyStations({
        lat: coords.lat,
        lng: coords.lng,
        radiusKm: radius,
      });
      setStations(data);
      setLoading(false);
      console.log("Estaciones: " + data.length)
    };

    fetchStations(radiusKm);
  }, [coords, radiusKm]);

  // Cargando ubicación o estaciones
  if (geoLoading || loading) {
    return (
      <div className="p-4 space-y-4">
        <div className='space-y-2'>
          <div className="w-6/12 h-5 rounded animate-shimmer"></div>
          <div className='h-3 w-9/12 rounded animate-shimmer'></div>
        </div>
        {[...Array(3)].map((_, i) => (
          <StationSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Error de permisos
  if (geoError) {
    return <PermissionBanner onRetry={requestLocation} />;
  }

  // Sin estaciones
  if (stations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No se encontraron gasolineras cercanas</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div>
        <h2 className="text-lg font-bold text-tertiary-1">Gasolineras Cercanas</h2>
        <p className="text-xs text-tertiary-3">
          Se encontraron <strong>{stations.length}</strong> gasolineras en un radio de <strong>{radiusKm} km</strong>.
        </p>
      </div>
      {stations.map((station) => (
        <StationCard key={station.id} {...station} />
      ))}
    </div>
  );
};