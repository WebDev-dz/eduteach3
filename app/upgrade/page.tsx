"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckIcon, AlertCircleIcon } from "lucide-react"
import { PLANS } from "@/lib/db/dal/plans"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function UpgradePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const reason = searchParams.get("reason")

  const [currentPlan, setCurrentPlan] = useState<"starter" | "professional" | "school" | null>(null)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Fetch current subscription
    const fetchSubscription = async () => {
      try {
        const response = await fetch("/api/subscription/current")
        const data = await response.json()

        if (data.success && data.subscription) {
          setCurrentPlan(data.subscription.plan)
        } else {
          setCurrentPlan("starter") // Default to starter if no subscription
        }
      } catch (error) {
        console.error("Error fetching subscription:", error)
        setError("Failed to load your current subscription. Please try again.")
      }
    }

    fetchSubscription()
  }, [])

  const handleUpgrade = async (planId: "starter" | "professional" | "school") => {
    if (currentPlan === planId) {
      return // Already on this plan
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/subscription/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId,
          billingCycle,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // If clientSecret is returned, redirect to checkout
        if (data.clientSecret) {
          // Redirect to checkout page
          router.push(`/checkout?client_secret=${data.clientSecret}`)
        } else {
          // Otherwise, redirect to dashboard
          router.push("/dashboard?success=Subscription updated successfully")
        }
      } else {
        setError(data.error || "Failed to update subscription. Please try again.")
      }
    } catch (error) {
      console.error("Error updating subscription:", error)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
        <SiteHeader title="Upgrade Your Plan" />
        <div className="flex flex-1 flex-col p-4 md:p-6 gap-4">
          <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-3xl mx-auto">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Upgrade Your EduTeach Experience
              </h1>
              <p className="text-muted-foreground md:text-xl">
                Choose the plan that works best for you and your teaching needs.
              </p>
            </div>

            {reason && (
              <Alert className="max-w-2xl">
                <AlertCircleIcon className="h-4 w-4" />
                <AlertTitle>Feature not available</AlertTitle>
                <AlertDescription>{reason}</AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive" className="max-w-2xl">
                <AlertCircleIcon className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Tabs
              defaultValue="monthly"
              className="w-full"
              onValueChange={(value) => setBillingCycle(value as "monthly" | "annually")}
            >
              <div className="flex justify-center mb-8">
                <TabsList>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="annually">Annually (Save 20%)</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="monthly" className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                {Object.entries(PLANS).map(([planId, plan]) => (
                  <Card key={planId} className={`flex flex-col ${currentPlan === planId ? "border-primary" : ""}`}>
                    <CardHeader>
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="mb-4">
                        <span className="text-3xl font-bold">${plan.price.monthly.toFixed(2)}</span>
                        <span className="text-muted-foreground"> per month</span>
                      </div>
                      <ul className="space-y-2 text-sm">
                        {Object.entries(plan.features).map(([key, value]) => {
                          if (typeof value === "boolean") {
                            return value ? (
                              <li key={key} className="flex items-center gap-2">
                                <CheckIcon className="h-4 w-4 text-primary" />
                                <span>{formatFeatureName(key)}</span>
                              </li>
                            ) : null
                          } else if (key === "maxClasses" && value === 999999) {
                            return (
                              <li key={key} className="flex items-center gap-2">
                                <CheckIcon className="h-4 w-4 text-primary" />
                                <span>Unlimited classes</span>
                              </li>
                            )
                          } else if (key === "maxStudentsPerClass" && value === 999999) {
                            return (
                              <li key={key} className="flex items-center gap-2">
                                <CheckIcon className="h-4 w-4 text-primary" />
                                <span>Unlimited students per class</span>
                              </li>
                            )
                          } else {
                            return (
                              <li key={key} className="flex items-center gap-2">
                                <CheckIcon className="h-4 w-4 text-primary" />
                                <span>
                                  {formatFeatureName(key)}: {value}
                                </span>
                              </li>
                            )
                          }
                        })}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full"
                        variant={currentPlan === planId ? "outline" : "default"}
                        disabled={isLoading || currentPlan === planId}
                        onClick={() => handleUpgrade(planId as "starter" | "professional" | "school")}
                      >
                        {currentPlan === planId ? "Current Plan" : `Upgrade to ${plan.name}`}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="annually" className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                {Object.entries(PLANS).map(([planId, plan]) => (
                  <Card key={planId} className={`flex flex-col ${currentPlan === planId ? "border-primary" : ""}`}>
                    <CardHeader>
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="mb-4">
                        <span className="text-3xl font-bold">${(plan.price.annually / 12).toFixed(2)}</span>
                        <span className="text-muted-foreground"> per month, billed annually</span>
                      </div>
                      <ul className="space-y-2 text-sm">
                        {Object.entries(plan.features).map(([key, value]) => {
                          if (typeof value === "boolean") {
                            return value ? (
                              <li key={key} className="flex items-center gap-2">
                                <CheckIcon className="h-4 w-4 text-primary" />
                                <span>{formatFeatureName(key)}</span>
                              </li>
                            ) : null
                          } else if (key === "maxClasses" && value === 999999) {
                            return (
                              <li key={key} className="flex items-center gap-2">
                                <CheckIcon className="h-4 w-4 text-primary" />
                                <span>Unlimited classes</span>
                              </li>
                            )
                          } else if (key === "maxStudentsPerClass" && value === 999999) {
                            return (
                              <li key={key} className="flex items-center gap-2">
                                <CheckIcon className="h-4 w-4 text-primary" />
                                <span>Unlimited students per class</span>
                              </li>
                            )
                          } else {
                            return (
                              <li key={key} className="flex items-center gap-2">
                                <CheckIcon className="h-4 w-4 text-primary" />
                                <span>
                                  {formatFeatureName(key)}: {value}
                                </span>
                              </li>
                            )
                          }
                        })}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full"
                        variant={currentPlan === planId ? "outline" : "default"}
                        disabled={isLoading || currentPlan === planId}
                        onClick={() => handleUpgrade(planId as "starter" | "professional" | "school")}
                      >
                        {currentPlan === planId ? "Current Plan" : `Upgrade to ${plan.name}`}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </>
  )
}

// Helper function to format feature names
function formatFeatureName(key: string): string {
  // Convert camelCase to Title Case with spaces
  const formatted = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())

  // Special cases
  if (key === "maxStorageGB") {
    return "Storage"
  }

  return formatted
}
