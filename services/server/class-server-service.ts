import { db } from "@/lib/db"
import { classes, classStudents, students } from "@/lib/db/schema"
import { eq, and, sql } from "drizzle-orm"
import { v4 as uuidv4 } from "uuid"
import type { ClassCreateInput, ClassUpdateInput, ClassWithStudentCount } from "@/lib/db/dal/classes"
import type { StudentInClass } from "@/services/class-service"

export interface ClassServerService {
  getClasses: (teacherId: string) => Promise<ClassWithStudentCount[]>
  getClassById: (id: string, teacherId: string) => Promise<any>
  getStudentsInClass: (classId: string) => Promise<StudentInClass[]>
  createClass: (data: ClassCreateInput) => Promise<any>
  updateClass: (data: ClassUpdateInput) => Promise<any>
  deleteClass: (id: string, teacherId: string) => Promise<any>
  addStudentToClass: (classId: string, studentId: string) => Promise<any>
  removeStudentFromClass: (classId: string, studentId: string) => Promise<any>
  getStudentCountByClass: (teacherId: string) => Promise<any[]>
}

export const classServerService: ClassServerService = {
  getClasses: async (teacherId: string) => {
    try {
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
    } catch (error) {
      console.error("Error fetching classes:", error)
      throw new Error("Failed to fetch classes")
    }
  },

  getClassById: async (id: string, teacherId: string) => {
    try {
      const result = await db.query.classes.findFirst({
        where: and(eq(classes.id, id), eq(classes.teacherId, teacherId)),
      })

      if (!result) {
        throw new Error("Class not found")
      }

      return result
    } catch (error) {
      console.error("Error fetching class:", error)
      throw new Error("Failed to fetch class")
    }
  },

  getStudentsInClass: async (classId: string) => {
    try {
      const studentsInClass = await db
        .select({
          studentId: classStudents.studentId,
          firstName: students.firstName,
          lastName: students.lastName,
          teacherId: classes.teacherId,
        })
        .from(classStudents)
        .leftJoin(students, eq(classStudents.studentId, students.id))
        .leftJoin(classes, eq(classStudents.classId, classes.id))
        .where(eq(classStudents.classId, classId))

      return studentsInClass
    } catch (error) {
      console.error("Error fetching students in class:", error)
      throw new Error("Failed to fetch students in class")
    }
  },

  createClass: async (data: ClassCreateInput) => {
    try {
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
    } catch (error) {
      console.error("Error creating class:", error)
      throw new Error("Failed to create class")
    }
  },

  updateClass: async (data: ClassUpdateInput) => {
    try {
      const { id, teacherId, ...updateData } = data

      await db
        .update(classes)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(and(eq(classes.id, id), eq(classes.teacherId, teacherId)))

      return { id }
    } catch (error) {
      console.error("Error updating class:", error)
      throw new Error("Failed to update class")
    }
  },

  deleteClass: async (id: string, teacherId: string) => {
    try {
      // First delete all class-student associations
      await db.delete(classStudents).where(eq(classStudents.classId, id))

      // Then delete the class itself
      await db.delete(classes).where(and(eq(classes.id, id), eq(classes.teacherId, teacherId)))

      return { success: true }
    } catch (error) {
      console.error("Error deleting class:", error)
      throw new Error("Failed to delete class")
    }
  },

  addStudentToClass: async (classId: string, studentId: string) => {
    try {
      await db.insert(classStudents).values({
        classId,
        studentId,
        createdAt: new Date(),
      })

      return { success: true }
    } catch (error) {
      console.error("Error adding student to class:", error)
      throw new Error("Failed to add student to class")
    }
  },

  removeStudentFromClass: async (classId: string, studentId: string) => {
    try {
      await db
        .delete(classStudents)
        .where(and(eq(classStudents.classId, classId), eq(classStudents.studentId, studentId)))

      return { success: true }
    } catch (error) {
      console.error("Error removing student from class:", error)
      throw new Error("Failed to remove student from class")
    }
  },

  getStudentCountByClass: async (teacherId: string) => {
    try {
      const result = await db.execute(sql`
        SELECT c.id, c.name, COUNT(cs.student_id) as student_count
        FROM classes c
        LEFT JOIN class_students cs ON c.id = cs.class_id
        WHERE c.teacher_id = ${teacherId}
        GROUP BY c.id, c.name
        ORDER BY c.name
      `)

      // @ts-ignore
      return result as { id: string; name: string; student_count: number }[]
    } catch (error) {
      console.error("Error getting student count by class:", error)
      throw new Error("Failed to get student count by class")
    }
  },
}
