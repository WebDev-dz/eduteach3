import type { StudentCreateInput, StudentUpdateInput } from "@/lib/db/dal/students"
import type { ClassCreateInput, ClassUpdateInput, ClassWithStudentCount } from "@/lib/db/dal/classes"
import type { GradeCreateInput, GradeUpdateInput } from "@/lib/db/dal/grades"
import type { AssignmentCreateInput, AssignmentUpdateInput } from "@/lib/db/dal/assignments"
import type { MaterialCreateInput, MaterialUpdateInput } from "@/lib/db/dal/materials"
import type { LessonPlanCreateInput, LessonPlanUpdateInput } from "@/lib/db/dal/lesson-plans"
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query"

// ==========================================
// Common Types
// ==========================================

export type ServiceRoutes<T extends string> = Record<T, string>

// ==========================================
// Student Types
// ==========================================

export type Student = {
  id: string
  firstName: string
  lastName: string
  email: string
  dateOfBirth: Date | null
  grade: number | null
  parentName: string | null
  parentEmail: string | null
  parentPhone: string | null
  address: string | null
  notes: string | null
  teacherId: string
  createdAt: Date
  updatedAt: Date
}

export interface StudentService {
  baseRoute: string
  routes: ServiceRoutes<
    "fetchStudents" | "fetchStudentById" | "fetchStudentsByClass" | "createStudent" | "updateStudent" | "deleteStudent"
  >
  fetchStudents: (teacherId: string) => Promise<Student[]>
  fetchStudentById: (id: string) => Promise<Student>
  fetchStudentsByClass: (classId: string) => Promise<Student[]>
  createStudent: (data: StudentCreateInput) => Promise<{ id: string }>
  updateStudent: (data: StudentUpdateInput) => Promise<{ id: string }>
  deleteStudent: (id: string) => Promise<{ success: boolean }>
}

export interface StudentServerService {
  getStudents: (teacherId: string) => Promise<Student[]>
  getStudentById: (id: string) => Promise<Student>
  getStudentsByClass: (classId: string) => Promise<Student[]>
  createStudent: (data: StudentCreateInput) => Promise<{ id: string }>
  updateStudent: (data: StudentUpdateInput) => Promise<{ id: string }>
  deleteStudent: (id: string, teacherId: string) => Promise<{ success: boolean }>
}

export interface StudentHooks {
  useStudents: (teacherId: string | undefined) => UseQueryResult<Student[], Error>
  useStudent: (id: string) => UseQueryResult<Student, Error>
  useStudentsByClass: (classId: string) => UseQueryResult<Student[], Error>
  useCreateStudent: () => UseMutationResult<{ id: string }, Error, StudentCreateInput>
  useUpdateStudent: () => UseMutationResult<{ id: string }, Error, StudentUpdateInput>
  useDeleteStudent: () => UseMutationResult<{ success: boolean }, Error, string>
}

// ==========================================
// Class Types
// ==========================================

export type Class = {
  id: string
  name: string
  subject: string
  gradeLevel: number
  academicYear: string
  schedule: string | null
  room: string | null
  capacity: number | null
  description: string | null
  isActive: boolean
  teacherId: string
  createdAt: Date
  updatedAt: Date
}

export type StudentInClass = {
  studentId: string
  firstName: string
  lastName: string
  teacherId: string
}

export interface ClassService {
  baseRoute: string
  routes: ServiceRoutes<
    | "fetchClasses"
    | "fetchClassById"
    | "fetchStudentsInClass"
    | "createClass"
    | "updateClass"
    | "deleteClass"
    | "addStudentToClass"
    | "removeStudentFromClass"
  >
  fetchClasses: (teacherId: string) => Promise<ClassWithStudentCount[]>
  fetchClassById: (id: string) => Promise<Class>
  fetchStudentsInClass: (classId: string) => Promise<StudentInClass[]>
  createClass: (data: ClassCreateInput) => Promise<{ id: string }>
  updateClass: (data: ClassUpdateInput) => Promise<{ id: string }>
  deleteClass: (id: string) => Promise<{ success: boolean }>
  addStudentToClass: (params: { classId: string; studentId: string }) => Promise<{ success: boolean }>
  removeStudentFromClass: (params: { classId: string; studentId: string }) => Promise<{ success: boolean }>
}

