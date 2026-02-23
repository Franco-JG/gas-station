'use client';

import { useState, useTransition } from 'react';
import { toggleFavorite } from '@/actions';
import { LuHeart } from 'react-icons/lu';
import { sileo } from 'sileo';

interface FavoriteButtonProps {
  stationId: string;
  initialFavorited: boolean;
}

export const FavoriteButton = ({
  stationId,
  initialFavorited,
}: FavoriteButtonProps) => {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    const optimisticState = !isFavorited;
    setIsFavorited(optimisticState);

    startTransition(async () => {
      const result = await toggleFavorite(stationId);

      if ("data" in result && result.data) {
        setIsFavorited(result.data.isFavorited);
        sileo.success({
          styles: { title: "text-primary-1!", badge: "text-primary-1!" },
          title: "Completado",
          description: optimisticState ? "Agregado a favoritos" : "Eliminado de favoritos",
          autopilot: {
            expand: 500,
            collapse: 2000,
          },
          duration: 2500,
        })
      } else {
        setIsFavorited(!optimisticState);
        sileo.error({
          styles: { title: "text-secondary-1!", badge: "text-secondary-1!" },
          title: "Error",
          description: "No se pudo actualizar el estado de favorito. Intenta nuevamente.",
          autopilot: {
            expand: 500,
            collapse: 2000,
          },
          duration: 2500,
        })
        console.log("Error al actualizar favorito:", result.error)
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      aria-label={isFavorited ? "Quitar de favoritos" : "Agregar a favoritos"}
      className="bg-gray rounded-lg p-2 hover:bg-tertiary-6/50 cursor-pointer transition-colors">
      <LuHeart size={24} className={isFavorited ? "text-secondary-1 fill-secondary-1" : "text-tertiary-5"} />
    </button>
  );
};