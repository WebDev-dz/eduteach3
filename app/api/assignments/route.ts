import { type NextRequest, NextResponse } from "next/server"
import { assignmentService } from "@/lib/db/dal/assignments"
import { getCurrentUser } from "@/lib/auth/auth"
import { assignmentInsertSchema } from "@/lib/validation/insert"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const classId = searchParams.get("classId")

    if (classId) {
      const assignments = await assignmentService.getAssignmentsByClass(classId)
      return NextResponse.json(assignments)
    } else {
      const assignments = await assignmentService.getAssignments(user.id)
      return NextResponse.json(assignments)
    }
  } catch (error) {
    console.error("Error fetching assignments:", error)
    return NextResponse.json({ error: "Failed to fetch assignments" }, { status: 500 })
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
    const { success, error, data: parsedData } = assignmentInsertSchema.safeParse(data)
    if (!success) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    const result = await assignmentService.createAssignment(parsedData)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error creating assignment:", error)
    return NextResponse.json({ error: "Failed to create assignment" }, { status: 500 })
  }
}
