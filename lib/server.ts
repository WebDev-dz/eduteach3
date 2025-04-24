import { Server,  } from "@/types/server";
import { db } from "./db";
import { accounts, organizations, sessions, users, verificationTokens } from "./db/schema/auth";
import {
    accountInsertSchema,
  assignmentInsertSchema,
  calendarEventInsertSchema,
  classInsertSchema,
  classStudentInsertSchema,
  featureLimitInsertSchema,
  gradeInsertSchema,
  lessonPlanInsertSchema,
  materialInsertSchema,
  organizationInsertSchema,
  sessionInsertSchema,
  studentInsertSchema,
  subscriptionInsertSchema,
  userInsertSchema,
  verificationTokenInsertSchema,
} from "./validation/insert";
import { ZodSchema } from "zod";
import {
  assignments,
  assignmentSubmissions,
  calendarEvents,
  classes,
  classStudents,
  featureLimits,
  grades,
  lessonPlans,
  materials,
  students,
  subscriptions,
} from "./db/schema";
import { PgTable, TableConfig } from "drizzle-orm/pg-core";

const checkInsert = (values: any, schema: ZodSchema) => {
  const singleResult = schema.safeParse(values);

  if (singleResult.success) {
    return singleResult.data;
  }

  const arraySchema = schema.array();
  const arrayResult = arraySchema.safeParse(values);

  if (arrayResult.success) {
    return arrayResult.data;
  }

  // Return the first error message (either from single or array validation)
  const firstError =
    (singleResult.success === false && singleResult.error.errors[0]?.message) ||
    (arrayResult.success === false && arrayResult.error.errors[0]?.message) ||
    "Validation failed";

  throw new Error(firstError);
};

