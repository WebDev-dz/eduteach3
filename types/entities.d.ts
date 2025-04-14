import {
  students,
  classStudents,
  grades,
  materials,
  assignments,
  lessonPlans,
  classes,
  calendarEvents,
} from "@/lib/db/schema";

// Student Types

export type Student = typeof students.$inferSelect;
export type StudentData = typeof students.$inferSelect & {
  grades: { score: string; maxScore: string }[];
  classStudents: (typeof classStudents.$inferSelect)[];
  performance: number;
  classCount: number;
  status: string;
};
export type StudentCreateInput = typeof students.$inferInsert;
export type StudentUpdateInput = typeof students.$inferSelect;
export type StudentInClass = {
    studentId: string
    firstName: string
    lastName: string
    teacherId: string
  }
  

// Class Student Types

export type ClassStudent = typeof classStudents.$inferSelect;
export type ClassStudentCreateInput = typeof classStudents.$inferInsert;
export type ClassStudentUpdateInput = typeof classStudents.$inferSelect;
export type ClassWithStudentCount = typeof classes.$inferSelect & {
  studentCount: number;
  assignmentCount: number
}
;
// Grade Types

export type Grade = typeof grades.$inferSelect;
export type GradeCreateInput = typeof grades.$inferInsert;
export type GradeUpdateInput = typeof grades.$inferSelect;

// Material Types

export type Material = typeof materials.$inferSelect;
export type MaterialCreateInput = typeof materials.$inferInsert;
export type MaterialUpdateInput = typeof materials.$inferSelect;

// Lesson Plan Types

export type LessonPlan = typeof lessonPlans.$inferSelect;
export type LessonPlanCreateInput = typeof lessonPlans.$inferInsert;
export type LessonPlanUpdateInput = typeof lessonPlans.$inferSelect;

// Class Types

export type Class = typeof classes.$inferSelect;
export type ClassCreateInput = typeof classes.$inferInsert;
export type ClassUpdateInput = typeof classes.$inferSelect;

// Calendar Event Types

export type CalendarEvent = typeof calendarEvents.$inferSelect;
export type CalendarEventCreateInput = typeof calendarEvents.$inferInsert;
export type CalendarEventUpdateInput = typeof calendarEvents.$inferSelect;

// Assignment Types

export type Assignment = typeof assignments.$inferSelect;
export type AssignmentCreateInput = typeof assignments.$inferInsert;
export type AssignmentUpdateInput = typeof assignments.$inferSelect;
