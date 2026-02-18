import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth from "next-auth"
import { Provider } from "next-auth/providers"
import Discord from "next-auth/providers/discord"
import Facebook from "next-auth/providers/facebook"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Instagram from "next-auth/providers/instagram"
import prisma from "./lib/prisma"

const providers: Provider[] = [
  GitHub({
    clientId: process.env.AUTH_GITHUB_ID || "",
    clientSecret: process.env.AUTH_GITHUB_SECRET || "",
  }),
  Google(
    {
      clientId: process.env.AUTH_GOOGLE_ID || "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || "",
    }
  ),
  Facebook,
  Instagram,
  Discord
]

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers,
})

// export const providerMap = providers.map((provider) => {
//   if (typeof provider === "function") {
//     const providerData = provider()
//     return { id: providerData.id, name: providerData.name }
//   }
//   return { id: provider.id, name: provider.name }
// })