import { db } from "@/lib/db"
import { students, classStudents, grades } from "@/lib/db/schema"
import { eq, and, sql, desc } from "drizzle-orm"
import { cache } from "react"
import { v4 as uuidv4 } from "uuid"
import { revalidatePath } from "next/cache"
import { z } from "zod"

export type StudentWithPerformance = {
  id: string
  studentId: string
  firstName: string
  lastName: string
  email: string | null
  dateOfBirth: Date | null
  gender: string | null
  enrollmentDate: Date | null
  classCount: number
  performance: number
  status: "Active" | "Inactive"
}

export type StudentCreateInput = {
  studentId: string
  firstName: string
  lastName: string
  email?: string
  dateOfBirth?: Date
  gender?: string
  enrollmentDate?: Date
  previousSchool?: string
  specialNeeds?: boolean
  academicNotes?: string
  address?: string
  phone?: string
  emergencyContact?: string
  emergencyPhone?: string
  relationship?: string
  teacherId: string
  classId?: string // Optional class to add the student to
}

export type StudentUpdateInput = Partial<Omit<StudentCreateInput, "teacherId">> & {
  id: string
  teacherId: string
}

// Cache the result for the same request
export const getStudents = cache(async (teacherId: string): Promise<StudentWithPerformance[]> => {
  const result = await db.query.students.findMany({
    where: eq(students.teacherId, teacherId),
    columns: {
      id: true,
      studentId: true,
      firstName: true,
      lastName: true,
      email: true,
      dateOfBirth: true,
      gender: true,
      enrollmentDate: true,
    },
    with: {
      classStudents: {
        columns: {},
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
        ? Math.round(student.grades.reduce((sum, grade) => sum + (grade.score / grade.maxScore) * 100, 0) / totalGrades)
        : 0

    return {
      id: student.id,
      studentId: student.studentId,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      dateOfBirth: student.dateOfBirth,
      gender: student.gender,
      enrollmentDate: student.enrollmentDate,
      classCount: student.classStudents.length,
      performance,
      status: "Active", // Default status, could be stored in DB
    }
  })
})

export const getStudentById = cache(async (studentId: string, teacherId: string) => {
  return await db.query.students.findFirst({
    where: and(eq(students.id, studentId), eq(students.teacherId, teacherId)),
    with: {
      classStudents: {
        with: {
          class: true,
        },
      },
      grades: {
        with: {
          assignment: true,
        },
      },
    },
  })
})

export const getStudentsByClass = cache(async (classId: string) => {
  const result = await db.query.classStudents.findMany({
    where: eq(classStudents.classId, classId),
    with: {
      student: true,
    },
  })

  return result.map((item) => item.student)
})

export const getTopPerformingStudents = cache(async (teacherId: string, limit = 5) => {
  const result = await db.execute(sql`
    SELECT 
      s.id, 
      s.student_id, 
      s.first_name, 
      s.last_name, 
      AVG(g.score * 100 / g.max_score) as performance
    FROM students s
    JOIN grades g ON s.id = g.student_id
    WHERE s.teacher_id = ${teacherId}
    GROUP BY s.id, s.student_id, s.first_name, s.last_name
    ORDER BY performance DESC
    LIMIT ${limit}
  `)

  return result.rows.map((row: any) => ({
    id: row.id,
    studentId: row.student_id,
    firstName: row.first_name,
    lastName: row.last_name,
    performance: Math.round(Number(row.performance) || 0),
  }))
})

// Create a new student
export async function createStudent(data: StudentCreateInput) {
  const id = uuidv4()

  await db.insert(students).values({
    id,
    studentId: data.studentId,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email || null,
    dateOfBirth: data.dateOfBirth || null,
    gender: data.gender || null,
    enrollmentDate: data.enrollmentDate || new Date(),
    previousSchool: data.previousSchool || null,
    specialNeeds: data.specialNeeds || false,
    academicNotes: data.academicNotes || null,
    address: data.address || null,
    phone: data.phone || null,
    emergencyContact: data.emergencyContact || null,
    emergencyPhone: data.emergencyPhone || null,
    relationship: data.relationship || null,
    teacherId: data.teacherId,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  // If a class ID is provided, add the student to that class
  if (data.classId) {
    await db.insert(classStudents).values({
      classId: data.classId,
      studentId: id,
      enrollmentDate: new Date().toISOString(),
    })
  }

  return { id }
}

// Update an existing student
export async function updateStudent(data: StudentUpdateInput) {
  const { id, teacherId, ...updateData } = data

  await db
    .update(students)
    .set({
      ...updateData,
      updatedAt: new Date(),
    })
    .where(and(eq(students.id, id), eq(students.teacherId, teacherId)))

  return { id }
}

// Delete a student
export async function deleteStudent(id: string, teacherId: string) {
  // First delete all class-student associations
  await db.delete(classStudents).where(eq(classStudents.studentId, id))

  // Delete all grades for this student
  await db.delete(grades).where(eq(grades.studentId, id))

  // Then delete the student
  await db.delete(students).where(and(eq(students.id, id), eq(students.teacherId, teacherId)))

  return { success: true }
}

// Get student enrollment history
export const getStudentEnrollmentHistory = cache(async (studentId: string) => {
  return await db.query.classStudents.findMany({
    where: eq(classStudents.studentId, studentId),
    with: {
      class: true,
    },
    orderBy: desc(classStudents.enrollmentDate),
  })
})

// Server Actions
const studentSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  dateOfBirth: z.string().optional(),
  grade: z.string().optional(),
  parentName: z.string().optional(),
  parentEmail: z.string().email("Invalid parent email address").optional(),
  parentPhone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
})

export async function createStudentAction(prevState: any, formData: FormData) {
  "use server"

  try {
    const teacherId = formData.get("teacherId") as string

    if (!teacherId) {
      return { error: "Teacher ID is required" }
    }

    // Parse and validate form data
    const rawData = Object.fromEntries(formData.entries())
    const validationResult = studentSchema.safeParse(rawData)

    if (!validationResult.success) {
      return {
        error: "Validation failed",
        fieldErrors: validationResult.error.flatten().fieldErrors,
      }
    }

    const data = {
      ...validationResult.data,
      teacherId,
      studentId: (formData.get("studentId") as string) || `STU-${Date.now().toString().slice(-6)}`,
    }

    const result = await createStudent(data as StudentCreateInput)

    // Revalidate the students page
    revalidatePath("/students")

    return { success: true, id: result.id }
  } catch (error: any) {
    console.error("Error in createStudentAction:", error)
    return { error: error.message || "Failed to create student" }
  }
}

export async function updateStudentAction(prevState: any, formData: FormData) {
  "use server"

  try {
    const teacherId = formData.get("teacherId") as string
    const id = formData.get("id") as string

    if (!id || !teacherId) {
      return { error: "Student ID and Teacher ID are required" }
    }

    // Parse and validate form data
    const rawData = Object.fromEntries(formData.entries())
    const validationResult = studentSchema.safeParse(rawData)

    if (!validationResult.success) {
      return {
        error: "Validation failed",
        fieldErrors: validationResult.error.flatten().fieldErrors,
      }
    }

    const data = {
      ...validationResult.data,
      id,
      teacherId,
    }

    await updateStudent(data as StudentUpdateInput)

    // Revalidate the students page and the student detail page
    revalidatePath("/students")
    revalidatePath(`/students/${id}`)

    return { success: true }
  } catch (error: any) {
    console.error("Error in updateStudentAction:", error)
    return { error: error.message || "Failed to update student" }
  }
}

export async function deleteStudentAction(id: string, teacherId: string) {
  "use server"

  try {
    if (!id || !teacherId) {
      return { error: "Student ID and Teacher ID are required" }
    }

    await deleteStudent(id, teacherId)

    // Revalidate the students page
    revalidatePath("/students")

    return { success: true }
  } catch (error: any) {
    console.error("Error in deleteStudentAction:", error)
    return { error: error.message || "Failed to delete student" }
  }
}

export async function addStudent(formData: FormData) {
  "use server"

  try {
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const classId = formData.get("classId") as string
    const teacherId = formData.get("teacherId") as string

    if (!firstName || !lastName || !email || !teacherId) {
      return { error: "Missing required fields" }
    }

    const studentId = `STU-${Date.now().toString().slice(-6)}`

    const result = await createStudent({
      firstName,
      lastName,
      email,
      studentId,
      teacherId,
      classId: classId || undefined,
    })

    revalidatePath("/students")

    return { success: true, id: result.id }
  } catch (error: any) {
    return { error: error.message || "Failed to add student" }
  }
}
