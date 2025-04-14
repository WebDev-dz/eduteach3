import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { listUserFiles } from "@/services/storage-service"

export async function GET(request: NextRequest) {
  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
    }

    // Get path from query params
    const url = new URL(request.url)
    const path = url.searchParams.get("path") || undefined

    // List files
    const files = await listUserFiles(session.user.id, path)

    if (files === null) {
      return NextResponse.json({ success: false, error: "Failed to list files" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: files })
  } catch (error) {
    console.error("Error listing files:", error)
    return NextResponse.json({ success: false, error: "An error occurred while listing files" }, { status: 500 })
  }
}
