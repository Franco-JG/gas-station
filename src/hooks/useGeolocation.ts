'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

type GeoState = {
  coords: { lat: number; lng: number } | null;
  loading: boolean;
  error: string | null;
};

export function useGeolocation(autoRequest = true) {
  const [state, setState] = useState<GeoState>(() => ({
    coords: null,
    loading: autoRequest,
    error: null,
  }));

  const requestedRef = useRef(false);

  const requestLocation = useCallback(() => {
    setState(s => ({ ...s, loading: true, error: null }));

    if (!navigator.geolocation) {
      setState({ coords: null, loading: false, error: 'Geolocation not supported' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      pos => {
        setState({
          coords: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          },
          loading: false,
          error: null,
        });
      },
      err => {
        setState({
          coords: null,
          loading: false,
          error: err.message,
        });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // auto request once - inline to avoid synchronous setState
  useEffect(() => {
    if (!autoRequest) return;
    if (requestedRef.current) return;
    requestedRef.current = true;

    if (!navigator.geolocation) {
      queueMicrotask(() => {
        setState({ coords: null, loading: false, error: 'Geolocation not supported' });
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      pos => {
        setState({
          coords: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          },
          loading: false,
          error: null,
        });
      },
      err => {
        setState({
          coords: null,
          loading: false,
          error: err.message,
        });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [autoRequest]);

  return { ...state, requestLocation };
}
