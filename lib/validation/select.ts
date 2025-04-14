import { createSelectSchema } from 'drizzle-zod';
import { assignments, calendarEvents, classes, classStudents, featureLimits, grades, lessonPlans, materials, students, subscriptions } from '../db/schema';
import { organizations, users } from '../db/schema/auth';
import { z } from 'zod';






export const assignmentSelectSchema = createSelectSchema(assignments)
export const lessonPlanSelectSchema = createSelectSchema(lessonPlans)
export const materialSelectSchema = createSelectSchema(materials)
export const studentSelectSchema = createSelectSchema(students)
export const classSelectSchema = createSelectSchema(classes)
export const userSelectSchema = createSelectSchema(users)
export const organizationSelectSchema = createSelectSchema(organizations)
export const subscriptionSelectSchema = createSelectSchema(subscriptions)
export const featureLimitSelectSchema = createSelectSchema(featureLimits)
export const classStudentSelectSchema = createSelectSchema(classStudents)
export const gradeSelectSchema = createSelectSchema(grades)

export const calendarEventSelectSchema = createSelectSchema(calendarEvents, {
    startDate: z.date().transform(val => new Date(val)),
    endDate: z.date().transform(val => new Date(val)),
})