// Replace the entire file with this NextAuth-compatible implementation

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { z } from "zod"
import type { DefaultSession } from "next-auth"

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: "teacher" | "admin" | "department_head" | "school_admin"
      organizationId?: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    role: "teacher" | "admin" | "department_head" | "school_admin"
    organizationId?: string
  }

  interface JWT {
    id: string
    role: "teacher" | "admin" | "department_head" | "school_admin"
    organizationId?: string
  }
}

// User schema for validation
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(["teacher", "admin", "department_head", "school_admin"]),
})

// Types
export type User = {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "teacher" | "admin" | "department_head" | "school_admin"
  organizationId?: string
}

export type Session = {
  user: User
  expires: Date
}

// Get current user from server component
export async function getCurrentUser(): Promise<User | null> {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return null
  }

  // Extract first and last name from the name field
  const nameParts = session.user.name?.split(" ") || ["", ""]
  const firstName = nameParts[0]
  const lastName = nameParts.slice(1).join(" ")

  return {
    id: session.user.id,
    email: session.user.email || "",
    firstName,
    lastName,
    role: session.user.role,
    organizationId: session.user.organizationId,
  }
}

// For compatibility with existing code - these functions are no longer needed
// with NextAuth but kept as stubs to prevent breaking changes
export async function createToken(): Promise<string> {
  console.warn("createToken is deprecated with NextAuth")
  return ""
}

export async function verifyToken(): Promise<User | null> {
  console.warn("verifyToken is deprecated with NextAuth")
  return null
}

export function setAuthCookie(): void {
  console.warn("setAuthCookie is deprecated with NextAuth")
}

export function getAuthCookie(): string | undefined {
  console.warn("getAuthCookie is deprecated with NextAuth")
  return undefined
}

export function clearAuthCookie(): void {
  console.warn("clearAuthCookie is deprecated with NextAuth")
}

export async function login(): Promise<{ success: boolean; token?: string; error?: string }> {
  console.warn("login is deprecated with NextAuth - use signIn from next-auth/react instead")
  return { success: false, error: "Use signIn from next-auth/react instead" }
}

export async function register(): Promise<{ success: boolean; token?: string; error?: string }> {
  console.warn("register is deprecated with NextAuth - implement registration with NextAuth callbacks")
  return { success: false, error: "Implement registration with NextAuth callbacks" }
}

export function logout(): void {
  console.warn("logout is deprecated with NextAuth - use signOut from next-auth/react instead")
}

export async function authMiddleware(): Promise<any> {
  console.warn("authMiddleware is deprecated with NextAuth - use NextAuth middleware instead")
  return null
}
