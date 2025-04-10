import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { z } from "zod"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { createSubscription } from "@/lib/subscription/subscription-service"

// Registration schema
const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["teacher", "admin", "department_head", "school_admin"]),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Validate request body
    const result = registerSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error.errors[0].message }, { status: 400 })
    }

    const { firstName, lastName, email, password, role } = result.data

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    })

    if (existingUser) {
      return NextResponse.json({ success: false, error: "Email already in use" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        firstName,
        lastName,
        passwordHash: hashedPassword,
        role,
      })
      .returning({
        id: users.id,
      })

    // Create trial subscription (Professional plan for 14 days)
    try {
      await createSubscription(newUser.id, "professional", "monthly")
    } catch (subscriptionError) {
      console.error("Error creating trial subscription:", subscriptionError)
      // Continue even if subscription creation fails
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ success: false, error: "An error occurred during registration" }, { status: 500 })
  }
}
