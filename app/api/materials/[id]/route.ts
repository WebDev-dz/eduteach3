import { type NextRequest, NextResponse } from "next/server"
import { materialService } from "@/lib/db/dal/materials"
import { getCurrentUser } from "@/lib/auth/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const materialId = params.id
    const material = await materialService.getMaterialById(materialId)

    if (!material) {
      return NextResponse.json({ error: "Material not found" }, { status: 404 })
    }

    // Check if the material belongs to the authenticated user
    if (material.teacherId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json(material)
  } catch (error) {
    console.error("Error fetching material:", error)
    return NextResponse.json({ error: "Failed to fetch material" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const materialId = params.id
    const data = await request.json()

    // Ensure the teacherId matches the authenticated user
    if (data.teacherId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Ensure the material ID in the URL matches the one in the request body
    if (data.id !== materialId) {
      return NextResponse.json({ error: "Material ID mismatch" }, { status: 400 })
    }

    const result = await materialService.updateMaterial(data)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error updating material:", error)
    return NextResponse.json({ error: "Failed to update material" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const materialId = params.id
    const result = await materialService.deleteMaterial(materialId, user.id)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error deleting material:", error)
    return NextResponse.json({ error: "Failed to delete material" }, { status: 500 })
  }
}
