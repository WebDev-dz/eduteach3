import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { deleteUserFile } from "@/services/storage-service"

export async function DELETE(request: NextRequest, { params }: { params: { key: string } }) {
  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
    }

    // Delete the file
    const success = await deleteUserFile(session.user.id, params.key)

    if (!success) {
      return NextResponse.json({ success: false, error: "Failed to delete file" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting file:", error)
    return NextResponse.json({ success: false, error: "An error occurred while deleting the file" }, { status: 500 })
  }
}
