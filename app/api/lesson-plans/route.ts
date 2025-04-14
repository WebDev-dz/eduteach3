"use server"

import { type NextRequest, NextResponse } from "next/server"
import { createLessonPlan, getLessonPlans, getLessonPlansByClass } from "@/lib/db/dal/lesson-plans"
import { getCurrentUser } from "@/lib/auth/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const classId = searchParams.get("classId")

    if (classId) {
      const lessonPlans = await getLessonPlansByClass(classId)
      return NextResponse.json(lessonPlans)
    } else {
      const lessonPlans = await getLessonPlans(user.id)
      return NextResponse.json(lessonPlans)
    }
  } catch (error) {
    console.error("Error fetching lesson plans:", error)
    return NextResponse.json({ error: "Failed to fetch lesson plans" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Ensure the teacherId matches the authenticated user
    if (data.teacherId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const result = await createLessonPlan(data)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error creating lesson plan:", error)
    return NextResponse.json({ error: "Failed to create lesson plan" }, { status: 500 })
  }
}
