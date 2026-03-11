"use server"

import { authService } from "@/services/auth.service"
import type { ActionResult } from "@/types"

export async function signInCredentials(email: string, password: string) {
  if (!email || !password) return null

  const user = await authService.findUserByEmail(email.toLowerCase().trim())
  if (!user?.password) return null

  const isValid = await authService.validatePassword(password, user.password)
  if (!isValid) return null

  return user
}

interface RegisterData {
  email: string
  password: string
  name: string
}

export async function registerUser(data: RegisterData): Promise<ActionResult<{ userId: string }>> {
  const { email, password, name } = data

  // Validaciones
  if (!email || !password || !name) {
    return { success: false, error: "Todos los campos son requeridos" }
  }

  if (password.length < 6) {
    return { success: false, error: "La contraseña debe tener al menos 6 caracteres" }
  }

  // Verificar si existe
  const exists = await authService.userExists(email.toLowerCase().trim())
  if (exists) {
    return { success: false, error: "El email ya está registrado" }
  }

  // Crear usuario
  try {
    const user = await authService.createUser({ email, password, name })
    return { success: true, data: { userId: user.id } }
  } catch {
    return { success: false, error: "Error al crear el usuario" }
  }
}