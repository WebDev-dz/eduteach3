import { db } from "@/lib/db"
import { lessonPlans } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { v4 as uuidv4 } from "uuid"
import { classes } from '../schema';

// Types
export type LessonPlanCreateInput = typeof lessonPlans.$inferInsert

export type LessonPlanUpdateInput = typeof lessonPlans.$inferSelect

// Server Service

export const getLessonPlans = async (teacherId: string) => {
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
}

export const  getLessonPlanById = async (id: string) => {
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
}

export const getLessonPlansByClass = async (classId: string) => {
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
}

export const createLessonPlan = async (data: LessonPlanCreateInput) => {
  try {
    const id = uuidv4()
    const lessonPlan: LessonPlanCreateInput = {...data}

    await db.insert(lessonPlans).values(lessonPlan)

    return { id }
  } catch (error) {
    console.error("Error creating lesson plan:", error)
    throw new Error("Failed to create lesson plan")
  }
}

export const updateLessonPlan = async (data: LessonPlanUpdateInput) => {
  try {
    const { id, teacherId, ...updateData } = data

    // Handle date conversion if date is provided
    let processedData = { ...updateData }
    if (updateData.date) {
      processedData.date = (new Date(updateData.date)).toISOString()
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
}

export const deleteLessonPlan = async (id: string, teacherId: string) => {
  try {
    await db.delete(lessonPlans).where(and(eq(lessonPlans.id, id), eq(lessonPlans.teacherId, teacherId)))

    return { success: true }
  } catch (error) {
    console.error("Error deleting lesson plan:", error)
    throw new Error("Failed to delete lesson plan")
  }
}

