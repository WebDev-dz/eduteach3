import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth/auth"
import { createBulkGrades, createGrade, getGradesByClass } from "@/lib/db/dal/grades"
import { z } from "zod"
import { checkRequests } from "@/lib/utils"





// Define the search params schema with Zod
const gradeSearchParamsSchema = z.object({
  classId: z.string().min(1, "Class ID is required"),
  subject: z.string().optional(),
  distribution: z.enum(["true", "false"]).optional().transform(val => val === "true")
})



export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const searchParams = request.nextUrl.searchParams
    const validation = checkRequests(searchParams, gradeSearchParamsSchema)
    
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }
    
    const { classId, subject, distribution } = validation.data
    
    if (distribution) {
      const data = await calculateGradeDistribution(classId, user.id)
      return NextResponse.json(data)
    } else {
      if (!subject) {
        return NextResponse.json({ error: "Subject is required" }, { status: 400 })
      }
      const grades = await getGradesByClass(classId)
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
