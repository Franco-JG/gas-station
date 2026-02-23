import prisma from "@/lib/prisma"

export const favoriteService = {
  async toggle(userId: string, stationId: string) {
    const existing = await prisma.favorite.findUnique({
      where: { userId_stationId: { userId, stationId } },
    })

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } })
      return { isFavorited: false }
    }

    await prisma.favorite.create({ data: { userId, stationId } })
    return { isFavorited: true }
  },

  async getUserFavorites(userId: string) {
    return prisma.favorite.findMany({
      where: { userId },
      include: { station: { include: { prices: true } } },
    })
  },
}