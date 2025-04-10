import { type NextRequest, NextResponse } from "next/server"
import { getServerSession, NextAuthOptions } from "next-auth"
import { db } from "@/lib/db"
import { classes } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { v4 as uuidv4 } from "uuid"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions as NextAuthOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const teacherId = session.user.id
    const searchParams = request.nextUrl.searchParams
    const classId = searchParams.get("classId")

    if (classId) {
      // Get a specific class
      const classData = await db.query.classes.findFirst({
        where: and(eq(classes.id, classId), eq(classes.teacherId, teacherId)),
      })

      if (!classData) {
        return NextResponse.json({ error: "Class not found" }, { status: 404 })
      }

      return NextResponse.json(classData)
    } else {
      // Get all classes for the teacher with student count
      const result = await db.query.classes.findMany({
        where: eq(classes.teacherId, teacherId),
        with: {
          classStudents: {
            columns: {},
            with: {
              student: {
                columns: {
                  id: true,
                },
              },
            },
          },
          assignments: {
            columns: {
              id: true,
            },
          },
        },
      })

      const classesWithCounts = result.map((classItem) => ({
        id: classItem.id,
        name: classItem.name,
        subject: classItem.subject,
        gradeLevel: classItem.gradeLevel,
        academicYear: classItem.academicYear,
        schedule: classItem.schedule,
        room: classItem.room,
        capacity: classItem.capacity,
        description: classItem.description,
        isActive: classItem.isActive,
        teacherId: classItem.teacherId,
        createdAt: classItem.createdAt,
        updatedAt: classItem.updatedAt,
        studentCount: classItem.classStudents.length,
        assignmentCount: classItem.assignments.length,
      }))

      return NextResponse.json(classesWithCounts)
    }
  } catch (error) {
    console.error("Error fetching classes:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions as NextAuthOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const teacherId = session.user.id

    // Validate required fields
    if (!data.name || !data.subject || !data.gradeLevel || !data.academicYear) {
      return NextResponse.json(
        { error: "Missing required fields: name, subject, gradeLevel, academicYear" },
        { status: 400 },
      )
    }

    // Create a new class
    const id = uuidv4()
    await db.insert(classes).values({
      id,
      name: data.name,
      subject: data.subject,
      gradeLevel: data.gradeLevel,
      academicYear: data.academicYear,
      schedule: data.schedule || null,
      room: data.room || null,
      capacity: data.capacity || null,
      description: data.description || null,
      isActive: data.isActive ?? true,
      teacherId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({ id, success: true })
  } catch (error) {
    console.error("Error creating class:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
