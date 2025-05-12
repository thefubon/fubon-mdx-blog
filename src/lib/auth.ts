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
      firstName?: string
      lastName?: string
    }
  }

  interface Profile {
    id?: string
    given_name?: string
    family_name?: string
    first_name?: string
    last_name?: string
  }
}

// Extend JWT type
declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    id?: string
    firstName?: string
    lastName?: string
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
      
      // Add additional user info to the token if available
      if (profile) {
        token.firstName = profile.given_name || profile.first_name;
        token.lastName = profile.family_name || profile.last_name;
      }
      
      return token
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token and user id from a provider.
      if (token.accessToken) session.accessToken = token.accessToken
      if (session.user && token.id) session.user.id = token.id
      
      // Add first and last name to the session
      if (session.user) {
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
      }
      
      return session
    },
    async redirect({ url, baseUrl }) {
      // Check if the URL is for market login
      if (url.includes('returnToMarket=true')) {
        return `${baseUrl}/market`;
      }
      
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