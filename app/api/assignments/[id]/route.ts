import { type NextRequest, NextResponse } from "next/server"
import { assignmentService } from "@/lib/db/dal/assignments"
import { getCurrentUser } from "@/lib/auth/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const assignmentId = params.id
    const assignment = await assignmentService.getAssignmentById(assignmentId)

    if (!assignment) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 })
    }

    // Check if the assignment belongs to the authenticated user
    if (assignment.teacherId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json(assignment)
  } catch (error) {
    console.error("Error fetching assignment:", error)
    return NextResponse.json({ error: "Failed to fetch assignment" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const assignmentId = params.id
    const data = await request.json()

    // Ensure the teacherId matches the authenticated user
    if (data.teacherId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Ensure the assignment ID in the URL matches the one in the request body
    if (data.id !== assignmentId) {
      return NextResponse.json({ error: "Assignment ID mismatch" }, { status: 400 })
    }

    const result = await assignmentService.updateAssignment(data)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error updating assignment:", error)
    return NextResponse.json({ error: "Failed to update assignment" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const assignmentId = params.id
    const result = await assignmentService.deleteAssignment(assignmentId, user.id)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error deleting assignment:", error)
    return NextResponse.json({ error: "Failed to delete assignment" }, { status: 500 })
  }
}
