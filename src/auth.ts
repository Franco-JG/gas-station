import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth from "next-auth"
import { Provider } from "next-auth/providers"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import prisma from "./lib/prisma"
import { signInCredentials } from "./components/auth/actions/actions"

const providers: Provider[] = [
  GitHub,
  Google,
  Credentials({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email", placeholder: "your@email.com"},
      password: { label: "Contraseña", type: "password"}
    },
    async authorize(credentials){

      const user = await signInCredentials(credentials.email as string, credentials.password as string);
      
      return user
    }
  })
]

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // 1. Agregar el id al token JWT cuando el usuario inicia sesión
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    // 2. Agregar el id a la sesión desde el token
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  events: {
    signIn: ({ user }) => {
      console.log(`✅ Usuario conectado: ${user.email}`)
    },
    signOut: (message) => {
      if ("token" in message && message.token) {
        console.log(`👋 Usuario desconectado: ${message.token.email}`)
      }
    },
  },
  logger: {
    error: (code) => {
      // Silenciar errores de CredentialsSignin (login fallido esperado)
      if (code.name === "CredentialsSignin") return
      console.error(code)
    }
  },
  trustHost: true,
})