export interface ClassServerService {
  getClasses: (teacherId: string) => Promise<ClassWithStudentCount[]>
  getClassById: (id: string, teacherId: string) => Promise<Class>
  getStudentsInClass: (classId: string) => Promise<StudentInClass[]>
  createClass: (data: ClassCreateInput) => Promise<{ id: string }>
  updateClass: (data: ClassUpdateInput) => Promise<{ id: string }>
  deleteClass: (id: string, teacherId: string) => Promise<{ success: boolean }>
  addStudentToClass: (classId: string, studentId: string) => Promise<{ success: boolean }>
  removeStudentFromClass: (classId: string, studentId: string) => Promise<{ success: boolean }>
  getStudentCountByClass: (teacherId: string) => Promise<{ id: string; name: string; student_count: number }[]>
}

export interface ClassHooks {
  useClasses: (teacherId: string | undefined) => UseQueryResult<ClassWithStudentCount[], Error>
  useClass: (id: string) => UseQueryResult<Class, Error>
  useStudentsInClass: (classId: string) => UseQueryResult<StudentInClass[], Error>
  useCreateClass: () => UseMutationResult<{ id: string }, Error, ClassCreateInput>
  useUpdateClass: () => UseMutationResult<{ id: string }, Error, ClassUpdateInput>
  useDeleteClass: () => UseMutationResult<{ success: boolean }, Error, string>
  useAddStudentToClass: () => UseMutationResult<{ success: boolean }, Error, { classId: string; studentId: string }>
  useRemoveStudentFromClass: () => UseMutationResult<
    { success: boolean },
    Error,
    { classId: string; studentId: string }
  >
}

// ==========================================
// Grade Types
// ==========================================

export type GradeWithDetails = {
  id: string
  score: number
  feedback: string | null
  studentId: string
  assignmentId: string
  studentName: string
  assignmentTitle: string
  createdAt: Date
  updatedAt: Date
}

export interface GradeService {
  baseRoute: string
  routes: ServiceRoutes<
    | "fetchGrades"
    | "fetchGradeById"
    | "fetchGradesByStudent"
    | "fetchGradesByAssignment"
    | "fetchGradesByClass"
    | "createGrade"
    | "updateGrade"
    | "deleteGrade"
  >
  fetchGrades: (teacherId: string) => Promise<GradeWithDetails[]>
  fetchGradeById: (id: string) => Promise<GradeWithDetails>
  fetchGradesByStudent: (studentId: string) => Promise<GradeWithDetails[]>
  fetchGradesByAssignment: (assignmentId: string) => Promise<GradeWithDetails[]>
  fetchGradesByClass: (classId: string) => Promise<GradeWithDetails[]>
  createGrade: (data: GradeCreateInput) => Promise<{ id: string }>
  updateGrade: (data: GradeUpdateInput) => Promise<{ id: string }>
  deleteGrade: (id: string) => Promise<{ success: boolean }>
}

export interface GradeServerService {
  getGrades: (teacherId: string) => Promise<GradeWithDetails[]>
  getGradeById: (id: string) => Promise<GradeWithDetails>
  getGradesByStudent: (studentId: string) => Promise<GradeWithDetails[]>
  getGradesByAssignment: (assignmentId: string) => Promise<GradeWithDetails[]>
  getGradesByClass: (classId: string) => Promise<GradeWithDetails[]>
  createGrade: (data: GradeCreateInput) => Promise<{ id: string }>
  updateGrade: (data: GradeUpdateInput) => Promise<{ id: string }>
  deleteGrade: (id: string, teacherId: string) => Promise<{ success: boolean }>
}

