"use server"

import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

const red = (text: string) => `\x1b[31m${text}\x1b[0m`;

export async function signInCredentials(email: string, password: string){
  
  if(!email || !password ){
    console.log(red("Missing email or password"))
    return null;
  }
  
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if(!existingUser){
    console.log(red("User not found, creating new user"))
    console.log(red(`Email: ${email}, Password: ${password}`))

    const newUser = await registerUser(email, password)
    console.log(red(`New user created with id: ${newUser.id}`))
    return newUser
  }

  const isPasswordValid = await bcrypt.compare(
    password, existingUser.password as string
  )

  if(!isPasswordValid){
    console.log(red("Invalid password"))
    return null;
  }

  console.log(red(`User ${existingUser.email} authenticated successfully`))
  return existingUser
  
}

async function registerUser(email: string, password: string, name?: string) {
  
  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      name: name || "Temporary User",
      email: email,
      password: hashedPassword,
    },
  })

  return user
}