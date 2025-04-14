import NextAuth, { DefaultSession, NextAuthOptions,  } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema/auth";
import { eq } from "drizzle-orm";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import { z } from "zod";
import { Adapter } from "next-auth/adapters";
import * as dotenv from "dotenv";

const { DATABASE_URL, JWT_SECRET, SUPABASE_SERVICE_ROLE_KEY } =
  (dotenv.config().parsed as {
    DATABASE_URL: string;
    JWT_SECRET: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
  }) || "";
// Define your user roles as a union type
type UserRole = "teacher" | "admin" | "department_head" | "school_admin";

// Extend the default session user type
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      organizationId?: string;
    } & DefaultSession["user"];
  }
}

// Extend JWT token type
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    organizationId?: string;
  }
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const result = loginSchema.safeParse(credentials);
          if (!result.success) {
            throw new Error("Invalid email or password format");
          }

          const { email, password } = result.data;

          const user = await db.query.users.findFirst({
            where: eq(users.email, email),
          });

          if (!user) {
            throw new Error("User not found");
          }

          const passwordMatch = await compare(password, user.passwordHash);
          if (!passwordMatch) {
            throw new Error("Incorrect password");
          }

          await db
            .update(users)
            .set({ lastLoginAt: new Date() })
            .where(eq(users.id, user.id));

          return {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            role: user.role as UserRole,
            organizationId: user.organizationId || undefined,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.organizationId = user.organizationId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.organizationId = token.organizationId;
      }
      return session;
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
  secret: JWT_SECRET,
  adapter: SupabaseAdapter({
    url: DATABASE_URL,
    secret: SUPABASE_SERVICE_ROLE_KEY,
  }) as Adapter,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
