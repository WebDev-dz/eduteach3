import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth/auth"
import { updateSubscription } from "@/lib/subscription/subscription-service"
import { z } from "zod"

const updateSubscriptionSchema = z.object({
  planId: z.enum(["starter", "professional", "school"]),
  billingCycle: z.enum(["monthly", "annually"]),
})

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    // Validate request body
    const result = updateSubscriptionSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error.errors[0].message }, { status: 400 })
    }

    // Update subscription
    await updateSubscription(user.id, result.data.planId, result.data.billingCycle)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update subscription error:", error)
    return NextResponse.json(
      { success: false, error: "An error occurred while updating subscription" },
      { status: 500 },
    )
  }
}
