import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

const AVATAR_URL = "https://api.dicebear.com/9.x/lorelei/svg?seed="

export const authService = {
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } })
  },

  async validatePassword(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword)
  },

  async createUser(data: { email: string; password: string; name: string }) {
    const hashedPassword = await bcrypt.hash(data.password, 10)
    
    return prisma.user.create({
      data: {
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        password: hashedPassword,
        image: `${AVATAR_URL}${data.name.trim()}`,
      },
    })
  },

  async userExists(email: string) {
    const user = await prisma.user.findUnique({ where: { email } })
    return !!user
  },
}