const createHandler =  <T extends PgTable<TableConfig>>(table: T, schema: ZodSchema) => (values: any) =>
    db.insert(table).values(checkInsert(values, schema)).returning();
  
  const updateHandler = <T extends PgTable<TableConfig>> (table: T, schema: ZodSchema) => (values: any) =>
    db.update(table).set(checkInsert(values, schema)).returning();
  
  const deleteHandler =  <T extends PgTable<TableConfig>>(table: T) => (config: any) =>
    db.delete(table).where(config).returning();
  
  export const serverService: Server = {
    verificationTokens: {
      findMany: (config) => db.query.verificationTokens.findMany(config),
      findFirst: (config) => db.query.verificationTokens.findFirst(config),
      findUnique: undefined,
      create: createHandler(verificationTokens, verificationTokenInsertSchema),
      update: updateHandler(verificationTokens, verificationTokenInsertSchema),
      delete: deleteHandler(verificationTokens),
    },
    organizations: {
      findMany: (config) => db.query.organizations.findMany(config),
      findFirst: (config) => db.query.organizations.findFirst(config),
      findUnique: undefined,
      create: createHandler(organizations, organizationInsertSchema),
      update: updateHandler(organizations, organizationInsertSchema),
      delete: deleteHandler(organizations),
    },
    users: {
      findMany: (config) => db.query.users.findMany(config),
      findFirst: (config) => db.query.users.findFirst(config),
      findUnique: undefined,
      create: createHandler(users, userInsertSchema),
      update: updateHandler(users, userInsertSchema),
      delete: deleteHandler(users),
    },
    accounts: {
      findMany: (config) => db.query.accounts.findMany(config),
      findFirst: (config) => db.query.accounts.findFirst(config),
      findUnique: undefined,
      create: createHandler(accounts, accountInsertSchema),
      update: updateHandler(accounts, accountInsertSchema),
      delete: deleteHandler(accounts),
    },
    sessions: {
      findMany: (config) => db.query.sessions.findMany(config),
      findFirst: (config) => db.query.sessions.findFirst(config),
      findUnique: undefined,
      create: createHandler(sessions, sessionInsertSchema),
      update: updateHandler(sessions, sessionInsertSchema),
      delete: deleteHandler(sessions),
    },
    subscriptions: {
      findMany: (config) => db.query.subscriptions.findMany(config),
      findFirst: (config) => db.query.subscriptions.findFirst(config),
      findUnique: undefined,
      create: createHandler(subscriptions, subscriptionInsertSchema),
      update: updateHandler(subscriptions, subscriptionInsertSchema),
      delete: deleteHandler(subscriptions),
    },
    featureLimits: {
      findMany: (config) => db.query.featureLimits.findMany(config),
      findFirst: (config) => db.query.featureLimits.findFirst(config),
      findUnique: undefined,
      create: createHandler(featureLimits, featureLimitInsertSchema),
      update: updateHandler(featureLimits, featureLimitInsertSchema),
      delete: deleteHandler(featureLimits),
    },
    classes: {
      findMany: (config) => db.query.classes.findMany(config),
      findFirst: (config) => db.query.classes.findFirst(config),
      findUnique: undefined,
      create: createHandler(classes, classInsertSchema),
      update: updateHandler(classes, classInsertSchema),
      delete: deleteHandler(classes),
    },
    students: {
      findMany: (config) => db.query.students.findMany(config),
      findFirst: (config) => db.query.students.findFirst(config),
      findUnique: undefined,
      create: createHandler(students, studentInsertSchema),
      update: updateHandler(students, studentInsertSchema),
      delete: deleteHandler(students),
    },
    classStudents: {
      findMany: (config) => db.query.classStudents.findMany(config),
      findFirst: (config) => db.query.classStudents.findFirst(config),
      findUnique: undefined,
      create: createHandler(classStudents, classStudentInsertSchema),
      update: updateHandler(classStudents, classStudentInsertSchema),
      delete: deleteHandler(classStudents),
    },
    assignments: {
      findMany: (config) => db.query.assignments.findMany(config),
      findFirst: (config) => db.query.assignments.findFirst(config),
      findUnique: undefined,
      create: createHandler(assignments, assignmentInsertSchema),
      update: updateHandler(assignments, assignmentInsertSchema),
      delete: deleteHandler(assignments),
    },
    assignmentSubmissions: {
      findMany: (config) => db.query.assignmentSubmissions.findMany(config),
      findFirst: (config) => db.query.assignmentSubmissions.findFirst(config),
      findUnique: undefined,
      create: createHandler(assignmentSubmissions, assignmentInsertSchema),
      update: updateHandler(assignmentSubmissions, assignmentInsertSchema),
      delete: deleteHandler(assignmentSubmissions),
    },
    grades: {
      findMany: (config) => db.query.grades.findMany(config),
      findFirst: (config) => db.query.grades.findFirst(config),
      findUnique: undefined,
      create: createHandler(grades, gradeInsertSchema),
      update: updateHandler(grades, gradeInsertSchema),
      delete: deleteHandler(grades),
    },
    materials: {
      findMany: (config) => db.query.materials.findMany(config),
      findFirst: (config) => db.query.materials.findFirst(config),
      findUnique: undefined,
      create: createHandler(materials, materialInsertSchema),
      update: updateHandler(materials, materialInsertSchema),
      delete: deleteHandler(materials),
    },
    lessonPlans: {
      findMany: (config) => db.query.lessonPlans.findMany(config),
      findFirst: (config) => db.query.lessonPlans.findFirst(config),
      findUnique: undefined,
      create: createHandler(lessonPlans, lessonPlanInsertSchema),
      update: updateHandler(lessonPlans, lessonPlanInsertSchema),
      delete: deleteHandler(lessonPlans),
    },
    calendarEvents: {
      findMany: (config) => db.query.calendarEvents.findMany(config),
      findFirst: (config) => db.query.calendarEvents.findFirst(config),
      findUnique: undefined,
      create: createHandler(calendarEvents, calendarEventInsertSchema),
      update: updateHandler(calendarEvents, calendarEventInsertSchema),
      delete: deleteHandler(calendarEvents),
    },
  };
  


