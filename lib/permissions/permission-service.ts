import { db } from "@/lib/db"
import { subscriptions, classes, students } from "@/lib/db/schema"
import { eq, count } from "drizzle-orm"
import { type PLANS, hasFeatureAccess, getMaxAllowed } from "@/lib/db/dal/plans"
import type { Session } from "next-auth"

// Check if user has access to a specific feature
export async function checkFeatureAccess(
  userId: string,
  feature: keyof (typeof PLANS)["starter"]["features"],
): Promise<boolean> {
  // Get user's subscription
  const subscription = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.userId, userId),
  })

  // If no subscription, default to starter plan
  const planId = subscription?.plan || "starter"

  // Check if the feature is available in the user's plan
  return hasFeatureAccess(planId, feature)
}

// Check if user has reached the limit for a specific resource
export async function checkResourceLimit(
  userId: string,
  resource: "classes" | "studentsPerClass",
  classId?: string,
): Promise<{ allowed: boolean; current: number; max: number }> {
  // Get user's subscription
  const subscription = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.userId, userId),
  })

  // If no subscription, default to starter plan
  const planId = subscription?.plan || "starter"

  let current = 0
  let max = 0

  if (resource === "classes") {
    // Count user's classes
    const result = await db.select({ count: count() }).from(classes).where(eq(classes.teacherId, userId))

    current = result[0].count
    max = getMaxAllowed(planId, "maxClasses")
  } else if (resource === "studentsPerClass" && classId) {
    // Count students in the specified class
    const result = await db
      .select({ count: count() })
      .from(students)
      .innerJoin(classes, eq(classes.id, classId))
      .where(eq(classes.teacherId, userId))

    current = result[0].count
    max = getMaxAllowed(planId, "maxStudentsPerClass")
  }

  return {
    allowed: current < max,
    current,
    max,
  }
}

// Check if user can access a specific route based on their role and subscription
export async function checkRouteAccess(
  session: Session | null,
  route: string,
): Promise<{ allowed: boolean; reason?: string }> {
  if (!session?.user) {
    return { allowed: false, reason: "Authentication required" }
  }

  const user = session.user

  // Admin routes
  if (route.startsWith("/admin") && user.role !== "admin" && user.role !== "school_admin") {
    return { allowed: false, reason: "Admin access required" }
  }

  // Department routes
  if (
    route.startsWith("/department") &&
    user.role !== "department_head" &&
    user.role !== "admin" &&
    user.role !== "school_admin"
  ) {
    return { allowed: false, reason: "Department head access required" }
  }

  // School routes
  if (route.startsWith("/school") && user.role !== "school_admin" && user.role !== "admin") {
    return { allowed: false, reason: "School admin access required" }
  }

  // Feature-specific routes
  if (route.startsWith("/analytics")) {
    const hasAccess = await checkFeatureAccess(user.id, "studentAnalytics")
    if (!hasAccess) {
      return { allowed: false, reason: "This feature requires a Professional or School plan" }
    }
  }

  if (route.startsWith("/lesson-plans")) {
    const hasAccess = await checkFeatureAccess(user.id, "lessonPlanning")
    if (!hasAccess) {
      return { allowed: false, reason: "This feature requires a Professional or School plan" }
    }
  }

  if (route.startsWith("/parent-communication")) {
    const hasAccess = await checkFeatureAccess(user.id, "parentCommunication")
    if (!hasAccess) {
      return { allowed: false, reason: "This feature requires a Professional or School plan" }
    }
  }

  if (route.startsWith("/department-analytics")) {
    const hasAccess = await checkFeatureAccess(user.id, "departmentAnalytics")
    if (!hasAccess) {
      return { allowed: false, reason: "This feature requires a School plan" }
    }
  }

  if (route.startsWith("/integrations")) {
    const hasAccess = await checkFeatureAccess(user.id, "customIntegrations")
    if (!hasAccess) {
      return { allowed: false, reason: "This feature requires a School plan" }
    }
  }

  return { allowed: true }
}
