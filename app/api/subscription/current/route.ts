import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth/auth"
import { getUserSubscription } from "@/lib/subscription/subscription-service"

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    // Get user's subscription
    const subscription = await getUserSubscription(user.id)

    return NextResponse.json({ success: true, subscription })
  } catch (error) {
    console.error("Get subscription error:", error)
    return NextResponse.json(
      { success: false, error: "An error occurred while fetching subscription" },
      { status: 500 },
    )
  }
}
