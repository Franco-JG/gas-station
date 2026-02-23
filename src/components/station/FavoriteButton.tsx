'use client';
import { useState, useTransition } from 'react'
import { LuHeart } from "react-icons/lu";
import { toggleFavorite } from './actions/actions';
import { sileo } from 'sileo';

interface Props {
  stationId: string
  initialIsFavorited: boolean
}

export function FavoriteButton({ stationId, initialIsFavorited }: Props) {

  const [isFavorited, setIsFavorited] = useState(initialIsFavorited)
  const [isPending, startTransition] = useTransition()

  const handleToggle = () => {

    const optimisticState = !isFavorited
    setIsFavorited(optimisticState)

    startTransition(async () => {
      const result = await toggleFavorite(stationId)
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

      if (!result.success) {
        setIsFavorited(!optimisticState)
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
        console.error(result.error)
      }
    })
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      aria-label={isFavorited ? "Quitar de favoritos" : "Agregar a favoritos"}
      className="bg-gray rounded-lg p-2 hover:bg-tertiary-6/50 cursor-pointer transition-colors">
      <LuHeart size={24} className={isFavorited ? "text-secondary-1 fill-secondary-1" : "text-tertiary-5"} />
    </button>
  )
}
