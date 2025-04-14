import type {
  StudentCreateInput,
  StudentUpdateInput,
  ClassCreateInput,
  ClassUpdateInput,
  ClassWithStudentCount,
  GradeCreateInput,
  GradeUpdateInput,
  AssignmentCreateInput,
  Class,
  ClassStudent,
  ClassStudentCreateInput,
  ClassStudentUpdateInput,
  AssignmentUpdateInput,
  MaterialCreateInput,
  MaterialUpdateInput,
  LessonPlanCreateInput,
  LessonPlanUpdateInput,
  StudentData,
  Student,
  StudentInClass
} from "./entities";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { assignments, calendarEvents, classes, lessonPlans, subscriptions } from "@/lib/db/schema";
import { users } from '../lib/db/schema/auth';

// ==========================================
// Common Types
// ==========================================

export type ServiceRoutes<T extends string> = Record<
  T,
  ((...args: any | undefined) => string) | (() => string)
>;
// ==========================================
// Student Types
// ==========================================

export interface StudentService {
  baseRoute: string;
  routes: ServiceRoutes<
    | "fetchStudents"
    | "fetchStudentById"
    | "fetchStudentsByClass"
    | "createStudent"
    | "updateStudent"
    | "deleteStudent"
  >;
  fetchStudents: (teacherId: string) => Promise<StudentData[]>;
  fetchStudentById: (id: string) => Promise<Student>;
  fetchStudentsByClass: (classId: string) => Promise<Student[]>;
  createStudent: (data: StudentCreateInput) => Promise<{ id: string }>;
  updateStudent: (data: StudentUpdateInput) => Promise<{ id: string }>;
  deleteStudent: (id: string) => Promise<{ success: boolean }>;
}

export type StudentServerService = Omit<StudentService,"routes" | "baseRoute">;

export interface StudentHooks {
  useStudents: (
    teacherId: string | undefined
  ) => UseQueryResult<StudentData[], Error>;
  useStudent: (id: string) => UseQueryResult<Student, Error>;
  useStudentsByClass: (classId: string) => UseQueryResult<Student[], Error>;
  useCreateStudent: () => UseMutationResult<
    { id: string },
    Error,
    StudentCreateInput
  >;
  useUpdateStudent: () => UseMutationResult<
    { id: string },
    Error,
    StudentUpdateInput
  >;
  useDeleteStudent: () => UseMutationResult<
    { success: boolean },
    Error,
    string
  >;
}

// ==========================================
// Class Types
// ==========================================


export type Class = typeof classes.$inferSelect

export interface ClassService {
  baseRoute: string;
  routes: ServiceRoutes<
    | "fetchClasses"
    | "fetchClassById"
    | "fetchStudentsInClass"
    | "createClass"
    | "updateClass"
    | "deleteClass"
    | "addStudentToClass"
    | "removeStudentFromClass"
  >;
  fetchClasses: (teacherId: string) => Promise<ClassWithStudentCount[]>;
  fetchClassById: (id: string) => Promise<Class>;
  fetchStudentsInClass: (classId: string) => Promise<StudentInClass[]>;
  createClass: (data: ClassCreateInput) => Promise<{ id: string }>;
  updateClass: (data: ClassUpdateInput) => Promise<{ id: string }>;
  deleteClass: (id: string) => Promise<{ success: boolean }>;
  addStudentToClass: (params: {
    classId: string;
    studentId: string;
  }) => Promise<{ success: boolean }>;
  removeStudentFromClass: (params: {
    classId: string;
    studentId: string;
  }) => Promise<{ success: boolean }>;
}

export type ClassServerService = Omit<ClassService, "routes" | "baseRoute">;

export interface ClassHooks {
  useClasses: (
    teacherId: string | undefined
  ) => UseQueryResult<ClassWithStudentCount[], Error>;
  useClass: (id: string) => UseQueryResult<Class, Error>;
  useStudentsInClass: (
    classId: string
  ) => UseQueryResult<StudentInClass[], Error>;
  useCreateClass: () => UseMutationResult<
    { id: string },
    Error,
    ClassCreateInput
  >;
  useUpdateClass: () => UseMutationResult<
    { id: string },
    Error,
    ClassUpdateInput
  >;
  useDeleteClass: () => UseMutationResult<{ success: boolean }, Error, string>;
  useAddStudentToClass: () => UseMutationResult<
    { success: boolean },
    Error,
    { classId: string; studentId: string }
  >;
  useRemoveStudentFromClass: () => UseMutationResult<
    { success: boolean },
    Error,
    { classId: string; studentId: string }
  >;
}

