import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import VKProvider from "next-auth/providers/vk"

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    accessToken?: string
    user: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }

  interface Profile {
    id?: string
  }
}

// Extend JWT type
declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    id?: string
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    VKProvider({
      clientId: process.env.VK_CLIENT_ID || "",
      clientSecret: process.env.VK_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/error',
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token
        if (profile?.id) token.id = profile.id
      }
      return token
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token and user id from a provider.
      if (token.accessToken) session.accessToken = token.accessToken
      if (session.user && token.id) session.user.id = token.id
      return session
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
} 