import { type NextRequest, NextResponse } from "next/server"
import { login, loginSchema } from "@/lib/auth/auth"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate request body
    const result = loginSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error.errors[0].message }, { status: 400 })
    }

    // Login user
    const { success, error } = await login(result.data.email, result.data.password)

    if (!success) {
      return NextResponse.json({ success: false, error }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, error: "An error occurred during login" }, { status: 500 })
  }
}
