import { db } from "@/lib/db"
import { materials } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { v4 as uuidv4 } from "uuid"

// Types
export type MaterialCreateInput = {
  title: string
  description?: string | null
  type: string
  url?: string | null
  fileKey?: string | null
  classId: string
  teacherId: string
}

export type MaterialUpdateInput = {
  id: string
  title?: string
  description?: string | null
  type?: string
  url?: string | null
  fileKey?: string | null
  classId?: string
  teacherId: string
}

// Server Service
export const materialService = {
  getMaterials: async (teacherId: string) => {
    try {
      const result = await db.query.materials.findMany({
        where: eq(materials.teacherId, teacherId),
        orderBy: [materials.title],
        with: {
          class: {
            columns: {
              name: true,
            },
          },
        },
      })

      return result
    } catch (error) {
      console.error("Error fetching materials:", error)
      throw new Error("Failed to fetch materials")
    }
  },

  getMaterialById: async (id: string) => {
    try {
      const result = await db.query.materials.findFirst({
        where: eq(materials.id, id),
        with: {
          class: {
            columns: {
              name: true,
              subject: true,
            },
          },
        },
      })

      if (!result) {
        throw new Error("Material not found")
      }

      return result
    } catch (error) {
      console.error("Error fetching material:", error)
      throw new Error("Failed to fetch material")
    }
  },

  getMaterialsByClass: async (classId: string) => {
    try {
      const result = await db.query.materials.findMany({
        where: eq(materials.classId, classId),
        orderBy: [materials.title],
      })

      return result
    } catch (error) {
      console.error("Error fetching materials by class:", error)
      throw new Error("Failed to fetch materials for class")
    }
  },

  createMaterial: async (data: MaterialCreateInput) => {
    try {
      const id = uuidv4()

      await db.insert(materials).values({
        id,
        title: data.title,
        description: data.description || null,
        type: data.type,
        url: data.url || null,
        fileKey: data.fileKey || null,
        classId: data.classId,
        teacherId: data.teacherId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      return { id }
    } catch (error) {
      console.error("Error creating material:", error)
      throw new Error("Failed to create material")
    }
  },

  updateMaterial: async (data: MaterialUpdateInput) => {
    try {
      const { id, teacherId, ...updateData } = data

      await db
        .update(materials)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(and(eq(materials.id, id), eq(materials.teacherId, teacherId)))

      return { id }
    } catch (error) {
      console.error("Error updating material:", error)
      throw new Error("Failed to update material")
    }
  },

  deleteMaterial: async (id: string, teacherId: string) => {
    try {
      await db.delete(materials).where(and(eq(materials.id, id), eq(materials.teacherId, teacherId)))

      return { success: true }
    } catch (error) {
      console.error("Error deleting material:", error)
      throw new Error("Failed to delete material")
    }
  },
}
