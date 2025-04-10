import { getStudentsByClass, getStudents, createStudent } from "@/lib/db/dal/students"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const teacherId = searchParams.get("teacherId")
    const classId = searchParams.get("classId")

    if (classId) {
      const students = await getStudentsByClass(classId)
      return NextResponse.json(students)
    }

    if (!teacherId) {
      return NextResponse.json({ error: "Teacher ID is required" }, { status: 400 })
    }

    const students = await getStudents(teacherId)
    return NextResponse.json(students)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    if (!data.teacherId) {
      return NextResponse.json({ error: "Teacher ID is required" }, { status: 400 })
    }

    const result = await createStudent(data)
    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
