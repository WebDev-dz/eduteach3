import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { assignmentSubmissions } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth"
import { v4 as uuidv4 } from "uuid"

// Add a comment to a submission
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const submissionId = params.id
    const { text } = await request.json()

    // Get the current submission
    const submission = await db.query.assignmentSubmissions.findFirst({
      where: eq(assignmentSubmissions.id, submissionId),
    })

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }

    // Create a new comment
    const newComment = {
      id: uuidv4(),
      author: {
        id: session.user.id,
        name: `${session.user.firstName} ${session.user.lastName}`,
        avatar: session.user.avatar,
      },
      text,
      timestamp: new Date(),
    }

    // Update the submission with the new comment
    const currentComments = submission.comments || []
    const updatedComments = [...currentComments, newComment]

    await db
      .update(assignmentSubmissions)
      .set({
        comments: updatedComments,
        updatedAt: new Date(),
      })
      .where(eq(assignmentSubmissions.id, submissionId))

    return NextResponse.json(newComment)
  } catch (error: any) {
    console.error("Error adding comment:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
