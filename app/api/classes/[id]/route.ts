import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { db } from "@/lib/db"
import { classes, classStudents } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const teacherId = session.user.id
    const classId = params.id

    // Get the class details
    const classData = await db.query.classes.findFirst({
      where: and(eq(classes.id, classId), eq(classes.teacherId, teacherId)),
    })

    if (!classData) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 })
    }

    return NextResponse.json(classData)
  } catch (error) {
    console.error("Error fetching class:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const teacherId = session.user.id
    const classId = params.id
    const data = await request.json()

    // Check if the class exists and belongs to the teacher
    const existingClass = await db.query.classes.findFirst({
      where: and(eq(classes.id, classId), eq(classes.teacherId, teacherId)),
    })

    if (!existingClass) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 })
    }

    // Update the class
    await db
      .update(classes)
      .set({
        name: data.name !== undefined ? data.name : existingClass.name,
        subject: data.subject !== undefined ? data.subject : existingClass.subject,
        gradeLevel: data.gradeLevel !== undefined ? data.gradeLevel : existingClass.gradeLevel,
        academicYear: data.academicYear !== undefined ? data.academicYear : existingClass.academicYear,
        schedule: data.schedule !== undefined ? data.schedule : existingClass.schedule,
        room: data.room !== undefined ? data.room : existingClass.room,
        capacity: data.capacity !== undefined ? data.capacity : existingClass.capacity,
        description: data.description !== undefined ? data.description : existingClass.description,
        isActive: data.isActive !== undefined ? data.isActive : existingClass.isActive,
        updatedAt: new Date(),
      })
      .where(and(eq(classes.id, classId), eq(classes.teacherId, teacherId)))

    return NextResponse.json({ id: classId, success: true })
  } catch (error) {
    console.error("Error updating class:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const teacherId = session.user.id
    const classId = params.id

    // Check if the class exists and belongs to the teacher
    const existingClass = await db.query.classes.findFirst({
      where: and(eq(classes.id, classId), eq(classes.teacherId, teacherId)),
    })

    if (!existingClass) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 })
    }

    // First delete all class-student associations
    await db.delete(classStudents).where(eq(classStudents.classId, classId))

    // Then delete the class itself
    await db.delete(classes).where(and(eq(classes.id, classId), eq(classes.teacherId, teacherId)))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting class:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
