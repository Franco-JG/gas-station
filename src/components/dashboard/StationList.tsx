'use client';

import { useState, useEffect } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { getNearbyStations } from '@/actions';
import { StationSkeleton, PermissionBanner } from '@/components';
import { StationCard } from "@/components/station/StationCard"
import type { StationWithDistance } from '@/types';

export const StationList = () => {
  const { coords, loading: geoLoading, error: geoError, requestLocation } = useGeolocation();
  const [stations, setStations] = useState<StationWithDistance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!coords) return;

    const fetchStations = async () => {
      setLoading(true);
      const data = await getNearbyStations({
        lat: coords.lat,
        lng: coords.lng,
        radiusKm: 3,
      });
      setStations(data);
      setLoading(false);
    };

    fetchStations();
  }, [coords]);

  // Cargando ubicación o estaciones
  if (geoLoading || loading) {
    return (
      <div className="p-4 space-y-4">
        {[...Array(3)].map((_, i) => (
          <StationSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Error de permisos
  if (geoError) {
    return <PermissionBanner onRetry={requestLocation}/>;
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
      {stations.map((station) => (
        <StationCard key={station.id} {...station} />
      ))}
    </div>
  );
};