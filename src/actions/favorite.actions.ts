"use server"

import { auth } from "@/auth"
import { favoriteService } from "@/services/favorite.service"
import { revalidatePath } from "next/cache"
import type { ActionResult } from "@/types"

export async function toggleFavorite(stationId: string): Promise<ActionResult<{ isFavorited: boolean }>> {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: "Debes iniciar sesión" }
    }

    const result = await favoriteService.toggle(session.user.id, stationId)
    revalidatePath("/")

    return { success: true, data: result }
  } catch (error) {
    console.error("Error en toggleFavorite:", error)
    return { success: false, error: "Error al actualizar favorito" }
  }
}