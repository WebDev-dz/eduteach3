import { db } from "@/lib/db"
import { classes, classStudents } from "@/lib/db/schema"
import { eq, and, sql } from "drizzle-orm"
import { cache } from "react"
import { v4 as uuidv4 } from "uuid"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

export type ClassWithStudentCount = {
  id: string
  name: string
  subject: string
  gradeLevel: string
  schedule: string | null
  room: string | null
  studentCount: number
  assignmentCount: number
}

export type ClassCreateInput = {
  name: string
  subject: string
  gradeLevel: string
  academicYear: string
  schedule?: string
  room?: string
  capacity?: number
  description?: string
  isActive: boolean
  teacherId: string
}

export type ClassUpdateInput = Partial<Omit<ClassCreateInput, "teacherId">> & {
  id: string
  teacherId: string
}

// Cache the result for the same request
export const getClasses = cache(async (teacherId: string): Promise<ClassWithStudentCount[]> => {
  const result = await db.query.classes.findMany({
    where: eq(classes.teacherId, teacherId),
    columns: {
      id: true,
      name: true,
      subject: true,
      gradeLevel: true,
      schedule: true,
      room: true,
    },
    with: {
      classStudents: {
        columns: {},
        with: {
          student: {
            columns: {
              id: true,
            },
          },
        },
      },
      assignments: {
        columns: {
          id: true,
        },
      },
    },
  })

  return result.map((classItem) => ({
    id: classItem.id,
    name: classItem.name,
    subject: classItem.subject,
    gradeLevel: classItem.gradeLevel,
    schedule: classItem.schedule,
    room: classItem.room,
    studentCount: classItem.classStudents.length,
    assignmentCount: classItem.assignments.length,
  }))
})

export const getClassById = cache(async (classId: string, teacherId: string) => {
  return await db.query.classes.findFirst({
    where: and(eq(classes.id, classId), eq(classes.teacherId, teacherId)),
  })
})

export const getClassStudents = cache(async (classId: string) => {
  const result = await db.query.classStudents.findMany({
    where: eq(classStudents.classId, classId),
    with: {
      student: true,
    },
  })

  return result.map((item) => item.student)
})

export const getStudentCountByClass = cache(async (teacherId: string) => {
  const result = await db.execute(sql`
    SELECT c.id, c.name, COUNT(cs.student_id) as student_count
    FROM classes c
    LEFT JOIN class_students cs ON c.id = cs.class_id
    WHERE c.teacher_id = ${teacherId}
    GROUP BY c.id, c.name
    ORDER BY c.name
  `)

  return result.rows as { id: string; name: string; student_count: number }[]
})

