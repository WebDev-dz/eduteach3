"use server"
import { db } from "@/lib/db"
import { students, classStudents, grades } from "@/lib/db/schema"
import { StudentData, StudentCreateInput, StudentUpdateInput } from "@/types/entities"
import { StudentServerService } from "@/types/services"
import { eq, and } from "drizzle-orm"
import { v4 as uuidv4 } from "uuid"




export const getStudents = async (teacherId: string): Promise<StudentData[]> => {
  try {
    const result = await db.query.students.findMany({
      where: eq(students.teacherId, teacherId),
      
      with: {
        classStudents: {
          with: {
            class: {
              columns: {
                
                id: true,
                name: true,
              },
            },
          },
        },
        grades: {
          columns: {
            score: true,
            maxScore: true,
          },
        },
      },
    })
  
    return result.map((student) => {
      // Calculate average performance
      const totalGrades = student.grades.length
      const performance =
        totalGrades > 0
          ? Math.round(student.grades.reduce((sum, grade) => sum + (Number(grade.score) / Number(grade.maxScore)) * 100, 0) / totalGrades)
          : 0
  
      return {
        ...student,
        enrollmentDate: student.enrollmentDate,
        classCount: student.classStudents.length,
        performance,
        status: "Active", // Default status, could be stored in DB
      }
    })
  } catch (error) {
    console.error("Error fetching students:", error)
    throw new Error("Failed to fetch students")
  }
}

export const getStudentById = async (id: string) => {
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
}

export const getStudentsByClass = async (classId: string) => {
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
}

export const createStudent = async (data: StudentCreateInput) => {
  try {
    const id = uuidv4()
    const student = {...data, id, createdAt: new Date(), updatedAt: new Date()}
    await db.insert(students).values(student)

    return { id }
  } catch (error) {
    console.error("Error creating student:", error)
    throw new Error("Failed to create student")
  }
}

export const updateStudent = async (data: StudentUpdateInput) => {
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
}

export const deleteStudent = async (id: string) => {
  try {
    // First delete all class-student associations
    await db.delete(classStudents).where(eq(classStudents.studentId, id))

    // Then delete the student
    await db.delete(students).where(eq(students.id, id))

    return { success: true }
  } catch (error) {
    console.error("Error deleting student:", error)
    throw new Error("Failed to delete student")
  }
}




  


