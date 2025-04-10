import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth/auth"
import { cancelSubscription } from "@/lib/subscription/subscription-service"

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    // Cancel subscription
    const result = await cancelSubscription(user.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Cancel subscription error:", error)
    return NextResponse.json(
      { success: false, error: "An error occurred while canceling subscription" },
      { status: 500 },
    )
  }
}