// Create a new class
export async function createClass(data: ClassCreateInput) {
  const id = uuidv4()

  await db.insert(classes).values({
    id,
    name: data.name,
    subject: data.subject,
    gradeLevel: data.gradeLevel,
    academicYear: data.academicYear,
    schedule: data.schedule || null,
    room: data.room || null,
    capacity: data.capacity || null,
    description: data.description || null,
    isActive: data.isActive,
    teacherId: data.teacherId,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  return { id }
}

// Update an existing class
export async function updateClass(data: ClassUpdateInput) {
  const { id, teacherId, ...updateData } = data

  await db
    .update(classes)
    .set({
      ...updateData,
      updatedAt: new Date(),
    })
    .where(and(eq(classes.id, id), eq(classes.teacherId, teacherId)))

  return { id }
}

// Delete a class
export async function deleteClass(id: string, teacherId: string) {
  // First delete all class-student associations
  await db.delete(classStudents).where(eq(classStudents.classId, id))

  // Then delete the class itself
  await db.delete(classes).where(and(eq(classes.id, id), eq(classes.teacherId, teacherId)))

  return { success: true }
}

// Add a student to a class
export async function addStudentToClass(classId: string, studentId: string) {
  await db.insert(classStudents).values({
    classId,
    studentId,
    createdAt: new Date(),
  })

  return { success: true }
}

// Remove a student from a class
export async function removeStudentFromClass(classId: string, studentId: string) {
  await db.delete(classStudents).where(and(eq(classStudents.classId, classId), eq(classStudents.studentId, studentId)))

  return { success: true }
}

// Server Actions
// Validation schema for class creation
const classSchema = z.object({
  name: z.string().min(1, "Name is required"),
  subject: z.string().min(1, "Subject is required"),
  gradeLevel: z.string().min(1, "Grade level is required"),
  academicYear: z.string().min(1, "Academic year is required"),
  schedule: z.string().optional(),
  room: z.string().optional(),
  capacity: z.coerce.number().optional(),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
})

// Create class action
export async function createClassAction(prevState: any, formData: FormData) {
  "use server"

  try {
    // Get the teacher ID from the session or form
    const teacherId = formData.get("teacherId") as string

    if (!teacherId) {
      return { error: "Teacher ID is required" }
    }

    // Parse and validate the form data
    const validatedFields = classSchema.safeParse({
      name: formData.get("name"),
      subject: formData.get("subject"),
      gradeLevel: formData.get("gradeLevel"),
      academicYear: formData.get("academicYear"),
      schedule: formData.get("schedule"),
      room: formData.get("room"),
      capacity: formData.get("capacity"),
      description: formData.get("description"),
      isActive: formData.get("isActive") === "true",
    })

    if (!validatedFields.success) {
      return {
        error: validatedFields.error.flatten().fieldErrors,
      }
    }

    // Create the class
    const result = await createClass({
      ...validatedFields.data,
      teacherId,
    })

    // Revalidate the classes page
    revalidatePath("/classes")

    // Redirect to the classes page
    redirect("/classes")
  } catch (error) {
    return {
      error: "Failed to create class. Please try again.",
    }
  }
}

// Update class action
export async function updateClassAction(prevState: any, formData: FormData) {
  "use server"

  try {
    // Get the class ID and teacher ID
    const classId = formData.get("id") as string
    const teacherId = formData.get("teacherId") as string

    if (!classId || !teacherId) {
      return { error: "Class ID and Teacher ID are required" }
    }

    // Parse and validate the form data
    const validatedFields = classSchema.safeParse({
      name: formData.get("name"),
      subject: formData.get("subject"),
      gradeLevel: formData.get("gradeLevel"),
      academicYear: formData.get("academicYear"),
      schedule: formData.get("schedule"),
      room: formData.get("room"),
      capacity: formData.get("capacity"),
      description: formData.get("description"),
      isActive: formData.get("isActive") === "true",
    })

    if (!validatedFields.success) {
      return {
        error: validatedFields.error.flatten().fieldErrors,
      }
    }

    // Update the class
    await updateClass({
      id: classId,
      teacherId,
      ...validatedFields.data,
    })

    // Revalidate the classes page and the specific class page
    revalidatePath("/classes")
    revalidatePath(`/classes/${classId}`)

    // Redirect to the classes page
    redirect("/classes")
  } catch (error) {
    return {
      error: "Failed to update class. Please try again.",
    }
  }
}

// Delete class action
export async function deleteClassAction(classId: string, teacherId: string) {
  "use server"

  try {
    await deleteClass(classId, teacherId)

    // Revalidate the classes page
    revalidatePath("/classes")

    return { success: true }
  } catch (error) {
    return {
      error: "Failed to delete class. Please try again.",
    }
  }
}

// Add student to class action
export async function addStudentToClassAction(classId: string, studentId: string) {
  "use server"

  try {
    await addStudentToClass(classId, studentId)

    // Revalidate the relevant paths
    revalidatePath(`/classes/${classId}`)
    revalidatePath(`/students/${studentId}`)

    return { success: true }
  } catch (error) {
    return {
      error: "Failed to add student to class. Please try again.",
    }
  }
}

// Remove student from class action
export async function removeStudentFromClassAction(classId: string, studentId: string) {
  "use server"

  try {
    await removeStudentFromClass(classId, studentId)

    // Revalidate the relevant paths
    revalidatePath(`/classes/${classId}`)
    revalidatePath(`/students/${studentId}`)

    return { success: true }
  } catch (error) {
    return {
      error: "Failed to remove student from class. Please try again.",
    }
  }
}
