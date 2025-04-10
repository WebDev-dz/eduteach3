import { type NextRequest, NextResponse } from "next/server"
import { handleStripeWebhook } from "@/lib/subscription/subscription-service"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
})

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature") || ""

  try {
    const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET || "")

    await handleStripeWebhook(event)

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Stripe webhook error:", error)
    return NextResponse.json({ error: "Webhook error" }, { status: 400 })
  }
}
