import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { ensureAvatarsBucket, initializeUserStorage } from "@/lib/db/dal/storage"

export async function POST() {
  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
    }

    // Initialize user storage
    const userStorageInitialized = await initializeUserStorage(session.user.id)

    // Ensure avatars bucket exists
    const avatarsBucketExists = await ensureAvatarsBucket()

    if (!userStorageInitialized || !avatarsBucketExists) {
      return NextResponse.json({ success: false, error: "Failed to initialize storage" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error initializing storage:", error)
    return NextResponse.json({ success: false, error: "An error occurred while initializing storage" }, { status: 500 })
  }
}
