 
 
 
import { createInsertSchema } from 'drizzle-zod';
import { assignments, calendarEvents, classes, classStudents, featureLimits, grades, lessonPlans, materials, students, subscriptions } from '../db/schema';
import { accounts, organizations, sessions, users, verificationTokens } from '../db/schema/auth';
import { z } from 'zod';
import { PgTable } from 'drizzle-orm/pg-core';


// Function to coerce fields in a Zod schema to appropriate types
export const toCoerce = <T extends z.ZodRawShape>(schema: z.ZodObject<T>) => {
    const shape = schema._def.shape();
    const newShape: z.ZodRawShape = {};
    
    // Process each field in the schema
    for (const [key, field] of Object.entries(shape)) {
        // Check if the field is a ZodDate type and coerce it
        if (field instanceof z.ZodDate) {
            newShape[key] = z.coerce.date();
        } 
        // Check if the field is a ZodNumber type and coerce it
        else if (field instanceof z.ZodNumber) {
            newShape[key] = z.coerce.number();
      }
      // Keep other types as they are
      else {
        newShape[key] = field;
      }
    }
    
    // Return a new schema with coerced fields
    return z.object(newShape) as z.ZodObject<T>;
};

export const createCoercedInsertSchema = (schema: PgTable) => {
    const zodSchema = createInsertSchema(schema);
    // Coerce fields in the schema to appropriate types
    const coercedSchema = toCoerce(zodSchema);
    return coercedSchema;
};

export const accountInsertSchema = createCoercedInsertSchema(accounts)
export const sessionInsertSchema = createCoercedInsertSchema(sessions)
export const verificationTokenInsertSchema = createCoercedInsertSchema(verificationTokens)
export const assignmentInsertSchema = createCoercedInsertSchema(assignments)
export const lessonPlanInsertSchema = createCoercedInsertSchema(lessonPlans)
export const materialInsertSchema = createCoercedInsertSchema(materials)
export const studentInsertSchema = createCoercedInsertSchema(students)
export const classInsertSchema = createCoercedInsertSchema(classes)
export const userInsertSchema = createCoercedInsertSchema(users)
export const organizationInsertSchema = createCoercedInsertSchema(organizations)
export const subscriptionInsertSchema = createCoercedInsertSchema(subscriptions)
export const featureLimitInsertSchema = createCoercedInsertSchema(featureLimits)
export const classStudentInsertSchema = createCoercedInsertSchema(classStudents)
export const gradeInsertSchema = createCoercedInsertSchema(grades)

export const calendarEventInsertSchema = createCoercedInsertSchema(calendarEvents)