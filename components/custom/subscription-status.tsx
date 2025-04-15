"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { PLANS } from "@/lib/db/dal/plans"

type Subscription = {
  id: string
  plan: "starter" | "professional" | "school"
  status: string
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
}

export function SubscriptionStatus() {
  const router = useRouter()
  const { data: session } = useSession()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!session?.user) return

      try {
        const response = await fetch("/api/subscription/current")
        const data = await response.json()

        if (data.success && data.subscription) {
          setSubscription(data.subscription)
        }
      } catch (error) {
        console.error("Error fetching subscription:", error)
        setError("Failed to load your subscription information")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubscription()
  }, [session])

  const handleUpgrade = () => {
    router.push("/upgrade")
  }

  const handleCancel = async () => {
    if (
      !confirm(
        "Are you sure you want to cancel your subscription? You'll still have access until the end of your current billing period.",
      )
    ) {
      return
    }

    try {
      const response = await fetch("/api/subscription/cancel", {
        method: "POST",
      })

      const data = await response.json()

      if (data.success) {
        // Refresh subscription data
        const updatedResponse = await fetch("/api/subscription/current")
        const updatedData = await updatedResponse.json()

        if (updatedData.success && updatedData.subscription) {
          setSubscription(updatedData.subscription)
        }
      } else {
        setError(data.error || "Failed to cancel subscription")
      }
    } catch (error) {
      console.error("Error canceling subscription:", error)
      setError("An unexpected error occurred")
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-24">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-500">{error}</div>
        </CardContent>
      </Card>
    )
  }

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Free Trial</CardTitle>
          <CardDescription>You're currently on the free trial</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Upgrade to unlock all features and continue using EduTeach after your trial ends.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleUpgrade}>Upgrade Now</Button>
        </CardFooter>
      </Card>
    )
  }

  const plan = PLANS[subscription.plan]
  const currentPeriodEnd = new Date(subscription.currentPeriodEnd)
  const daysLeft = Math.ceil((currentPeriodEnd.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  const percentLeft = Math.max(0, Math.min(100, (daysLeft / 30) * 100))

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{plan.name} Plan</CardTitle>
            <CardDescription>
              {subscription.cancelAtPeriodEnd ? "Your subscription will end soon" : "Your active subscription"}
            </CardDescription>
          </div>
          <Badge variant={getStatusVariant(subscription.status)}>{formatStatus(subscription.status)}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {subscription.status === "trialing" && (
          <>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Trial period</span>
                <span>{daysLeft} days left</span>
              </div>
              <Progress value={percentLeft} />
            </div>
          </>
        )}

        <div className="space-y-1">
          <p className="text-sm font-medium">Current period ends on:</p>
          <p className="text-sm text-muted-foreground">
            {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
          </p>
        </div>

        {subscription.cancelAtPeriodEnd && (
          <div className="rounded-md bg-amber-50 p-4 dark:bg-amber-950">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              Your subscription has been canceled and will end on{" "}
              {new Date(subscription.currentPeriodEnd).toLocaleDateString()}. You can reactivate your subscription
              before this date.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {subscription.cancelAtPeriodEnd ? (
          <Button onClick={handleUpgrade}>Reactivate Subscription</Button>
        ) : (
          <>
            <Button variant="outline" onClick={handleCancel}>
              Cancel Subscription
            </Button>
            <Button onClick={handleUpgrade}>{subscription.plan === "school" ? "Manage Plan" : "Upgrade Plan"}</Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}

function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "active":
    case "trialing":
      return "default"
    case "canceled":
      return "destructive"
    case "past_due":
      return "secondary"
    default:
      return "outline"
  }
}

function formatStatus(status: string): string {
  switch (status) {
    case "trialing":
      return "Trial"
    case "active":
      return "Active"
    case "canceled":
      return "Canceled"
    case "past_due":
      return "Past Due"
    default:
      return status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " ")
  }
}
