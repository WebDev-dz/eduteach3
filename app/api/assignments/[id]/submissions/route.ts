import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { assignmentSubmissions } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { v4 as uuidv4 } from "uuid"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth"

// Get all submissions for an assignment
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const assignmentId = params.id

    const submissions = await db.query.assignmentSubmissions.findMany({
      where: eq(assignmentSubmissions.assignmentId, assignmentId),
      with: {
        student: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: assignmentSubmissions.submissionDate,
    })

    return NextResponse.json(submissions)
  } catch (error: any) {
    console.error("Error fetching submissions:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Create a new submission
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const assignmentId = params.id
    const data = await request.json()

    const id = uuidv4()

    await db.insert(assignmentSubmissions).values({
      id,
      assignmentId,
      studentId: data.studentId,
      content: data.content,
      attachments: data.attachments || null,
      submissionDate: new Date(),
      isLate: data.isLate || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({ id })
  } catch (error: any) {
    console.error("Error creating submission:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
