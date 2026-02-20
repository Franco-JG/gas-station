'use client';
import { useState, useTransition } from 'react'
import { LuHeart } from "react-icons/lu";
import { toggleFavorite } from './actions/actions';

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
      
      if (!result.success) {
        setIsFavorited(!optimisticState)
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
