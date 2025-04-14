import { relations } from "drizzle-orm";
import { users, organizations } from "./auth";
import {
  boolean,
  date,
  decimal,
  index,
  integer,
  json,
  jsonb,
  pgEnum,
  pgSchema,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";


// Enums
export const userRoleEnum = pgEnum("user_role", [
  "teacher",
  "admin",
  "department_head",
  "school_admin",
]);
export const subscriptionPlanEnum = pgEnum("subscription_plan", [
  "starter",
  "professional",
  "school",
]);
export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "canceled",
  "incomplete",
  "incomplete_expired",
  "past_due",
  "trialing",
  "unpaid",
]);
export const eventTypeEnum = pgEnum("event_type", [
  "class",
  "assignment",
  "exam",
  "meeting",
  "personal",
]);
export const assignmentStatusEnum = pgEnum("assignment_status", [
  "draft",
  "published",
  "graded",
  "archived",
]);
export const lessonPlanStatusEnum = pgEnum("lesson_plan_status", [
  "draft",
  "complete",
  "archived",
]);
export const eventVisibilityEnum = pgEnum("event_visibility", [
  "public",
  "private",
  "organization",
]);




// Subscriptions
export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    organizationId: uuid("organization_id").references(() => organizations.id, {
      onDelete: "cascade",
    }),
    plan: subscriptionPlanEnum("plan").notNull(),
    status: subscriptionStatusEnum("status").notNull(),
    currentPeriodStart: timestamp("current_period_start").notNull(),
    currentPeriodEnd: timestamp("current_period_end").notNull(),
    cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
    stripeCustomerId: text("stripe_customer_id"),
    stripeSubscriptionId: text("stripe_subscription_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => {
    return [
      index("user_idx").on(table.userId),
      index("subscription_organization_idx").on(
        table.organizationId
      ),
    ];
  }
);

// Feature Limits (based on subscription plan)
export const featureLimits = pgTable("feature_limits", {
  id: uuid("id").defaultRandom().primaryKey(),
  plan: subscriptionPlanEnum("plan").notNull(),
  maxClasses: integer("max_classes").notNull(),
  maxStudentsPerClass: integer("max_students_per_class").notNull(),
  maxStorageGB: decimal("max_storage_gb").notNull(),
  advancedGrading: boolean("advanced_grading").notNull(),
  lessonPlanning: boolean("lesson_planning").notNull(),
  studentAnalytics: boolean("student_analytics").notNull(),
  parentCommunication: boolean("parent_communication").notNull(),
  adminDashboard: boolean("admin_dashboard").notNull(),
  departmentAnalytics: boolean("department_analytics").notNull(),
  customIntegrations: boolean("custom_integrations").notNull(),
  prioritySupport: boolean("priority_support").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Classes
export const classes = pgTable(
  "classes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    subject: text("subject").notNull(),
    gradeLevel: text("grade_level").notNull(),
    academicYear: text("academic_year").notNull(),
    schedule: text("schedule"),
    room: text("room"),
    capacity: integer("capacity"),
    description: text("description"),
    isActive: boolean("is_active").default(true),
    teacherId: uuid("teacher_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    organizationId: uuid("organization_id").references(() => organizations.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      teacherIdx: index("teacher_idx").on(table.teacherId),
      organizationIdx: index("class_organization_idx").on(table.organizationId),
    };
  }
);

// Students
export const students = pgTable(
  "students",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    studentId: text("student_id").notNull(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    email: text("email"),
    dateOfBirth: date("date_of_birth"),
    gender: text("gender"),
    enrollmentDate: date("enrollment_date"),
    previousSchool: text("previous_school"),
    specialNeeds: boolean("special_needs").default(false),
    notes: text("notes"),
    address: text("address"),
    emergencyContact: text("emergency_contact"),
    emergencyPhone: text("emergency_phone"),
    relationship: text("relationship"),
    teacherId: uuid("teacher_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    organizationId: uuid("organization_id").references(() => organizations.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => {
    return [
      index("student_id_idx").on(table.studentId),
      index("student_teacher_idx").on(table.teacherId),
      index("student_organization_idx").on(table.organizationId),
    ];
  }
);

// Class-Student relationship (many-to-many)
export const classStudents = pgTable(
  "class_students",
  {
    classId: uuid("class_id")
      .notNull()
      .references(() => classes.id, { onDelete: "cascade" }),
    studentId: uuid("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),
    enrollmentDate: date("enrollment_date").defaultNow().notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.classId, table.studentId] }),
      classIdx: index("class_student_class_idx").on(table.classId),
      studentIdx: index("class_student_student_idx").on(table.studentId),
    };
  }
);

