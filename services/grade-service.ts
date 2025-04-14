// @/services/grade-service
"use client"

import { URL } from 'url'

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { GradeService, GradeWithDetails } from "@/types/services"
import { GradeCreateInput, GradeUpdateInput } from "@/types/entities"
import { toUrl } from '@/lib/utils'

// Query keys
export const gradeKeys = {
  all: ["grades"] as const,
  lists: () => [...gradeKeys.all, "list"] as const,
  list: (filters: Record<string, any>) => [...gradeKeys.lists(), filters] as const,
  details: () => [...gradeKeys.all, "detail"] as const,
  detail: (id: string) => [...gradeKeys.details(), id] as const,
  student: (studentId: string) => [...gradeKeys.all, "student", studentId] as const,
  assignment: (assignmentId: string) => [...gradeKeys.all, "assignment", assignmentId] as const,
  class: (classId: string) => [...gradeKeys.all, "class", classId] as const,
}




// Hooks
export function useGrades(teacherId: string | undefined) {
  return useQuery({
    queryKey: gradeKeys.list({ teacherId }),
    queryFn: () => (teacherId ? gradeClientService.fetchGrades(teacherId) : Promise.resolve([])),
    enabled: !!teacherId,
  })
}

export function useGrade(id: string) {
  return useQuery({
    queryKey: gradeKeys.detail(id),
    queryFn: () => gradeClientService.fetchGradeById(id),
    enabled: !!id,
  })
}

export function useStudentGrades(studentId: string) {
  return useQuery({
    queryKey: gradeKeys.student(studentId),
    queryFn: () => gradeClientService.fetchGradesByStudent(studentId),
    enabled: !!studentId,
  })
}

export function useAssignmentGrades(assignmentId: string) {
  return useQuery({
    queryKey: gradeKeys.assignment(assignmentId),
    queryFn: () => gradeClientService.fetchGradesByAssignment(assignmentId),
    enabled: !!assignmentId,
  })
}

export function useClassGrades(classId: string) {
  return useQuery({
    queryKey: gradeKeys.class(classId),
    queryFn: () => gradeClientService.fetchGradesByClass(classId),
    enabled: !!classId,
  })
}

export function useCreateGrade() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: gradeClientService.createGrade,
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: gradeKeys.lists() })
      queryClient.invalidateQueries({ queryKey: gradeKeys.student(variables?.studentId ?? "") })
      queryClient.invalidateQueries({ queryKey: gradeKeys.assignment(variables?.assignmentId ?? "") })
      toast.success("Grade created successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useUpdateGrade() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: gradeClientService.updateGrade,
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: gradeKeys.lists() })
      queryClient.invalidateQueries({ queryKey: gradeKeys.detail(variables.id) })
      toast.success("Grade updated successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useDeleteGrade() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: gradeClientService.deleteGrade,
    onSuccess: (data, variables) => {
      // Invalidate the grades list query
      queryClient.invalidateQueries({ queryKey: gradeKeys.lists() })
      toast.success("Grade deleted successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const gradeClientService: GradeService = {
  baseRoute: "/api/grades",
  routes: {
    fetchGrades: () => {
      return toUrl(gradeClientService.baseRoute)
    },
    fetchGradeDistribution: (params: {
      classId?: string;
      assignmentId?: string;
      studentId?: string;
    }) => {
      return toUrl(gradeClientService.baseRoute, { distribution: "true", ...params })
    },
    fetchGradeById: (id: string) => {
      return toUrl(gradeClientService.baseRoute, { id })
    },
    fetchGradesByStudent: (studentId: string) => {
      return toUrl(gradeClientService.baseRoute, { studentId })
    },
    createBulkGrades: () => {
      return toUrl(gradeClientService.baseRoute, { bulk: "true" })
    },
    fetchGradesByAssignment: (assignmentId: string) => {
      return toUrl(gradeClientService.baseRoute, { assignmentId })
    },
    fetchGradesByClass: (classId: string) => {
      return toUrl(gradeClientService.baseRoute, { classId })
    },
    createGrade: () => {
      return toUrl(gradeClientService.baseRoute)
    },
    updateGrade: (id: string) => {
      return toUrl(gradeClientService.baseRoute, { id })
    },
    deleteGrade: (id: string) => {
      return toUrl(gradeClientService.baseRoute, { id })
    },
  },
  fetchGrades: async (teacherId: string) => {
    const response = await fetch(
      `${gradeClientService.baseRoute}${gradeClientService.routes.fetchGrades}?teacherId=${teacherId}`,
    )
    if (!response.ok) {
      throw new Error("Failed to fetch grades")
    }
    return response.json()
  },
  fetchGradeDistribution: async (params: {
    classId?: string;
    assignmentId?: string;
    studentId?: string;
  }) => {
    const response = await fetch(
      gradeClientService.routes.fetchGradeDistribution(params),
    )
    if (!response.ok) {
      throw new Error("Failed to fetch grade distribution")
    }
    return response.json()
  },
  fetchGradeById: async (id: string) => {
    const response = await fetch(gradeClientService.routes.fetchGradeById(id))
    if (!response.ok) {
      throw new Error("Failed to fetch grade")
    }
    return response.json()
  },
  fetchGradesByStudent: async (studentId: string) => {
    const response = await fetch(
      `${gradeClientService.baseRoute}${gradeClientService.routes.fetchGradesByStudent}?studentId=${studentId}`,
    )
    if (!response.ok) {
      throw new Error("Failed to fetch grades for student")
    }
    return response.json()
  },
  fetchGradesByAssignment: async (assignmentId: string) => {
    const response = await fetch(
      `${gradeClientService.baseRoute}${gradeClientService.routes.fetchGradesByAssignment}?assignmentId=${assignmentId}`,
    )
    if (!response.ok) {
      throw new Error("Failed to fetch grades for assignment")
    }
    return response.json()
  },
  fetchGradesByClass: async (classId: string) => {
    const response = await fetch(
      `${gradeClientService.baseRoute}${gradeClientService.routes.fetchGradesByClass}?classId=${classId}`,
    )
    if (!response.ok) {
      throw new Error("Failed to fetch grades for class")
    }
    return response.json()
  },
  createGrade: async (data: GradeCreateInput) => {
    const response = await fetch(`${gradeClientService.baseRoute}${gradeClientService.routes.createGrade}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to create grade")
    }

    return response.json()
  },
  createBulkGrades: async (data: GradeCreateInput[]) => {
    const response = await fetch(`${gradeClientService.baseRoute}${gradeClientService.routes.createBulkGrades}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to create bulk grades")
    }

    return response.json()
  },
  updateGrade: async (data: GradeUpdateInput) => {
    const response = await fetch(`${gradeClientService.baseRoute}${gradeClientService.routes.updateGrade}/${data.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to update grade")
    }

    return response.json()
  },
  deleteGrade: async (id: string) => {
    const response = await fetch(`${gradeClientService.baseRoute}${gradeClientService.routes.deleteGrade}/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error("Failed to delete grade")
    }

    return response.json()
  },
}
