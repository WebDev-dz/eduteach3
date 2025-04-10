import { type NextRequest, NextResponse } from "next/server"
import { lessonPlanService } from "@/lib/db/dal/lesson-plans"
import { getCurrentUser } from "@/lib/auth/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const lessonPlanId = params.id
    const lessonPlan = await lessonPlanService.getLessonPlanById(lessonPlanId)

    if (!lessonPlan) {
      return NextResponse.json({ error: "Lesson plan not found" }, { status: 404 })
    }

    // Check if the lesson plan belongs to the authenticated user
    if (lessonPlan.teacherId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json(lessonPlan)
  } catch (error) {
    console.error("Error fetching lesson plan:", error)
    return NextResponse.json({ error: "Failed to fetch lesson plan" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const lessonPlanId = params.id
    const data = await request.json()

    // Ensure the teacherId matches the authenticated user
    if (data.teacherId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Ensure the lesson plan ID in the URL matches the one in the request body
    if (data.id !== lessonPlanId) {
      return NextResponse.json({ error: "Lesson plan ID mismatch" }, { status: 400 })
    }

    const result = await lessonPlanService.updateLessonPlan(data)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error updating lesson plan:", error)
    return NextResponse.json({ error: "Failed to update lesson plan" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const lessonPlanId = params.id
    const result = await lessonPlanService.deleteLessonPlan(lessonPlanId, user.id)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error deleting lesson plan:", error)
    return NextResponse.json({ error: "Failed to delete lesson plan" }, { status: 500 })
  }
}
