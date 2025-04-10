import { db } from "@/lib/db"
import { assignments, grades } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { v4 as uuidv4 } from "uuid"

// Types
export type AssignmentCreateInput = {
  title: string
  type?: string
  description?: string | null
  dueDate?: string | Date
  totalPoints?: number
  estimatedTime?: number | null
  instructions?: string
  allowLateSubmissions?: boolean
  timeLimit?: number | null
  status?: string
  resources?: string | null
  classId: string
  teacherId: string
}

export type AssignmentUpdateInput = {
  id: string
  title?: string
  type?: string
  description?: string | null
  dueDate?: string | Date
  totalPoints?: number
  estimatedTime?: number | null
  instructions?: string
  allowLateSubmissions?: boolean
  timeLimit?: number | null
  status?: string
  resources?: string | null
  classId?: string
  teacherId: string
}

// Server Service
export const assignmentService = {
  getAssignments: async (teacherId: string) => {
    try {
      const result = await db.query.assignments.findMany({
        where: eq(assignments.teacherId, teacherId),
        orderBy: [assignments.dueDate],
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
      console.error("Error fetching assignments:", error)
      throw new Error("Failed to fetch assignments")
    }
  },

  getAssignmentById: async (id: string) => {
    try {
      const result = await db.query.assignments.findFirst({
        where: eq(assignments.id, id),
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
        throw new Error("Assignment not found")
      }

      return result
    } catch (error) {
      console.error("Error fetching assignment:", error)
      throw new Error("Failed to fetch assignment")
    }
  },

  getAssignmentsByClass: async (classId: string) => {
    try {
      const result = await db.query.assignments.findMany({
        where: eq(assignments.classId, classId),
        orderBy: [assignments.dueDate],
      })

      return result
    } catch (error) {
      console.error("Error fetching assignments by class:", error)
      throw new Error("Failed to fetch assignments for class")
    }
  },

  createAssignment: async (data: AssignmentCreateInput) => {
    try {
      const id = uuidv4()

      await db.insert(assignments).values({
        id,
        title: data.title,
        type: data.type || "assignment",
        description: data.description || null,
        dueDate: data.dueDate ? new Date(data.dueDate) : new Date(),
        totalPoints: data.totalPoints || 100,
        estimatedTime: data.estimatedTime,
        instructions: data.instructions || "",
        allowLateSubmissions: data.allowLateSubmissions || false,
        timeLimit: data.timeLimit,
        status: data.status || "draft",
        resources: data.resources || null,
        classId: data.classId,
        teacherId: data.teacherId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      return { id }
    } catch (error) {
      console.error("Error creating assignment:", error)
      throw new Error("Failed to create assignment")
    }
  },

  updateAssignment: async (data: AssignmentUpdateInput) => {
    try {
      const { id, teacherId, ...updateData } = data

      // Handle date conversion if dueDate is provided
      const processedData = { ...updateData }
      if (updateData.dueDate) {
        processedData.dueDate = new Date(updateData.dueDate)
      }

      await db
        .update(assignments)
        .set({
          ...processedData,
          updatedAt: new Date(),
        })
        .where(and(eq(assignments.id, id), eq(assignments.teacherId, teacherId)))

      return { id }
    } catch (error) {
      console.error("Error updating assignment:", error)
      throw new Error("Failed to update assignment")
    }
  },

  deleteAssignment: async (id: string, teacherId: string) => {
    try {
      // First delete all grades associated with this assignment
      await db.delete(grades).where(eq(grades.assignmentId, id))

      // Then delete the assignment itself
      await db.delete(assignments).where(and(eq(assignments.id, id), eq(assignments.teacherId, teacherId)))

      return { success: true }
    } catch (error) {
      console.error("Error deleting assignment:", error)
      throw new Error("Failed to delete assignment")
    }
  },
}
