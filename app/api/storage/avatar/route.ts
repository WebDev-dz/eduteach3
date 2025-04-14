import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { uploadAvatar } from "@/services/storage-service"

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
    }

    // Get form data with file
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 })
    }

    // Upload the avatar
    const result = await uploadAvatar(session.user.id, file)

    if (!result) {
      return NextResponse.json({ success: false, error: "Failed to upload avatar" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("Error uploading avatar:", error)
    return NextResponse.json({ success: false, error: "An error occurred while uploading the avatar" }, { status: 500 })
  }
}
