import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth/auth"
import { createSubscription } from "@/lib/subscription/subscription-service"
import { z } from "zod"

const createSubscriptionSchema = z.object({
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
    const result = createSubscriptionSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error.errors[0].message }, { status: 400 })
    }

    // Create subscription
    const { subscription, clientSecret } = await createSubscription(
      user.id,
      result.data.planId,
      result.data.billingCycle,
    )

    return NextResponse.json({ success: true, subscription, clientSecret })
  } catch (error) {
    console.error("Create subscription error:", error)
    return NextResponse.json(
      { success: false, error: "An error occurred while creating subscription" },
      { status: 500 },
    )
  }
}
