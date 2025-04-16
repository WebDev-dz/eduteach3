import { createInsertSchema } from 'drizzle-zod';
import { assignments, calendarEvents, classes, classStudents, featureLimits, grades, lessonPlans, materials, students, subscriptions } from '../db/schema';
import { organizations, users } from '../db/schema/auth';
import { z } from 'zod';






export const assignmentInsertSchema = createInsertSchema(assignments, {
    totalPoints: z.coerce.number(),
    estimatedTime: z.coerce.number(),
    dueDate: z.coerce.date(),
    allowLateSubmissions: z.coerce.boolean(),
    timeLimit: z.coerce.number(),
    updatedAt: z.coerce.date(),
    createdAt: z.coerce.date(),
})
export const lessonPlanInsertSchema = createInsertSchema(lessonPlans, {
    date: z.coerce.date(),
    duration: z.coerce.number(),

    updatedAt: z.coerce.date(),
    createdAt: z.coerce.date(),
})
export const materialInsertSchema = createInsertSchema(materials, {
    updatedAt: z.coerce.date(),
    createdAt: z.coerce.date(),
})
export const studentInsertSchema = createInsertSchema(students, {
    dateOfBirth: z.coerce.date(),
    updatedAt: z.coerce.date(),
    createdAt: z.coerce.date(),
})
export const classInsertSchema = createInsertSchema(classes, {
    capacity: z.coerce.number(),
})
export const userInsertSchema = createInsertSchema(users, {
    updatedAt: z.coerce.date(),
    createdAt: z.coerce.date(),
})
export const organizationInsertSchema = createInsertSchema(organizations, {
    updatedAt: z.coerce.date(),
    createdAt: z.coerce.date(),
})
export const subscriptionInsertSchema = createInsertSchema(subscriptions, {
    updatedAt: z.coerce.date(),
    createdAt: z.coerce.date(),
})
export const featureLimitInsertSchema = createInsertSchema(featureLimits, {
    updatedAt: z.coerce.date(),
    createdAt: z.coerce.date(),
})
export const classStudentInsertSchema = createInsertSchema(classStudents, {
})
export const gradeInsertSchema = createInsertSchema(grades, {
    updatedAt: z.coerce.date(),
    createdAt: z.coerce.date(),
})

export const calendarEventInsertSchema = createInsertSchema(calendarEvents, {
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
})