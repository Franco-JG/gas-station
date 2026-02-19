'use server'

import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

export async function toggleFavorite(stationId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('Debes iniciar sesión para guardar favoritos')
    }

    const userId = session.user.id

    // buscar por la llave compuesta @@unique([userId, stationId])
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_stationId: {
          userId,
          stationId,
        },
      },
    })

    if (existingFavorite) {
      await prisma.favorite.delete({
        where: { id: existingFavorite.id },
      })
    } else {
      await prisma.favorite.create({
        data: {
          userId,
          stationId,
        },
      })
    }
    revalidatePath('/')

    // Retornamos el NUEVO estado para confirmar
    return { success: true, isFavorited: !existingFavorite }

  } catch (error) {
    console.error('Error en toggleFavorite:', error)
    return { success: false, error: error }
  }
}