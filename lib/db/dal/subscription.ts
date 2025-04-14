"use server"
import { db } from "@/lib/db"
import { subscriptions } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { PLANS } from "@/lib/db/dal/plans"
import Stripe from "stripe"
import { users } from "@/lib/db/schema/auth"

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-03-31.basil",
})

export async function getUserSubscription(userId: string) {
  const subscription = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.userId, userId),
  })

  return subscription
}

export async function createSubscription(
  userId: string,
  planId: "starter" | "professional" | "school",
  billingCycle: "monthly" | "annually",
) {
  // Get user
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  })

  if (!user) {
    throw new Error("User not found")
  }

  // Get plan details
  const plan = PLANS[planId]
  const priceAmount = plan.price[billingCycle]

  // Create or get Stripe customer
  let stripeCustomerId = user.stripeCustomerId

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      metadata: {
        userId: user.id,
      },
    })
    stripeCustomerId = customer.id

    // Update user with Stripe customer ID
    await db.update(users).set({ stripeCustomerId }).where(eq(users.id, userId))
  }

  // Create Stripe subscription
  const item : Stripe.SubscriptionCreateParams.Item = {
    price_data: {
      currency: "usd",
      product: `prod_S7av858BLeuvxf`,
      unit_amount: Math.round(priceAmount * 100), // Convert to cents
      recurring: {
        interval: billingCycle === "monthly" ? "month" : "year",
      },
    },
  }

  console.log({item})
  const stripeSubscription = await stripe.subscriptions.create({
    customer: stripeCustomerId,
    items: [item],
    payment_behavior: "default_incomplete",
    payment_settings: { save_default_payment_method: "on_subscription" },
    // expand: ["latest_invoice.payment_intent"],
  })

  // Calculate period end
  const now = new Date()
  const periodEnd = new Date(now)
  if (billingCycle === "monthly") {
    periodEnd.setMonth(periodEnd.getMonth() + 1)
  } else {
    periodEnd.setFullYear(periodEnd.getFullYear() + 1)
  }

  // Create subscription in database
  const [newSubscription] = await db
    .insert(subscriptions)
    .values({
      userId,
      plan: planId,
      status: "trialing",
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
      stripeCustomerId,
      stripeSubscriptionId: stripeSubscription.id,
    })
    .returning()

  return {
    subscription: newSubscription,
    clientSecret: (stripeSubscription.latest_invoice as any).payment_intent?.client_secret,
  }
}

export async function cancelSubscription(userId: string) {
  const subscription = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.userId, userId),
  })

  if (!subscription) {
    throw new Error("Subscription not found")
  }

  if (subscription.stripeSubscriptionId) {
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    })
  }

  await db.update(subscriptions).set({ cancelAtPeriodEnd: true }).where(eq(subscriptions.id, subscription.id))

  return { success: true }
}

export async function updateSubscription(
  userId: string,
  planId: "starter" | "professional" | "school",
  billingCycle: "monthly" | "annually",
) {
  const subscription = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.userId, userId),
  })

  if (!subscription) {
    return createSubscription(userId, planId, billingCycle)
  }

  if (!subscription.stripeSubscriptionId) {
    throw new Error("Stripe subscription ID not found")
  }

  // Get plan details
  const plan = PLANS[planId]
  const priceAmount = plan.price[billingCycle]

  // Update Stripe subscription
  const updatedStripeSubscription = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId)

  await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
    items: [
      {
        id: updatedStripeSubscription.items.data[0].id,
        price_data: {
          currency: "usd",
          product: `EduTeach ${plan.name} Plan - ${billingCycle === "monthly" ? "Monthly" : "Annual"}`,
          unit_amount: Math.round(priceAmount * 100), // Convert to cents
          recurring: {
            interval: billingCycle === "monthly" ? "month" : "year",
          },
        },
      },
    ],
    proration_behavior: "create_prorations",
  })

  // Update subscription in database
  await db
    .update(subscriptions)
    .set({
      plan: planId,
      cancelAtPeriodEnd: false,
    })
    .where(eq(subscriptions.id, subscription.id))

  return { success: true }
}

export async function handleStripeWebhook(event: any) {
  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated":
      const subscription = event.data.object
      await db
        .update(subscriptions)
        .set({
          status: subscription.status,
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        })
        .where(eq(subscriptions.stripeSubscriptionId, subscription.id))
      break

    case "customer.subscription.deleted":
      const deletedSubscription = event.data.object
      await db
        .update(subscriptions)
        .set({
          status: "canceled",
        })
        .where(eq(subscriptions.stripeSubscriptionId, deletedSubscription.id))
      break

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return { received: true }
}
