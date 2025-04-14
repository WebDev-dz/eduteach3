// 
import * as schema from "@/lib/db/schema"
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';




export const InsertSchema = {
    users: createInsertSchema(schema.users),
    classes: createInsertSchema(schema.classes),
    classStudents: createInsertSchema(schema.classStudents),
    grades: createInsertSchema(schema.grades),
    assignments: createInsertSchema(schema.assignments),
    calendarEvents: createInsertSchema(schema.calendarEvents),
    subscriptions: createInsertSchema(schema.subscriptions),
    students: createInsertSchema(schema.students),
    materials: createInsertSchema(schema.materials),
    lessonPlans: createInsertSchema(schema.lessonPlans),
    organizations: createInsertSchema(schema.organizations),
    assignmentSubmissions: createInsertSchema(schema.assignmentSubmissions),
}

export const SelectSchema = {
    users: createSelectSchema(schema.users),
    classes: createSelectSchema(schema.classes),
    classStudents: createSelectSchema(schema.classStudents),
    grades: createSelectSchema(schema.grades),
    assignments: createSelectSchema(schema.assignments),
    calendarEvents: createSelectSchema(schema.calendarEvents),
    subscriptions: createSelectSchema(schema.subscriptions),
    students: createSelectSchema(schema.students),
    materials: createSelectSchema(schema.materials),
    lessonPlans: createSelectSchema(schema.lessonPlans),
    organizations: createSelectSchema(schema.organizations),
    assignmentSubmissions: createSelectSchema(schema.assignmentSubmissions),
}








