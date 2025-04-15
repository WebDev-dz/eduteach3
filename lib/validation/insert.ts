import { createInsertSchema } from 'drizzle-zod';
import { assignments, calendarEvents, classes, classStudents, featureLimits, grades, lessonPlans, materials, students, subscriptions } from '../db/schema';
import { organizations, users } from '../db/schema/auth';
import { z } from 'zod';






export const assignmentInsertSchema = createInsertSchema(assignments, {
    updatedAt: z.date().transform(val => new Date(val)),
    createdAt: z.date().transform(val => new Date(val)),
})
export const lessonPlanInsertSchema = createInsertSchema(lessonPlans, {
    updatedAt: z.date().transform(val => new Date(val)),
    createdAt: z.date().transform(val => new Date(val)),
})
export const materialInsertSchema = createInsertSchema(materials, {
    updatedAt: z.date().transform(val => new Date(val)),
    createdAt: z.date().transform(val => new Date(val)),
})
export const studentInsertSchema = createInsertSchema(students, {
    updatedAt: z.date().transform(val => new Date(val)),
    createdAt: z.date().transform(val => new Date(val)),
})
export const classInsertSchema = createInsertSchema(classes, {
    capacity: z.coerce.number(),
})
export const userInsertSchema = createInsertSchema(users, {
    updatedAt: z.date().transform(val => new Date(val)),
    createdAt: z.date().transform(val => new Date(val)),
})
export const organizationInsertSchema = createInsertSchema(organizations, {
    updatedAt: z.date().transform(val => new Date(val)),
    createdAt: z.date().transform(val => new Date(val)),
})
export const subscriptionInsertSchema = createInsertSchema(subscriptions, {
    updatedAt: z.date().transform(val => new Date(val)),
    createdAt: z.date().transform(val => new Date(val)),
})
export const featureLimitInsertSchema = createInsertSchema(featureLimits, {
    updatedAt: z.date().transform(val => new Date(val)),
    createdAt: z.date().transform(val => new Date(val)),
})
export const classStudentInsertSchema = createInsertSchema(classStudents, {
})
export const gradeInsertSchema = createInsertSchema(grades, {
    updatedAt: z.date().transform(val => new Date(val)),
    createdAt: z.date().transform(val => new Date(val)),
})

export const calendarEventInsertSchema = createInsertSchema(calendarEvents, {
    startDate: z.date().transform(val => new Date(val)),
    endDate: z.date().transform(val => new Date(val)),
})