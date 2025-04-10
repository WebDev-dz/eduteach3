import { type NextRequest, NextResponse } from "next/server"
import { getGradesByClass, calculateGradeDistribution, createGrade, createBulkGrades } from "@/lib/db/dal/grades"
import { getCurrentUser } from "@/lib/auth/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const classId = searchParams.get("classId")
    const subject = searchParams.get("subject")
    const distribution = searchParams.get("distribution") === "true"

    if (!classId) {
      return NextResponse.json({ error: "Class ID is required" }, { status: 400 })
    }

    if (distribution) {
      const data = await calculateGradeDistribution(classId, user.id)
      return NextResponse.json(data)
    } else {
      if (!subject) {
        return NextResponse.json({ error: "Subject is required" }, { status: 400 })
      }
      const grades = await getGradesByClass(classId, subject, user.id)
      return NextResponse.json(grades)
    }
  } catch (error) {
    console.error("Error fetching grades:", error)
    return NextResponse.json({ error: "Failed to fetch grades" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const requestData = await request.json()

    // Ensure the teacherId matches the authenticated user
    if (requestData.teacherId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Check if it's a bulk operation
    if (requestData.grades && Array.isArray(requestData.grades)) {
      const result = await createBulkGrades(requestData)
      return NextResponse.json(result)
    } else {
      const result = await createGrade(requestData)
      return NextResponse.json(result)
    }
  } catch (error) {
    console.error("Error creating grade:", error)
    return NextResponse.json({ error: "Failed to create grade" }, { status: 500 })
  }
}
