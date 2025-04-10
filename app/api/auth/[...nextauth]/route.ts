import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { z } from "zod"

// Login schema for validation
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Validate credentials
        const result = loginSchema.safeParse(credentials)
        if (!result.success) {
          return null
        }

        const { email, password } = result.data

        // Find user by email
        const user = await db.query.users.findFirst({
          where: eq(users.email, email),
        })

        if (!user) {
          return null
        }

        // Verify password
        const passwordMatch = await compare(password, user.passwordHash)
        if (!passwordMatch) {
          return null
        }

        // Update last login time
        await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, user.id))

        // Return user data
        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
          organizationId: user.organizationId,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.organizationId = user.organizationId
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.organizationId = token.organizationId
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
  secret: process.env.JWT_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