// Assignments
export const assignments = pgTable(
  "assignments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    type: text("type").notNull(), // homework, quiz, test, project
    classId: uuid("class_id")
      .notNull()
      .references(() => classes.id, { onDelete: "cascade" }),
    dueDate: timestamp("due_date").notNull(),
    totalPoints: integer("total_points").notNull(),
    estimatedTime: integer("estimated_time"),
    instructions: text("instructions").notNull(),
    allowLateSubmissions: boolean("allow_late_submissions").default(false),
    timeLimit: integer("time_limit"),
    status: assignmentStatusEnum("status").default("draft").notNull(),
    resources: json("resources"),
    teacherId: uuid("teacher_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => {
    return [
      index("assignment_class_idx").on(table.classId),
      index("assignment_teacher_idx").on(table.teacherId),
    ];
  }
);

// Assignment Submissions
export const assignmentSubmissions = pgTable(
  "assignment_submissions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    assignmentId: uuid("assignment_id")
      .notNull()
      .references(() => assignments.id, { onDelete: "cascade" }),
    studentId: uuid("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),
    submissionDate: timestamp("submission_date").defaultNow().notNull(),
    content: text("content"),
    score: decimal("score"),
    feedback: text("feedback"),
    comments: json("comments"), // Array of comment objects with author, text, timestamp
    attachments: json("attachments"),
    isLate: boolean("is_late").default(false),
    gradedBy: uuid("graded_by").references(() => users.id),
    gradedAt: timestamp("graded_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      assignmentIdx: index("submission_assignment_idx").on(table.assignmentId),
      studentIdx: index("submission_student_idx").on(table.studentId),
    };
  }
);

// Grades
export const grades = pgTable(
  "grades",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    studentId: uuid("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),
    classId: uuid("class_id")
      .notNull()
      .references(() => classes.id, { onDelete: "cascade" }),
    assignmentId: uuid("assignment_id").references(() => assignments.id, {
      onDelete: "set null",
    }),
    score: decimal("score").notNull(),
    maxScore: decimal("max_score").notNull(),
    comments: text("comments"),
    teacherId: uuid("teacher_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ([
    index("grade_student_idx").on(table.studentId),
    index("grade_class_idx").on(table.classId),
    index("grade_assignment_idx").on(table.assignmentId),
    index("grade_teacher_idx").on(table.teacherId),
  ]))

// Teaching Materials
export const materials = pgTable(
  "materials",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    type: text("type").notNull(), // lesson-plan, worksheet, presentation, document, image, video, audio
    subject: text("subject").notNull(),
    gradeLevel: text("grade_level").notNull(),
    classId: uuid("class_id").references(() => classes.id, {
      onDelete: "set null",
    }),
    description: text("description"),
    fileUrl: text("file_url").notNull(),
    fileSize: integer("file_size").notNull(),
    fileType: text("file_type").notNull(),
    shareWithStudents: boolean("share_with_students").default(false),
    shareWithTeachers: boolean("share_with_teachers").default(false),
    tags: json("tags"),
    teacherId: uuid("teacher_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    organizationId: uuid("organization_id").references(() => organizations.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => {
    return [
      index("material_teacher_idx").on(table.teacherId),
      index("material_class_idx").on(table.classId),
      index("material_organization_idx").on(table.organizationId),
    ];
  }
);

// Lesson Plans
export const lessonPlans = pgTable(
  "lesson_plans",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    subject: text("subject").notNull(),
    gradeLevel: text("grade_level").notNull(),
    duration: text("duration").notNull(),
    date: date("date").defaultNow().notNull(),
    classId: uuid("class").references(() => classes.id),
    status: lessonPlanStatusEnum("status").default("draft"),
    objectives: json("objectives").$type<string[]>().notNull(),
    materials: json("materials").$type<string[]>().notNull(),
    introduction: text("introduction").notNull(),
    mainActivity: text("main_activity").notNull(),
    conclusion: text("conclusion").notNull(),
    assessment: text("assessment").notNull(),
    notes: text("notes"),
    teacherId: uuid("teacher_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    organizationId: uuid("organization_id").references(() => organizations.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    procedure: jsonb("procedure").$type<{
      introduction?: string,
      mainActivity?: string,
      conclusion?: string,
    }>().notNull().default({})
  },
  (table) => {
    return [
      index("lesson_plan_teacher_idx").on(table.teacherId),
      index("lesson_plan_class_idx").on(table.classId),

      index("lesson_plan_organization_idx").on(table.organizationId),
    ];
  }
);


