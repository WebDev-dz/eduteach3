import { createInsertSchema } from 'drizzle-zod';
import { assignments, calendarEvents, classes, classStudents, featureLimits, grades, lessonPlans, materials, students, subscriptions } from '../db/schema';
import { organizations, users } from '../db/schema/auth';
import { z } from 'zod';






export const assignmentInsertSchema = createInsertSchema(assignments)
export const lessonPlanInsertSchema = createInsertSchema(lessonPlans)
export const materialInsertSchema = createInsertSchema(materials)
export const studentInsertSchema = createInsertSchema(students)
export const classInsertSchema = createInsertSchema(classes)
export const userInsertSchema = createInsertSchema(users)
export const organizationInsertSchema = createInsertSchema(organizations)
export const subscriptionInsertSchema = createInsertSchema(subscriptions)
export const featureLimitInsertSchema = createInsertSchema(featureLimits)
export const classStudentInsertSchema = createInsertSchema(classStudents)
export const gradeInsertSchema = createInsertSchema(grades)

export const calendarEventInsertSchema = createInsertSchema(calendarEvents, {
    startDate: z.date().transform(val => new Date(val)),
    endDate: z.date().transform(val => new Date(val)),
})