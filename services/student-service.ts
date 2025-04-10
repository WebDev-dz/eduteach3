import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { StudentCreateInput, StudentUpdateInput } from "@/lib/db/dal/students"

// Query keys
export const studentKeys = {
  all: ["students"] as const,
  lists: () => [...studentKeys.all, "list"] as const,
  list: (filters: Record<string, any>) => [...studentKeys.lists(), filters] as const,
  details: () => [...studentKeys.all, "detail"] as const,
  detail: (id: string) => [...studentKeys.details(), id] as const,
  class: (classId: string) => [...studentKeys.all, "class", classId] as const,
}

export interface StudentService {
  baseRoute: string
  routes: {
    fetchStudents: string
    fetchStudentById: string
    fetchStudentsByClass: string
    createStudent: string
    updateStudent: string
    deleteStudent: string
  }
  fetchStudents: (teacherId: string) => Promise<any[]>
  fetchStudentById: (id: string) => Promise<any>
  fetchStudentsByClass: (classId: string) => Promise<any[]>
  createStudent: (data: StudentCreateInput) => Promise<any>
  updateStudent: (data: StudentUpdateInput) => Promise<any>
  deleteStudent: (id: string) => Promise<any>
}

// Hooks
export function useStudents(teacherId: string | undefined) {
  return useQuery({
    queryKey: studentKeys.list({ teacherId }),
    queryFn: () => (teacherId ? studentClientService.fetchStudents(teacherId) : Promise.resolve([])),
    enabled: !!teacherId,
  })
}

export function useStudent(id: string) {
  return useQuery({
    queryKey: studentKeys.detail(id),
    queryFn: () => studentClientService.fetchStudentById(id),
    enabled: !!id,
  })
}

export function useStudentsByClass(classId: string) {
  return useQuery({
    queryKey: studentKeys.class(classId),
    queryFn: () => studentClientService.fetchStudentsByClass(classId),
    enabled: !!classId,
  })
}

export function useCreateStudent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: studentClientService.createStudent,
    onSuccess: (data, variables) => {
      // Invalidate the students list query
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() })
      toast.success("Student created successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useUpdateStudent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: studentClientService.updateStudent,
    onSuccess: (data, variables) => {
      // Invalidate both the list and the specific student detail
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: studentKeys.detail(variables.id),
      })
      toast.success("Student updated successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useDeleteStudent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: studentClientService.deleteStudent,
    onSuccess: (data, variables) => {
      // Invalidate the students list query
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() })
      toast.success("Student deleted successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const studentClientService: StudentService = {
  baseRoute: "/api/students",
  routes: {
    fetchStudents: "/",
    fetchStudentById: "/",
    fetchStudentsByClass: "/by-class",
    createStudent: "/",
    updateStudent: "/",
    deleteStudent: "/",
  },
  fetchStudents: async (teacherId: string) => {
    const response = await fetch(
      `${studentClientService.baseRoute}${studentClientService.routes.fetchStudents}?teacherId=${teacherId}`,
    )
    if (!response.ok) {
      throw new Error("Failed to fetch students")
    }
    return response.json()
  },
  fetchStudentById: async (id: string) => {
    const response = await fetch(
      `${studentClientService.baseRoute}${studentClientService.routes.fetchStudentById}/${id}`,
    )
    if (!response.ok) {
      throw new Error("Failed to fetch student")
    }
    return response.json()
  },
  fetchStudentsByClass: async (classId: string) => {
    const response = await fetch(
      `${studentClientService.baseRoute}${studentClientService.routes.fetchStudentsByClass}?classId=${classId}`,
    )
    if (!response.ok) {
      throw new Error("Failed to fetch students for class")
    }
    return response.json()
  },
  createStudent: async (data: StudentCreateInput) => {
    const response = await fetch(`${studentClientService.baseRoute}${studentClientService.routes.createStudent}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to create student")
    }

    return response.json()
  },
  updateStudent: async (data: StudentUpdateInput) => {
    const response = await fetch(
      `${studentClientService.baseRoute}${studentClientService.routes.updateStudent}/${data.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to update student")
    }

    return response.json()
  },
  deleteStudent: async (id: string) => {
    const response = await fetch(
      `${studentClientService.baseRoute}${studentClientService.routes.deleteStudent}/${id}`,
      {
        method: "DELETE",
      },
    )

    if (!response.ok) {
      throw new Error("Failed to delete student")
    }

    return response.json()
  },
}
