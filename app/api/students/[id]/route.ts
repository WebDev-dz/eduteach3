import { type NextRequest, NextResponse } from "next/server"
import { updateStudent, deleteStudent, getStudentById } from "@/lib/db/dal/students"
import { getCurrentUser } from "@/lib/auth/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const studentId = params.id
    const student = await getStudentById(studentId, user.id)

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    return NextResponse.json(student)
  } catch (error) {
    console.error("Error fetching student:", error)
    return NextResponse.json({ error: "Failed to fetch student" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const studentId = params.id
    const data = await request.json()

    // Ensure the teacherId matches the authenticated user
    if (data.teacherId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Ensure the student ID in the URL matches the one in the request body
    if (data.id !== studentId) {
      return NextResponse.json({ error: "Student ID mismatch" }, { status: 400 })
    }

    const result = await updateStudent(data)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error updating student:", error)
    return NextResponse.json({ error: "Failed to update student" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const studentId = params.id
    const result = await deleteStudent(studentId, user.id)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error deleting student:", error)
    return NextResponse.json({ error: "Failed to delete student" }, { status: 500 })
  }
}
