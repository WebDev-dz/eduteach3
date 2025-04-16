"use server"

import { db } from "@/lib/db"
import { classes, classStudents } from "@/lib/db/schema"
import { ClassCreateInput, ClassUpdateInput } from "@/types/entities"
import { ClassService } from "@/types/services"
import { eq, and, sql } from "drizzle-orm"
import { v4 as uuidv4 } from "uuid"


type params = Parameters<typeof db.query.classes.findMany>

export const getClasses : ClassService["fetchClasses"] = async (teacherId: string) => {
  try {
    const result = await db.query.classes.findMany({
      where: eq(classes.teacherId, teacherId),
      with: {
        classStudents: true,
        assignments: true,
      },
      extras: {
        studentCount: sql<number>`count(*)`.as('count'),
        assignmentCount: sql<number>`count(*)`.as('count')
      },
      orderBy: [classes.name],
    });

    return result
  } catch (error) {
    console.error("Error fetching classes:", error)
    throw new Error("Failed to fetch classes")
  }
}

export const getClassById : ClassService["fetchClassById"] = async (classId: string)  => {
  try {
    const result = await db.query.classes.findFirst({
      where: eq(classes.id, classId),
    })

    if (!result) throw new Error("Class not found")

    return result
  } catch (error) {
    console.error("Error fetching class:", error)
    throw new Error("Failed to fetch class")
  }
}

export const getStudentsInClass : ClassService["fetchStudentsInClass"] = async (classId: string) => {
  try {
    const result = await db.query.classStudents.findMany({
      where: eq(classStudents.classId, classId),
      with: {
        student: true,
      },
    })

    return result.map(({ student }) => student)
  } catch (error) {
    console.error("Error fetching students in class:", error)
    throw new Error("Failed to fetch students in class")
  }
}

export const createClass : ClassService["createClass"] = async (data: ClassCreateInput) => {
  try {
    const id = uuidv4()
    await db.insert(classes).values({ ...data, id })

    return { id }
  } catch (error) {
    console.error("Error creating class:", error)
    throw new Error("Failed to create class")
  }
}
export const updateClass : ClassService["updateClass"] = async (data: ClassUpdateInput) => {
  try {
    const { id, teacherId, ...updateData } = data

    await db
      .update(classes)
      .set({ ...updateData, updatedAt: new Date() })
      .where(and(eq(classes.id, id), eq(classes.teacherId, teacherId)))

    return { id }
  } catch (error) {
    console.error("Error updating class:", error)
    throw new Error("Failed to update class")
  }
}
export const deleteClass : ClassService["deleteClass"] = async (id: string) => {
  try {
    await db
      .delete(classes)
      .where(eq(classes.id, id))

    return { success: true }
  } catch (error) {
    console.error("Error deleting class:", error)
    throw new Error("Failed to delete class")
  }
}
export const addStudentToClass : ClassService["addStudentToClass"] = async ({
  classId,
  studentId,
}: {
  classId: string
  studentId: string
}) => {
  try {
    await db.insert(classStudents).values({ classId, studentId })
    return { success: true }
  } catch (error) {
    console.error("Error adding student to class:", error)
    throw new Error("Failed to add student to class")
  }
}
export const removeStudentFromClass : ClassService["removeStudentFromClass"] = async ({
  classId,
  studentId,
}: {
  classId: string
  studentId: string
}) => {
  try {
    await db
      .delete(classStudents)
      .where(and(eq(classStudents.classId, classId), eq(classStudents.studentId, studentId)))

    return { success: true }
  } catch (error) {
    console.error("Error removing student from class:", error)
    throw new Error("Failed to remove student from class")
  }
}


