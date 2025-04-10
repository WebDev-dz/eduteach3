import { db } from "@/lib/db"
import { grades, students, assignments } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { v4 as uuidv4 } from "uuid"
import type { GradeCreateInput, GradeUpdateInput } from "@/lib/db/dal/grades"
import type { GradeWithDetails } from "@/services/grade-service"

export interface GradeServerService {
  getGrades: (teacherId: string) => Promise<GradeWithDetails[]>
  getGradeById: (id: string) => Promise<GradeWithDetails>
  getGradesByStudent: (studentId: string) => Promise<GradeWithDetails[]>
  getGradesByAssignment: (assignmentId: string) => Promise<GradeWithDetails[]>
  getGradesByClass: (classId: string) => Promise<GradeWithDetails[]>
  createGrade: (data: GradeCreateInput) => Promise<any>
  updateGrade: (data: GradeUpdateInput) => Promise<any>
  deleteGrade: (id: string, teacherId: string) => Promise<any>
}

export const gradeServerService: GradeServerService = {
  getGrades: async (teacherId: string) => {
    try {
      const gradesWithDetails = await db
        .select({
          id: grades.id,
          score: grades.score,
          feedback: grades.feedback,
          studentId: grades.studentId,
          assignmentId: grades.assignmentId,
          studentName: db.sql`CONCAT(${students.firstName}, ' ', ${students.lastName})`,
          assignmentTitle: assignments.title,
          createdAt: grades.createdAt,
          updatedAt: grades.updatedAt,
        })
        .from(grades)
        .leftJoin(students, eq(grades.studentId, students.id))
        .leftJoin(assignments, eq(grades.assignmentId, assignments.id))
        .where(eq(grades.teacherId, teacherId))

      return gradesWithDetails
    } catch (error) {
      console.error("Error fetching grades:", error)
      throw new Error("Failed to fetch grades")
    }
  },

  getGradeById: async (id: string) => {
    try {
      const [grade] = await db
        .select({
          id: grades.id,
          score: grades.score,
          feedback: grades.feedback,
          studentId: grades.studentId,
          assignmentId: grades.assignmentId,
          studentName: db.sql`CONCAT(${students.firstName}, ' ', ${students.lastName})`,
          assignmentTitle: assignments.title,
          createdAt: grades.createdAt,
          updatedAt: grades.updatedAt,
        })
        .from(grades)
        .leftJoin(students, eq(grades.studentId, students.id))
        .leftJoin(assignments, eq(grades.assignmentId, assignments.id))
        .where(eq(grades.id, id))

      if (!grade) {
        throw new Error("Grade not found")
      }

      return grade
    } catch (error) {
      console.error("Error fetching grade:", error)
      throw new Error("Failed to fetch grade")
    }
  },

  getGradesByStudent: async (studentId: string) => {
    try {
      const studentGrades = await db
        .select({
          id: grades.id,
          score: grades.score,
          feedback: grades.feedback,
          studentId: grades.studentId,
          assignmentId: grades.assignmentId,
          studentName: db.sql`CONCAT(${students.firstName}, ' ', ${students.lastName})`,
          assignmentTitle: assignments.title,
          createdAt: grades.createdAt,
          updatedAt: grades.updatedAt,
        })
        .from(grades)
        .leftJoin(students, eq(grades.studentId, students.id))
        .leftJoin(assignments, eq(grades.assignmentId, assignments.id))
        .where(eq(grades.studentId, studentId))

      return studentGrades
    } catch (error) {
      console.error("Error fetching grades by student:", error)
      throw new Error("Failed to fetch grades for student")
    }
  },

  getGradesByAssignment: async (assignmentId: string) => {
    try {
      const assignmentGrades = await db
        .select({
          id: grades.id,
          score: grades.score,
          feedback: grades.feedback,
          studentId: grades.studentId,
          assignmentId: grades.assignmentId,
          studentName: db.sql`CONCAT(${students.firstName}, ' ', ${students.lastName})`,
          assignmentTitle: assignments.title,
          createdAt: grades.createdAt,
          updatedAt: grades.updatedAt,
        })
        .from(grades)
        .leftJoin(students, eq(grades.studentId, students.id))
        .leftJoin(assignments, eq(grades.assignmentId, assignments.id))
        .where(eq(grades.assignmentId, assignmentId))

      return assignmentGrades
    } catch (error) {
      console.error("Error fetching grades by assignment:", error)
      throw new Error("Failed to fetch grades for assignment")
    }
  },

  getGradesByClass: async (classId: string) => {
    try {
      const classGrades = await db
        .select({
          id: grades.id,
          score: grades.score,
          feedback: grades.feedback,
          studentId: grades.studentId,
          assignmentId: grades.assignmentId,
          studentName: db.sql`CONCAT(${students.firstName}, ' ', ${students.lastName})`,
          assignmentTitle: assignments.title,
          createdAt: grades.createdAt,
          updatedAt: grades.updatedAt,
        })
        .from(grades)
        .leftJoin(students, eq(grades.studentId, students.id))
        .leftJoin(assignments, eq(grades.assignmentId, assignments.id))
        .where(eq(assignments.classId, classId))

      return classGrades
    } catch (error) {
      console.error("Error fetching grades by class:", error)
      throw new Error("Failed to fetch grades for class")
    }
  },

  createGrade: async (data: GradeCreateInput) => {
    try {
      const id = uuidv4()

      await db.insert(grades).values({
        id,
        studentId: data.studentId,
        assignmentId: data.assignmentId,
        score: data.score,
        feedback: data.feedback || null,
        teacherId: data.teacherId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      return { id }
    } catch (error) {
      console.error("Error creating grade:", error)
      throw new Error("Failed to create grade")
    }
  },

  updateGrade: async (data: GradeUpdateInput) => {
    try {
      const { id, teacherId, ...updateData } = data

      await db
        .update(grades)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(and(eq(grades.id, id), eq(grades.teacherId, teacherId)))

      return { id }
    } catch (error) {
      console.error("Error updating grade:", error)
      throw new Error("Failed to update grade")
    }
  },

  deleteGrade: async (id: string, teacherId: string) => {
    try {
      await db.delete(grades).where(and(eq(grades.id, id), eq(grades.teacherId, teacherId)))

      return { success: true }
    } catch (error) {
      console.error("Error deleting grade:", error)
      throw new Error("Failed to delete grade")
    }
  },
}
