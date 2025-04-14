import { z } from "zod";
import { assignmentStatusEnum, eventTypeEnum, lessonPlanStatusEnum, subscriptionPlanEnum, subscriptionStatusEnum, userRoleEnum } from "@/lib/db/schema"; // Adjust import path as needed

// Users Search Params Schema
export const userSearchParamsSchema = z.object({
  id: z.string().uuid().optional(),
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.enum(["teacher", "admin", "department_head", "school_admin"] as const).optional(),
  organizationId: z.string().uuid().optional(),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional().default("asc"),
});

// Organizations Search Params Schema
export const organizationSearchParamsSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().optional(),
  domain: z.string().optional(),
  ownerId: z.string().uuid().optional(),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional().default("asc"),
});

// Subscriptions Search Params Schema
export const subscriptionSearchParamsSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  organizationId: z.string().uuid().optional(),
  plan: z.enum(["starter", "professional", "school"] as const).optional(),
  status: z.enum([
    "active", 
    "canceled", 
    "incomplete", 
    "incomplete_expired", 
    "past_due", 
    "trialing", 
    "unpaid"
  ] as const).optional(),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional().default("asc"),
});

// Feature Limits Search Params Schema
export const featureLimitSearchParamsSchema = z.object({
  id: z.string().uuid().optional(),
  plan: z.enum(["starter", "professional", "school"] as const).optional(),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
});

// Classes Search Params Schema
export const classSearchParamsSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().optional(),
  subject: z.string().optional(),
  gradeLevel: z.string().optional(),
  academicYear: z.string().optional(),
  isActive: z.enum(["true", "false"]).optional().transform(val => val === "true"),
  teacherId: z.string().uuid().optional(),
  organizationId: z.string().uuid().optional(),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional().default("asc"),
});

// Students Search Params Schema
export const studentSearchParamsSchema = z.object({
  id: z.string().uuid().optional(),
  studentId: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  classId: z.string().uuid().optional(),
  teacherId: z.string().uuid().optional(),
  organizationId: z.string().uuid().optional(),
  specialNeeds: z.enum(["true", "false"]).optional().transform(val => val === "true"),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional().default("asc"),
});

// Class Students Search Params Schema
export const classStudentSearchParamsSchema = z.object({
  classId: z.string().uuid().optional(),
  studentId: z.string().uuid().optional(),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
});

// Assignments Search Params Schema
export const assignmentSearchParamsSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional(),
  type: z.string().optional(),
  classId: z.string().uuid().optional(),
  dueDate: z.string().optional(),
  status: z.enum(["draft", "published", "graded", "archived"] as const).optional(),
  teacherId: z.string().uuid().optional(),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional().default("asc"),
});

// Assignment Submissions Search Params Schema
export const assignmentSubmissionSearchParamsSchema = z.object({
  id: z.string().uuid().optional(),
  assignmentId: z.string().uuid().optional(),
  studentId: z.string().uuid().optional(),
  isLate: z.enum(["true", "false"]).optional().transform(val => val === "true"),
  gradedBy: z.string().uuid().optional(),
  submissionDateStart: z.string().optional(),
  submissionDateEnd: z.string().optional(),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional().default("asc"),
});

// Grades Search Params Schema
export const gradeSearchParamsSchema = z.object({
  id: z.string().uuid().optional(),
  studentId: z.string().uuid().optional(),
  classId: z.string().uuid().optional(),
  assignmentId: z.string().uuid().optional(),
  teacherId: z.string().uuid().optional(),
  minScore: z.coerce.number().optional(),
  maxScore: z.coerce.number().optional(),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional().default("asc"),
  distribution: z.enum(["true", "false"]).optional().transform(val => val === "true"),
});

// Materials Search Params Schema
export const materialSearchParamsSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().optional(),
  type: z.string().optional(),
  subject: z.string().optional(),
  gradeLevel: z.string().optional(),
  classId: z.string().uuid().optional(),
  shareWithStudents: z.enum(["true", "false"]).optional().transform(val => val === "true"),
  shareWithTeachers: z.enum(["true", "false"]).optional().transform(val => val === "true"),
  teacherId: z.string().uuid().optional(),
  organizationId: z.string().uuid().optional(),
  tags: z.string().optional(),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional().default("asc"),
});

// Lesson Plans Search Params Schema
export const lessonPlanSearchParamsSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional(),
  subject: z.string().optional(),
  gradeLevel: z.string().optional(),
  classId: z.string().uuid().optional(),
  status: z.enum(["draft", "complete", "archived"] as const).optional(),
  dateStart: z.string().optional(),
  dateEnd: z.string().optional(),
  teacherId: z.string().uuid().optional(),
  organizationId: z.string().uuid().optional(),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional().default("asc"),
});

// Calendar Events Search Params Schema
export const calendarEventSearchParamsSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional(),
  type: z.enum(["class", "assignment", "exam", "meeting", "personal"] as const).optional(),
  dateStart: z.string().optional(),
  dateEnd: z.string().optional(),
  classId: z.string().uuid().optional(),
  assignmentId: z.string().uuid().optional(),
  teacherId: z.string().uuid().optional(),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional().default("asc"),
});