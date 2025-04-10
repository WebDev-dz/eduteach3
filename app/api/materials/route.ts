import { type NextRequest, NextResponse } from "next/server"
import { materialService } from "@/lib/db/dal/materials"
import { getCurrentUser } from "@/lib/auth/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const classId = searchParams.get("classId")

    if (classId) {
      const materials = await materialService.getMaterialsByClass(classId)
      return NextResponse.json(materials)
    } else {
      const materials = await materialService.getMaterials(user.id)
      return NextResponse.json(materials)
    }
  } catch (error) {
    console.error("Error fetching materials:", error)
    return NextResponse.json({ error: "Failed to fetch materials" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Ensure the teacherId matches the authenticated user
    if (data.teacherId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const result = await materialService.createMaterial(data)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error creating material:", error)
    return NextResponse.json({ error: "Failed to create material" }, { status: 500 })
  }
}
