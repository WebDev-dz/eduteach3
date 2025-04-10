import { db } from "@/lib/db"
import { students, classStudents } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { v4 as uuidv4 } from "uuid"
import type { StudentCreateInput, StudentUpdateInput } from "@/lib/db/dal/students"

export interface StudentServerService {
  getStudents: (teacherId: string) => Promise<any[]>
  getStudentById: (id: string) => Promise<any>
  getStudentsByClass: (classId: string) => Promise<any[]>
  createStudent: (data: StudentCreateInput) => Promise<any>
  updateStudent: (data: StudentUpdateInput) => Promise<any>
  deleteStudent: (id: string, teacherId: string) => Promise<any>
}

export const studentServerService: StudentServerService = {
  getStudents: async (teacherId: string) => {
    try {
      const result = await db.query.students.findMany({
        where: eq(students.teacherId, teacherId),
        orderBy: [students.lastName, students.firstName],
      })
      return result
    } catch (error) {
      console.error("Error fetching students:", error)
      throw new Error("Failed to fetch students")
    }
  },

  getStudentById: async (id: string) => {
    try {
      const result = await db.query.students.findFirst({
        where: eq(students.id, id),
      })

      if (!result) {
        throw new Error("Student not found")
      }

      return result
    } catch (error) {
      console.error("Error fetching student:", error)
      throw new Error("Failed to fetch student")
    }
  },

  getStudentsByClass: async (classId: string) => {
    try {
      const result = await db.query.classStudents.findMany({
        where: eq(classStudents.classId, classId),
        with: {
          student: true,
        },
      })

      return result.map((item) => item.student)
    } catch (error) {
      console.error("Error fetching students by class:", error)
      throw new Error("Failed to fetch students for class")
    }
  },

  createStudent: async (data: StudentCreateInput) => {
    try {
      const id = uuidv4()

      await db.insert(students).values({
        id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        dateOfBirth: data.dateOfBirth || null,
        grade: data.grade || null,
        parentName: data.parentName || null,
        parentEmail: data.parentEmail || null,
        parentPhone: data.parentPhone || null,
        address: data.address || null,
        notes: data.notes || null,
        teacherId: data.teacherId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      return { id }
    } catch (error) {
      console.error("Error creating student:", error)
      throw new Error("Failed to create student")
    }
  },

  updateStudent: async (data: StudentUpdateInput) => {
    try {
      const { id, teacherId, ...updateData } = data

      await db
        .update(students)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(and(eq(students.id, id), eq(students.teacherId, teacherId)))

      return { id }
    } catch (error) {
      console.error("Error updating student:", error)
      throw new Error("Failed to update student")
    }
  },

  deleteStudent: async (id: string, teacherId: string) => {
    try {
      // First delete all class-student associations
      await db.delete(classStudents).where(eq(classStudents.studentId, id))

      // Then delete the student
      await db.delete(students).where(and(eq(students.id, id), eq(students.teacherId, teacherId)))

      return { success: true }
    } catch (error) {
      console.error("Error deleting student:", error)
      throw new Error("Failed to delete student")
    }
  },
}
