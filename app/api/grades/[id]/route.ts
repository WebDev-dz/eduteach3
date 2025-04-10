import { type NextRequest, NextResponse } from "next/server"
import { updateGrade, deleteGrade } from "@/lib/db/dal/grades"
import { getCurrentUser } from "@/lib/auth/auth"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const gradeId = params.id
    const data = await request.json()

    // Ensure the teacherId matches the authenticated user
    if (data.teacherId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Ensure the grade ID in the URL matches the one in the request body
    if (data.id !== gradeId) {
      return NextResponse.json({ error: "Grade ID mismatch" }, { status: 400 })
    }

    const result = await updateGrade(data)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error updating grade:", error)
    return NextResponse.json({ error: "Failed to update grade" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const gradeId = params.id
    const result = await deleteGrade(gradeId, user.id)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error deleting grade:", error)
    return NextResponse.json({ error: "Failed to delete grade" }, { status: 500 })
  }
}