export interface GradeHooks {
  useGrades: (teacherId: string | undefined) => UseQueryResult<GradeWithDetails[], Error>
  useGrade: (id: string) => UseQueryResult<GradeWithDetails, Error>
  useStudentGrades: (studentId: string) => UseQueryResult<GradeWithDetails[], Error>
  useAssignmentGrades: (assignmentId: string) => UseQueryResult<GradeWithDetails[], Error>
  useClassGrades: (classId: string) => UseQueryResult<GradeWithDetails[], Error>
  useCreateGrade: () => UseMutationResult<{ id: string }, Error, GradeCreateInput>
  useUpdateGrade: () => UseMutationResult<{ id: string }, Error, GradeUpdateInput>
  useDeleteGrade: () => UseMutationResult<{ success: boolean }, Error, string>
}

// ==========================================
// Assignment Types
// ==========================================

export type Assignment = {
  id: string
  title: string
  description: string | null
  dueDate: Date
  points: number
  classId: string
  teacherId: string
  createdAt: Date
  updatedAt: Date
}

export interface AssignmentService {
  baseRoute: string
  routes: ServiceRoutes<
    | "fetchAssignments"
    | "fetchAssignmentById"
    | "fetchAssignmentsByClass"
    | "createAssignment"
    | "updateAssignment"
    | "deleteAssignment"
  >
  fetchAssignments: (teacherId: string) => Promise<Assignment[]>
  fetchAssignmentById: (id: string) => Promise<Assignment>
  fetchAssignmentsByClass: (classId: string) => Promise<Assignment[]>
  createAssignment: (data: AssignmentCreateInput) => Promise<{ id: string }>
  updateAssignment: (data: AssignmentUpdateInput) => Promise<{ id: string }>
  deleteAssignment: (id: string) => Promise<{ success: boolean }>
}

export interface AssignmentServerService {
  getAssignments: (teacherId: string) => Promise<Assignment[]>
  getAssignmentById: (id: string) => Promise<Assignment>
  getAssignmentsByClass: (classId: string) => Promise<Assignment[]>
  createAssignment: (data: AssignmentCreateInput) => Promise<{ id: string }>
  updateAssignment: (data: AssignmentUpdateInput) => Promise<{ id: string }>
  deleteAssignment: (id: string, teacherId: string) => Promise<{ success: boolean }>
}

export interface AssignmentHooks {
  useAssignments: (teacherId: string | undefined) => UseQueryResult<Assignment[], Error>
  useAssignment: (id: string) => UseQueryResult<Assignment, Error>
  useAssignmentsByClass: (classId: string) => UseQueryResult<Assignment[], Error>
  useCreateAssignment: () => UseMutationResult<{ id: string }, Error, AssignmentCreateInput>
  useUpdateAssignment: () => UseMutationResult<{ id: string }, Error, AssignmentUpdateInput>
  useDeleteAssignment: () => UseMutationResult<{ success: boolean }, Error, string>
}

// ==========================================
// Material Types
// ==========================================

export type Material = {
  id: string
  title: string
  description: string | null
  type: string
  url: string | null
  fileKey: string | null
  classId: string
  teacherId: string
  createdAt: Date
  updatedAt: Date
}

export interface MaterialService {
  baseRoute: string
  routes: ServiceRoutes<
    | "fetchMaterials"
    | "fetchMaterialById"
    | "fetchMaterialsByClass"
    | "createMaterial"
    | "updateMaterial"
    | "deleteMaterial"
  >
  fetchMaterials: (teacherId: string) => Promise<Material[]>
  fetchMaterialById: (id: string) => Promise<Material>
  fetchMaterialsByClass: (classId: string) => Promise<Material[]>
  createMaterial: (data: MaterialCreateInput) => Promise<{ id: string }>
  updateMaterial: (data: MaterialUpdateInput) => Promise<{ id: string }>
  deleteMaterial: (id: string) => Promise<{ success: boolean }>
}

