import type { subscriptionPlanEnum } from "@/lib/db/schema"

export type SubscriptionPlan = {
  id: string
  name: string
  description: string
  price: {
    monthly: number
    annually: number
  }
  features: {
    maxClasses: number
    maxStudentsPerClass: number
    maxStorageGB: number
    advancedGrading: boolean
    lessonPlanning: boolean
    studentAnalytics: boolean
    parentCommunication: boolean
    adminDashboard: boolean
    departmentAnalytics: boolean
    customIntegrations: boolean
    prioritySupport: boolean
  }
}

export const PLANS: Record<(typeof subscriptionPlanEnum.enumValues)[number], SubscriptionPlan> = {
  starter: {
    id: "starter",
    name: "Starter",
    description: "Perfect for individual teachers",
    price: {
      monthly: 9.99,
      annually: 7.99 * 12, // 20% discount
    },
    features: {
      maxClasses: 5,
      maxStudentsPerClass: 30,
      maxStorageGB: 5,
      advancedGrading: false,
      lessonPlanning: false,
      studentAnalytics: false,
      parentCommunication: false,
      adminDashboard: false,
      departmentAnalytics: false,
      customIntegrations: false,
      prioritySupport: false,
    },
  },
  professional: {
    id: "professional",
    name: "Professional",
    description: "Ideal for full-time educators",
    price: {
      monthly: 19.99,
      annually: 15.99 * 12, // 20% discount
    },
    features: {
      maxClasses: 999999, // Unlimited
      maxStudentsPerClass: 999999, // Unlimited
      maxStorageGB: 50,
      advancedGrading: true,
      lessonPlanning: true,
      studentAnalytics: true,
      parentCommunication: true,
      adminDashboard: false,
      departmentAnalytics: false,
      customIntegrations: false,
      prioritySupport: true,
    },
  },
  school: {
    id: "school",
    name: "School",
    description: "For entire departments or schools",
    price: {
      monthly: 99.99,
      annually: 79.99 * 12, // 20% discount
    },
    features: {
      maxClasses: 999999, // Unlimited
      maxStudentsPerClass: 999999, // Unlimited
      maxStorageGB: 500,
      advancedGrading: true,
      lessonPlanning: true,
      studentAnalytics: true,
      parentCommunication: true,
      adminDashboard: true,
      departmentAnalytics: true,
      customIntegrations: true,
      prioritySupport: true,
    },
  },
}

// Helper functions to check feature access
export function hasFeatureAccess(
  planId: (typeof subscriptionPlanEnum.enumValues)[number],
  feature: keyof SubscriptionPlan["features"],
  maxAllowed?: number,
): boolean {
  const featureValue = PLANS[planId].features[feature]
  return typeof featureValue === "boolean" ? featureValue : maxAllowed ? featureValue <= maxAllowed : true
}

export function getMaxAllowed(
  planId: (typeof subscriptionPlanEnum.enumValues)[number],
  limit: "maxClasses" | "maxStudentsPerClass" | "maxStorageGB",
): number {
  return PLANS[planId].features[limit]
}

export function getPlanPrice(
  planId: (typeof subscriptionPlanEnum.enumValues)[number],
  billingCycle: "monthly" | "annually",
): number {
  return PLANS[planId].price[billingCycle]
}