// Calendar Events
export const calendarEvents = pgTable("calendar_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  allDay: boolean("all_day").default(false).notNull(),
  location: text("location"),
  type: eventTypeEnum("type").notNull().default("class"),
  classId: uuid("class_id").references(() => classes.id, { onDelete: "set null" }),
  assignmentId: uuid("assignment_id").references(() => assignments.id, { onDelete: "set null" }),
  lessonPlanId: uuid("lesson_plan_id").references(() => lessonPlans.id, { onDelete: "set null" }),
  color: text("color"),
  teacherId: uuid("teacher_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  recurrenceRule: text("recurrence_rule"), // For recurring events
  isRecurring: boolean("is_recurring").default(false),
  visibility: eventVisibilityEnum("event_visibility").default("private").notNull(),
  reminders: json("reminders").default([]).$type<Reminder[]>(), // Array of reminder settings
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export interface Reminder {
  time: number;
  unit: "minutes" | "hours" | "days";
  method: "email" | "notification";
}

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [users.organizationId],
    references: [organizations.id],
  }),
  subscription: one(subscriptions, {
    fields: [users.id],
    references: [subscriptions.userId],
  }),
  classes: many(classes),
  students: many(students),
  materials: many(materials),
  lessonPlans: many(lessonPlans),
  calendarEvents: many(calendarEvents),
}));

export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(users),
  subscriptions: many(subscriptions),
  classes: many(classes),
  students: many(students),
  materials: many(materials),
  lessonPlans: many(lessonPlans),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
  organization: one(organizations, {
    fields: [subscriptions.organizationId],
    references: [organizations.id],
  }),
}));

export const classesRelations = relations(classes, ({ one, many }) => ({
  teacher: one(users, {
    fields: [classes.teacherId],
    references: [users.id],
  }),
  organization: one(organizations, {
    fields: [classes.organizationId],
    references: [organizations.id],
  }),
  classStudents: many(classStudents),
  assignments: many(assignments),
  materials: many(materials),
  calendarEvents: many(calendarEvents),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  teacher: one(users, {
    fields: [students.teacherId],
    references: [users.id],
  }),
  organization: one(organizations, {
    fields: [students.organizationId],
    references: [organizations.id],
  }),
  classStudents: many(classStudents),
  assignmentSubmissions: many(assignmentSubmissions),
  grades: many(grades),
}));

export const classStudentsRelations = relations(classStudents, ({ one }) => ({
  class: one(classes, {
    fields: [classStudents.classId],
    references: [classes.id],
  }),
  student: one(students, {
    fields: [classStudents.studentId],
    references: [students.id],
  }),
}));

export const assignmentsRelations = relations(assignments, ({ one, many }) => ({
  class: one(classes, {
    fields: [assignments.classId],
    references: [classes.id],
  }),
  teacher: one(users, {
    fields: [assignments.teacherId],
    references: [users.id],
  }),
  submissions: many(assignmentSubmissions),
  grades: many(grades),
  calendarEvents: many(calendarEvents),
}));

export const assignmentSubmissionsRelations = relations(
  assignmentSubmissions,
  ({ one }) => ({
    assignment: one(assignments, {
      fields: [assignmentSubmissions.assignmentId],
      references: [assignments.id],
    }),
    student: one(students, {
      fields: [assignmentSubmissions.studentId],
      references: [students.id],
    }),
    gradedByUser: one(users, {
      fields: [assignmentSubmissions.gradedBy],
      references: [users.id],
    }),
  })
);

export const gradesRelations = relations(grades, ({ one }) => ({
  student: one(students, {
    fields: [grades.studentId],
    references: [students.id],
  }),
  class: one(classes, {
    fields: [grades.classId],
    references: [classes.id],
  }),
  assignment: one(assignments, {
    fields: [grades.assignmentId],
    references: [assignments.id],
  }),
  teacher: one(users, {
    fields: [grades.teacherId],
    references: [users.id],
  }),
}));

export const materialsRelations = relations(materials, ({ one }) => ({
  teacher: one(users, {
    fields: [materials.teacherId],
    references: [users.id],
  }),
  class: one(classes, {
    fields: [materials.classId],
    references: [classes.id],
  }),
  organization: one(organizations, {
    fields: [materials.organizationId],
    references: [organizations.id],
  }),
}));

export const lessonPlansRelations = relations(lessonPlans, ({ one }) => ({
  teacher: one(users, {
    fields: [lessonPlans.teacherId],
    references: [users.id],
  }),
  organization: one(organizations, {
    fields: [lessonPlans.organizationId],
    references: [organizations.id],
  }),
  class: one(classes, {
    fields: [lessonPlans.classId],
    references: [classes.id]
  })
}));

export const calendarEventsRelations = relations(calendarEvents, ({ one }) => ({
  teacher: one(users, {
    fields: [calendarEvents.teacherId],
    references: [users.id],
  }),
  class: one(classes, {
    fields: [calendarEvents.classId],
    references: [classes.id],
  }),
  assignment: one(assignments, {
    fields: [calendarEvents.assignmentId],
    references: [assignments.id],
  }),
}));
