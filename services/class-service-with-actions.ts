import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { ClassCreateInput, ClassUpdateInput, ClassWithStudentCount } from "@/lib/db/dal/classes"
import { addStudentToClassAction, removeStudentFromClassAction } from "@/lib/db/dal/classes"

// Query keys
export const classKeys = {
  all: ["classes"] as const,
  lists: () => [...classKeys.all, "list"] as const,
  list: (filters: Record<string, any>) => [...classKeys.lists(), filters] as const,
  details: () => [...classKeys.all, "detail"] as const,
  detail: (id: string) => [...classKeys.details(), id] as const,
  students: () => [...classKeys.all, "students"] as const,
  studentsInClass: (classId: string) => [...classKeys.students(), classId] as const,
}

// Types
export type StudentInClass = {
  studentId: string
  firstName: string
  lastName: string
  teacherId: string
}

export interface ClassService {
  baseRoute: "/api/classes"
  routes: {
    fetchClasses: "/"
    fetchClassById: "/"
    fetchStudentsInClass: "/students"
    createClass: "/"
    updateClass: "/"
    deleteClass: "/"
    addStudentToClass: "/students"
    removeStudentFromClass: "/students"
  }
  fetchClasses: (teacherId: string) => Promise<ClassWithStudentCount[]>
  fetchClassById: (id: string) => Promise<any>
  fetchStudentsInClass: (classId: string) => Promise<StudentInClass[]>
  createClass: (data: ClassCreateInput) => Promise<any>
  updateClass: (data: ClassUpdateInput) => Promise<any>
  deleteClass: (id: string) => Promise<any>
  addStudentToClass: (params: { classId: string; studentId: string }) => Promise<any>
  removeStudentFromClass: (params: { classId: string; studentId: string }) => Promise<any>
}

// Server Actions
export async function addStudentToClassFormAction(formData: FormData) {
  "use server"

  const classId = formData.get("classId") as string
  const studentId = formData.get("studentId") as string

  if (!classId || !studentId) {
    return { error: "Missing required fields" }
  }

  return addStudentToClassAction(classId, studentId)
}

export async function removeStudentFromClassFormAction(formData: FormData) {
  "use server"

  const classId = formData.get("classId") as string
  const studentId = formData.get("studentId") as string

  if (!classId || !studentId) {
    return { error: "Missing required fields" }
  }

  return removeStudentFromClassAction(classId, studentId)
}

// Hooks
export function useClasses(teacherId: string | undefined) {
  return useQuery({
    queryKey: classKeys.list({ teacherId }),
    queryFn: () => (teacherId ? classClientService.fetchClasses(teacherId) : Promise.resolve([])),
    enabled: !!teacherId,
  })
}

export function useClass(id: string) {
  return useQuery({
    queryKey: classKeys.detail(id),
    queryFn: () => classClientService.fetchClassById(id),
    enabled: !!id,
  })
}

export function useStudentsInClass(classId: string) {
  return useQuery({
    queryKey: classKeys.studentsInClass(classId),
    queryFn: () => classClientService.fetchStudentsInClass(classId),
    enabled: !!classId,
  })
}

export function useAddStudentToClass() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: classClientService.addStudentToClass,
    onSuccess: (data, variables) => {
      // Invalidate the students in class query
      queryClient.invalidateQueries({ queryKey: classKeys.studentsInClass(variables.classId) })
      toast.success("Student added to class successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useRemoveStudentFromClass() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: classClientService.removeStudentFromClass,
    onSuccess: (data, variables) => {
      // Invalidate the students in class query
      queryClient.invalidateQueries({ queryKey: classKeys.studentsInClass(variables.classId) })
      toast.success("Student removed from class successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useCreateClass() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: classClientService.createClass,
    onSuccess: (data, variables) => {
      // Invalidate the classes list query
      queryClient.invalidateQueries({ queryKey: classKeys.lists() })
      toast.success("Class created successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useUpdateClass() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: classClientService.updateClass,
    onSuccess: (data, variables) => {
      // Invalidate both the list and the specific class detail
      queryClient.invalidateQueries({ queryKey: classKeys.lists() })
      queryClient.invalidateQueries({ queryKey: classKeys.detail(variables.id) })
      toast.success("Class updated successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useDeleteClass() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: classClientService.deleteClass,
    onSuccess: (data, variables) => {
      // Invalidate the classes list query
      queryClient.invalidateQueries({ queryKey: classKeys.lists() })
      toast.success("Class deleted successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const classClientService: ClassService = {
  baseRoute: "/api/classes",
  routes: {
    fetchClasses: "/",
    fetchClassById: "/",
    fetchStudentsInClass: "/students",
    createClass: "/",
    updateClass: "/",
    deleteClass: "/",
    addStudentToClass: "/students",
    removeStudentFromClass: "/students",
  },
  fetchClasses: async (teacherId: string) => {
    const response = await fetch(
      `${classClientService.baseRoute}${classClientService.routes.fetchClasses}?teacherId=${teacherId}`,
    )
    if (!response.ok) {
      throw new Error("Failed to fetch classes")
    }
    return response.json()
  },
  fetchClassById: async (id: string) => {
    const response = await fetch(`${classClientService.baseRoute}${classClientService.routes.fetchClassById}/${id}`)
    if (!response.ok) {
      throw new Error("Failed to fetch class")
    }
    return response.json()
  },
  fetchStudentsInClass: async (classId: string) => {
    const response = await fetch(
      `${classClientService.baseRoute}${classClientService.routes.fetchStudentsInClass}?classId=${classId}`,
    )
    if (!response.ok) {
      throw new Error("Failed to fetch students in class")
    }
    return response.json()
  },
  createClass: async (data: ClassCreateInput) => {
    const response = await fetch(`${classClientService.baseRoute}${classClientService.routes.createClass}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to create class")
    }

    return response.json()
  },
  updateClass: async (data: ClassUpdateInput) => {
    const response = await fetch(`${classClientService.baseRoute}${classClientService.routes.updateClass}/${data.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to update class")
    }

    return response.json()
  },
  deleteClass: async (id: string) => {
    const response = await fetch(`${classClientService.baseRoute}${classClientService.routes.deleteClass}/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error("Failed to delete class")
    }

    return response.json()
  },
  addStudentToClass: async ({ classId, studentId }) => {
    const response = await fetch(`${classClientService.baseRoute}${classClientService.routes.addStudentToClass}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ classId, studentId }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to add student to class")
    }

    return response.json()
  },
  removeStudentFromClass: async ({ classId, studentId }) => {
    const response = await fetch(`${classClientService.baseRoute}${classClientService.routes.removeStudentFromClass}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ classId, studentId }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to remove student from class")
    }

    return response.json()
  },
}
