"use server"
// @/lib/db/dal/material.ts
import { db } from "@/lib/db"
import { materials } from "@/lib/db/schema"
import { MaterialCreateInput, MaterialUpdateInput } from "@/types/entities"
import { eq, and } from "drizzle-orm"
import { v4 as uuidv4 } from "uuid"



// Server Service
const materialService = {
  getMaterials: async (teacherId: string) => {
    try {
      const result = await db.query.materials.findMany({
        where: eq(materials.teacherId, teacherId),
        orderBy: [materials.name],
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
        orderBy: [materials.name],
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

      const material = {...data}
      await db.insert(materials).values(material)

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

export const getMaterials = materialService.getMaterials
export const getMaterialById = materialService.getMaterialById
export const getMaterialsByClass = materialService.getMaterialsByClass
export const createMaterial = materialService.createMaterial
export const updateMaterial = materialService.updateMaterial
export const deleteMaterial = materialService.deleteMaterial