// ==========================================
// Grade Types
// ==========================================

export type GradeWithDetails = {
  id: string;
  score: string;
  feedback: string | null;
  studentId: string;
  assignmentId: string | null;
  studentName: string;
  assignmentTitle: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type AssignmentGrade = {
  studentName: string;
  assignmentTitle: string | null;
  id: string;
  studentId: string;
  classId: string;
  assignmentId: string | null;
  score: string;
  maxScore: string;
  comments: string | null;
  teacherId: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface GradeService {
  baseRoute: string;
  routes: ServiceRoutes<
    | "fetchGrades"
    | "fetchGradeById"
    | "fetchGradesByStudent"
    | "fetchGradesByAssignment"
    | "fetchGradesByClass"
    | "createGrade"
    | "updateGrade"
    | "deleteGrade"
    | "createBulkGrades"
    | "fetchGradeDistribution"
  >;
  fetchGrades: (teacherId: string) => Promise<GradeWithDetails[]>;
  fetchGradeById: (id: string) => Promise<GradeWithDetails>;
  fetchGradesByStudent: (studentId: string) => Promise<AssignmentGrade[]>;
  fetchGradesByAssignment: (assignmentId: string) => Promise<AssignmentGrade[]>;
  fetchGradesByClass: (classId: string) => Promise<AssignmentGrade[]>;
  fetchGradeDistribution: (params: {
    classId?: string;
    assignmentId?: string;
    studentId?: string;
  }) => Promise<{
    average: number;
    median: number;
    min: number;
    max: number;
    distribution: {
      A: number;
      B: number;
      C: number;
      D: number;
      F: number;
    };
    percentages: number[];
  }>;
  createGrade: (data: GradeCreateInput) => Promise<{ id: string }>;
  createBulkGrades: (data: GradeCreateInput[]) => Promise<any>;
  updateGrade: (data: GradeUpdateInput) => Promise<{ id: string }>;
  deleteGrade: (id: string) => Promise<{ success: boolean }>;
}

export type GradeServerService = Omit<GradeService, "routes" | "baseRoute">;

export interface GradeHooks {
  useGrades: (
    teacherId: string | undefined
  ) => UseQueryResult<GradeWithDetails[], Error>;
  useGrade: (id: string) => UseQueryResult<GradeWithDetails, Error>;
  useStudentGrades: (
    studentId: string
  ) => UseQueryResult<GradeWithDetails[], Error>;
  useAssignmentGrades: (
    assignmentId: string
  ) => UseQueryResult<GradeWithDetails[], Error>;
  useClassGrades: (
    classId: string
  ) => UseQueryResult<GradeWithDetails[], Error>;
  useCreateGrade: () => UseMutationResult<
    { id: string },
    Error,
    GradeCreateInput
  >;
  useUpdateGrade: () => UseMutationResult<
    { id: string },
    Error,
    GradeUpdateInput
  >;
  useDeleteGrade: () => UseMutationResult<{ success: boolean }, Error, string>;
}

// ==========================================
// Assignment Types
// ==========================================

export type Assignment = typeof assignments.$inferSelect;

export interface AssignmentService {
  baseRoute: string;
  routes: ServiceRoutes<
    | "fetchAssignments"
    | "fetchAssignmentById"
    | "fetchAssignmentsByClass"
    | "createAssignment"
    | "updateAssignment"
    | "deleteAssignment"
  >;
  fetchAssignments: (teacherId: string) => Promise<Assignment[]>;
  fetchAssignmentById: (id: string) => Promise<Assignment>;
  fetchAssignmentsByClass: (classId: string) => Promise<Assignment[]>;
  createAssignment: (data: AssignmentCreateInput) => Promise<{ id: string }>;
  updateAssignment: (data: AssignmentUpdateInput) => Promise<{ id: string }>;
  deleteAssignment: (id: string) => Promise<{ success: boolean }>;
}

export type AssignmentServerService = Omit<
  AssignmentService,
  "baseRoute" | "routes"
>;

export interface AssignmentHooks {
  useAssignments: (
    teacherId: string | undefined
  ) => UseQueryResult<Assignment[], Error>;
  useAssignment: (id: string) => UseQueryResult<Assignment, Error>;
  useAssignmentsByClass: (
    classId: string
  ) => UseQueryResult<Assignment[], Error>;
  useCreateAssignment: () => UseMutationResult<
    { id: string },
    Error,
    AssignmentCreateInput
  >;
  useUpdateAssignment: () => UseMutationResult<
    { id: string },
    Error,
    AssignmentUpdateInput
  >;
  useDeleteAssignment: () => UseMutationResult<
    { success: boolean },
    Error,
    string
  >;
}

// ==========================================
// Material Types
// ==========================================

export type Material = {
  id: string;
  title: string;
  description: string | null;
  type: string;
  url: string | null;
  fileKey: string | null;
  classId: string;
  teacherId: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface MaterialService {
  baseRoute: string;
  routes: ServiceRoutes<
    | "fetchMaterials"
    | "fetchMaterialById"
    | "fetchMaterialsByClass"
    | "createMaterial"
    | "updateMaterial"
    | "deleteMaterial"
  >;
  fetchMaterials: (teacherId: string) => Promise<Material[]>;
  fetchMaterialById: (id: string) => Promise<Material>;
  fetchMaterialsByClass: (classId: string) => Promise<Material[]>;
  createMaterial: (data: MaterialCreateInput) => Promise<{ id: string }>;
  updateMaterial: (data: MaterialUpdateInput) => Promise<{ id: string }>;
  deleteMaterial: (id: string) => Promise<{ success: boolean }>;
}

export interface MaterialServerService {
  getMaterials: (teacherId: string) => Promise<Material[]>;
  getMaterialById: (id: string) => Promise<Material>;
  getMaterialsByClass: (classId: string) => Promise<Material[]>;
  createMaterial: (data: MaterialCreateInput) => Promise<{ id: string }>;
  updateMaterial: (data: MaterialUpdateInput) => Promise<{ id: string }>;
  deleteMaterial: (
    id: string,
    teacherId: string
  ) => Promise<{ success: boolean }>;
}

export interface MaterialHooks {
  useMaterials: (
    teacherId: string | undefined
  ) => UseQueryResult<Material[], Error>;
  useMaterial: (id: string) => UseQueryResult<Material, Error>;
  useMaterialsByClass: (classId: string) => UseQueryResult<Material[], Error>;
  useCreateMaterial: () => UseMutationResult<
    { id: string },
    Error,
    MaterialCreateInput
  >;
  useUpdateMaterial: () => UseMutationResult<
    { id: string },
    Error,
    MaterialUpdateInput
  >;
  useDeleteMaterial: () => UseMutationResult<
    { success: boolean },
    Error,
    string
  >;
}

// ==========================================
// Lesson Plan Types
// ==========================================

export type LessonPlan = typeof lessonPlans.$inferSelect;

export interface LessonPlanService {
  baseRoute: string;
  routes: ServiceRoutes<
    | "fetchLessonPlans"
    | "fetchLessonPlanById"
    | "fetchLessonPlansByClass"
    | "createLessonPlan"
    | "updateLessonPlan"
    | "deleteLessonPlan"
  >;
  fetchLessonPlans: (teacherId: string) => Promise<LessonPlan[]>;
  fetchLessonPlanById: (id: string) => Promise<LessonPlan>;
  fetchLessonPlansByClass: (classId: string) => Promise<LessonPlan[]>;
  createLessonPlan: (data: LessonPlanCreateInput) => Promise<{ id: string }>;
  updateLessonPlan: (data: LessonPlanUpdateInput) => Promise<{ id: string }>;
  deleteLessonPlan: (id: string) => Promise<{ success: boolean }>;
}

export interface LessonPlanServerService {
  getLessonPlans: (teacherId: string) => Promise<LessonPlan[]>;
  getLessonPlanById: (id: string) => Promise<LessonPlan>;
  getLessonPlansByClass: (classId: string) => Promise<LessonPlan[]>;
  createLessonPlan: (data: LessonPlanCreateInput) => Promise<{ id: string }>;
  updateLessonPlan: (data: LessonPlanUpdateInput) => Promise<{ id: string }>;
  deleteLessonPlan: (
    id: string,
    teacherId: string
  ) => Promise<{ success: boolean }>;
}

export interface LessonPlanHooks {
  useLessonPlans: (
    teacherId: string | undefined
  ) => UseQueryResult<LessonPlan[], Error>;
  useLessonPlan: (id: string) => UseQueryResult<LessonPlan, Error>;
  useLessonPlansByClass: (
    classId: string
  ) => UseQueryResult<LessonPlan[], Error>;
  useCreateLessonPlan: () => UseMutationResult<
    { id: string },
    Error,
    LessonPlanCreateInput
  >;
  useUpdateLessonPlan: () => UseMutationResult<
    { id: string },
    Error,
    LessonPlanUpdateInput
  >;
  useDeleteLessonPlan: () => UseMutationResult<
    { success: boolean },
    Error,
    string
  >;
}

// ==========================================
// Subscription Types
// ==========================================

export type Subscription = typeof subscriptions.$inferSelect;

export interface SubscriptionService {
  getCurrentSubscription: (userId: string) => Promise<Subscription | null>;
  createSubscription: (
    userId: string,
    priceId: string
  ) => Promise<Subscription>;
  cancelSubscription: (userId: string) => Promise<Subscription>;
  updateSubscription: (
    userId: string,
    priceId: string
  ) => Promise<Subscription>;
}

// ==========================================
// Calendarl Event Types
// ==========================================

export type CalendarEvent = typeof calendarEvents.$inferSelect;

export interface CalendarEventService {
  baseRoute: string;
  routes: ServiceRoutes<
    | "fetchCalendarEvents"
    | "fetchCalendarEventById"
    | "fetchCalendarEventsByClass"
    | "createCalendarEvent"
    | "updateCalendarEvent"
    | "deleteCalendarEvent"
  >;
  fetchCalendarEvents: (teacherId: string, startDate?: Date, endDate?: Date) => Promise<CalendarEvent[]>;
  fetchCalendarEventById: (id: string) => Promise<CalendarEvent>;
  fetchCalendarEventsByClass: (classId: string) => Promise<CalendarEvent[]>;
  createCalendarEvent: (
    data: CalendarEventCreateInput
  ) => Promise<{ id: string }>;
  updateCalendarEvent: (
    data: CalendarEventUpdateInput
  ) => Promise<CalendarEvent[]>;
  deleteCalendarEvent: (id: string) => Promise<{ success: boolean }>;
}

export type CalendarEventServerService = Omit<CalendarEventService, "routes" | "baseRoute">

export interface CalendarEventHooks {
  useCalendarEvents: (
    teacherId: string | undefined
  ) => UseQueryResult<CalendarEvent[], Error>;
  useCalendarEvent: (id: string) => UseQueryResult<CalendarEvent, Error>;
  useCalendarEventsByClass: (
    classId: string
  ) => UseQueryResult<CalendarEvent[], Error>;
  useCreateCalendarEvent: () => UseMutationResult<
    { id: string },
    Error,
    CalendarEventCreateInput
  >;
  useUpdateCalendarEvent: () => UseMutationResult<
    { id: string },
    Error,
    CalendarEventUpdateInput
  >;
  useDeleteCalendarEvent: () => UseMutationResult<
    { success: boolean },
    Error,
    string
  >;
}

// Storage Service Types
interface FileUploadResult {
  url: string
  key: string
}

interface FileListItem {
  name: string
  url: string
  key: string
  size: number
  createdAt: string
}

interface StorageService {
  initializeUserStorage(userId: string): Promise<boolean>
  ensureAvatarsBucket(): Promise<boolean>
  uploadUserFile(userId: string, file: File, path?: string): Promise<FileUploadResult | null>
  uploadAvatar(userId: string, file: File): Promise<FileUploadResult | null>
  deleteUserFile(userId: string, fileKey: string): Promise<boolean>
  deleteAvatar(fileKey: string): Promise<boolean>
  listUserFiles(userId: string, path?: string): Promise<FileListItem[] | null>
  getSignedUrl(userId: string, fileKey: string, expiresIn?: number): Promise<string | null>
}

export interface StorageServerService extends StorageService {}

export interface StorageHooks {
  useStorage: () => UseQueryResult<StorageService, Error>
}




type User = Omit<typeof users.$inferSelect, "passwordHash">
type UserCreateInput = Pick<typeof users.$inferInsert, "email" | "firstName" | "lastName"  | "role"> & { password: string }
type UserUpdateInput = Partial<typeof users.$inferSelect>

export interface UserService {
  baseRoute: string;
  routes: ServiceRoutes<"fetchUsers" | "fetchUserById" | "signup" | "updateUser" | "deleteUser">;
  fetchUsers: () => Promise<User[]>;
  fetchUserById: (id: string) => Promise<User>;
  signup: (data: UserCreateInput) => Promise<{ id: string }>;
  updateUser: (data: UserUpdateInput) => Promise<{ id: string }>;
  deleteUser: (id: string) => Promise<{ success: boolean }>;
}

export interface UserServerService extends UserService {}

export interface UserHooks {
  useUsers: () => UseQueryResult<User[], Error>;
  useUser: (id: string) => UseQueryResult<User, Error>;
  useSignup: () => UseMutationResult<{ id: string }, Error, UserCreateInput>;
  useUpdateUser: () => UseMutationResult<{ id: string }, Error, UserUpdateInput>;
  useDeleteUser: () => UseMutationResult<{ success: boolean }, Error, string>;
}
