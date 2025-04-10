import { db } from "@/lib/db"
import { lessonPlans } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { v4 as uuidv4 } from "uuid"
import type { LessonPlanCreateInput, LessonPlanUpdateInput } from "@/lib/db/dal/lesson-plans"

export interface LessonPlanServerService {
  getLessonPlans: (teacherId: string) => Promise<any[]>
  getLessonPlanById: (id: string) => Promise<any>
  getLessonPlansByClass: (classId: string) => Promise<any[]>
  createLessonPlan: (data: LessonPlanCreateInput) => Promise<any>
  updateLessonPlan: (data: LessonPlanUpdateInput) => Promise<any>
  deleteLessonPlan: (id: string, teacherId: string) => Promise<any>
}

export const lessonPlanServerService: LessonPlanServerService = {
  getLessonPlans: async (teacherId: string) => {
    try {
      const result = await db.query.lessonPlans.findMany({
        where: eq(lessonPlans.teacherId, teacherId),
        orderBy: [lessonPlans.date],
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
      console.error("Error fetching lesson plans:", error)
      throw new Error("Failed to fetch lesson plans")
    }
  },

  getLessonPlanById: async (id: string) => {
    try {
      const result = await db.query.lessonPlans.findFirst({
        where: eq(lessonPlans.id, id),
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
        throw new Error("Lesson plan not found")
      }

      return result
    } catch (error) {
      console.error("Error fetching lesson plan:", error)
      throw new Error("Failed to fetch lesson plan")
    }
  },

  getLessonPlansByClass: async (classId: string) => {
    try {
      const result = await db.query.lessonPlans.findMany({
        where: eq(lessonPlans.classId, classId),
        orderBy: [lessonPlans.date],
      })

      return result
    } catch (error) {
      console.error("Error fetching lesson plans by class:", error)
      throw new Error("Failed to fetch lesson plans for class")
    }
  },

  createLessonPlan: async (data: LessonPlanCreateInput) => {
    try {
      const id = uuidv4()

      await db.insert(lessonPlans).values({
        id,
        title: data.title,
        description: data.description || null,
        objectives: data.objectives,
        content: data.content,
        date: new Date(data.date),
        duration: data.duration,
        classId: data.classId,
        teacherId: data.teacherId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      return { id }
    } catch (error) {
      console.error("Error creating lesson plan:", error)
      throw new Error("Failed to create lesson plan")
    }
  },

  updateLessonPlan: async (data: LessonPlanUpdateInput) => {
    try {
      const { id, teacherId, ...updateData } = data

      // Handle date conversion if date is provided
      const processedData = { ...updateData }
      if (updateData.date) {
        processedData.date = new Date(updateData.date)
      }

      await db
        .update(lessonPlans)
        .set({
          ...processedData,
          updatedAt: new Date(),
        })
        .where(and(eq(lessonPlans.id, id), eq(lessonPlans.teacherId, teacherId)))

      return { id }
    } catch (error) {
      console.error("Error updating lesson plan:", error)
      throw new Error("Failed to update lesson plan")
    }
  },

  deleteLessonPlan: async (id: string, teacherId: string) => {
    try {
      await db.delete(lessonPlans).where(and(eq(lessonPlans.id, id), eq(lessonPlans.teacherId, teacherId)))

      return { success: true }
    } catch (error) {
      console.error("Error deleting lesson plan:", error)
      throw new Error("Failed to delete lesson plan")
    }
  },
}