export interface MaterialServerService {
  getMaterials: (teacherId: string) => Promise<Material[]>
  getMaterialById: (id: string) => Promise<Material>
  getMaterialsByClass: (classId: string) => Promise<Material[]>
  createMaterial: (data: MaterialCreateInput) => Promise<{ id: string }>
  updateMaterial: (data: MaterialUpdateInput) => Promise<{ id: string }>
  deleteMaterial: (id: string, teacherId: string) => Promise<{ success: boolean }>
}

export interface MaterialHooks {
  useMaterials: (teacherId: string | undefined) => UseQueryResult<Material[], Error>
  useMaterial: (id: string) => UseQueryResult<Material, Error>
  useMaterialsByClass: (classId: string) => UseQueryResult<Material[], Error>
  useCreateMaterial: () => UseMutationResult<{ id: string }, Error, MaterialCreateInput>
  useUpdateMaterial: () => UseMutationResult<{ id: string }, Error, MaterialUpdateInput>
  useDeleteMaterial: () => UseMutationResult<{ success: boolean }, Error, string>
}

// ==========================================
// Lesson Plan Types
// ==========================================

export type LessonPlan = {
  id: string
  title: string
  description: string | null
  objectives: string
  content: string
  date: Date
  duration: number
  classId: string
  teacherId: string
  createdAt: Date
  updatedAt: Date
}

export interface LessonPlanService {
  baseRoute: string
  routes: ServiceRoutes<
    | "fetchLessonPlans"
    | "fetchLessonPlanById"
    | "fetchLessonPlansByClass"
    | "createLessonPlan"
    | "updateLessonPlan"
    | "deleteLessonPlan"
  >
  fetchLessonPlans: (teacherId: string) => Promise<LessonPlan[]>
  fetchLessonPlanById: (id: string) => Promise<LessonPlan>
  fetchLessonPlansByClass: (classId: string) => Promise<LessonPlan[]>
  createLessonPlan: (data: LessonPlanCreateInput) => Promise<{ id: string }>
  updateLessonPlan: (data: LessonPlanUpdateInput) => Promise<{ id: string }>
  deleteLessonPlan: (id: string) => Promise<{ success: boolean }>
}

export interface LessonPlanServerService {
  getLessonPlans: (teacherId: string) => Promise<LessonPlan[]>
  getLessonPlanById: (id: string) => Promise<LessonPlan>
  getLessonPlansByClass: (classId: string) => Promise<LessonPlan[]>
  createLessonPlan: (data: LessonPlanCreateInput) => Promise<{ id: string }>
  updateLessonPlan: (data: LessonPlanUpdateInput) => Promise<{ id: string }>
  deleteLessonPlan: (id: string, teacherId: string) => Promise<{ success: boolean }>
}

export interface LessonPlanHooks {
  useLessonPlans: (teacherId: string | undefined) => UseQueryResult<LessonPlan[], Error>
  useLessonPlan: (id: string) => UseQueryResult<LessonPlan, Error>
  useLessonPlansByClass: (classId: string) => UseQueryResult<LessonPlan[], Error>
  useCreateLessonPlan: () => UseMutationResult<{ id: string }, Error, LessonPlanCreateInput>
  useUpdateLessonPlan: () => UseMutationResult<{ id: string }, Error, LessonPlanUpdateInput>
  useDeleteLessonPlan: () => UseMutationResult<{ success: boolean }, Error, string>
}

// ==========================================
// Subscription Types
// ==========================================

export type Subscription = {
  id: string
  userId: string
  status: string
  priceId: string
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
  createdAt: Date
  updatedAt: Date
}

export interface SubscriptionService {
  getCurrentSubscription: (userId: string) => Promise<Subscription | null>
  createSubscription: (userId: string, priceId: string) => Promise<Subscription>
  cancelSubscription: (userId: string) => Promise<Subscription>
  updateSubscription: (userId: string, priceId: string) => Promise<Subscription>
}
