"use server"

import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

const red = (text: string) => `\x1b[31m${text}\x1b[0m`

/**
 * Autenticar usuario existente (para login)
 */
export async function signInCredentials(email: string, password: string) {
  if (!email || !password) {
    console.log(red("Missing email or password"))
    return null
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (!existingUser) {
    console.log(red("User not found"))
    return null
  }

  if (!existingUser.password) {
    console.log(red("User registered with OAuth, no password"))
    return null
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    existingUser.password
  )

  if (!isPasswordValid) {
    console.log(red("Invalid password"))
    return null
  }

  console.log(red(`User ${existingUser.email} authenticated successfully`))
  return existingUser
}

/**
 * Registrar nuevo usuario (para signup)
 */
export async function registerUser(
  email: string,
  password: string,
  name: string
): Promise<{ success: boolean; error?: string; userId?: string }> {

  const avatarUrl = "https://api.dicebear.com/9.x/lorelei/svg?seed="

  if (!email || !password || !name) {
    return { success: false, error: "Todos los campos son requeridos" }
  }

  if (password.length < 6) {
    return { success: false, error: "La contraseña debe tener al menos 6 caracteres" }
  }

  try {
    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { success: false, error: "El email ya está registrado" }
    }

    // Crear usuario
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email,
        password: hashedPassword,
        image: `${avatarUrl}${name.trim()}`,
      },
    })

    console.log(red(`New user created with id: ${user.id}`))
    return { success: true, userId: user.id }

  } catch (error) {
    console.error("Error registering user:", error)
    return { success: false, error: "Error al crear la cuenta" }
  }
}