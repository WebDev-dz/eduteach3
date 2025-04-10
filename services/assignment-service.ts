import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { AssignmentCreateInput, AssignmentUpdateInput } from "@/lib/db/dal/assignments"

// Query keys
export const assignmentKeys = {
  all: ["assignments"] as const,
  lists: () => [...assignmentKeys.all, "list"] as const,
  list: (filters: Record<string, any>) => [...assignmentKeys.lists(), filters] as const,
  details: () => [...assignmentKeys.all, "detail"] as const,
  detail: (id: string) => [...assignmentKeys.details(), id] as const,
  class: (classId: string) => [...assignmentKeys.all, "class", classId] as const,
}

export interface AssignmentService {
  baseRoute: string
  routes: {
    fetchAssignments: string
    fetchAssignmentById: string
    fetchAssignmentsByClass: string
    createAssignment: string
    updateAssignment: string
    deleteAssignment: string
  }
  fetchAssignments: (teacherId: string) => Promise<any[]>
  fetchAssignmentById: (id: string) => Promise<any>
  fetchAssignmentsByClass: (classId: string) => Promise<any[]>
  createAssignment: (data: AssignmentCreateInput) => Promise<any>
  updateAssignment: (data: AssignmentUpdateInput) => Promise<any>
  deleteAssignment: (id: string) => Promise<any>
}

// Hooks
export function useAssignments(teacherId: string | undefined) {
  return useQuery({
    queryKey: assignmentKeys.list({ teacherId }),
    queryFn: () => (teacherId ? assignmentClientService.fetchAssignments(teacherId) : Promise.resolve([])),
    enabled: !!teacherId,
  })
}

export function useAssignment(id: string) {
  return useQuery({
    queryKey: assignmentKeys.detail(id),
    queryFn: () => assignmentClientService.fetchAssignmentById(id),
    enabled: !!id,
  })
}

export function useAssignmentsByClass(classId: string) {
  return useQuery({
    queryKey: assignmentKeys.class(classId),
    queryFn: () => assignmentClientService.fetchAssignmentsByClass(classId),
    enabled: !!classId,
  })
}

export function useCreateAssignment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: assignmentClientService.createAssignment,
    onSuccess: (data, variables) => {
      // Invalidate the assignments list query
      queryClient.invalidateQueries({ queryKey: assignmentKeys.lists() })
      // Invalidate the class-specific assignments query
      if (variables.classId) {
        queryClient.invalidateQueries({
          queryKey: assignmentKeys.class(variables.classId),
        })
      }
      toast.success("Assignment created successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useUpdateAssignment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: assignmentClientService.updateAssignment,
    onSuccess: (data, variables) => {
      // Invalidate both the list and the specific assignment detail
      queryClient.invalidateQueries({ queryKey: assignmentKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: assignmentKeys.detail(variables.id),
      })
      // Invalidate the class-specific assignments query if classId is provided
      if (variables.classId) {
        queryClient.invalidateQueries({
          queryKey: assignmentKeys.class(variables.classId),
        })
      }
      toast.success("Assignment updated successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useDeleteAssignment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: assignmentClientService.deleteAssignment,
    onSuccess: (data, variables) => {
      // Invalidate the assignments list query
      queryClient.invalidateQueries({ queryKey: assignmentKeys.lists() })
      toast.success("Assignment deleted successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const assignmentClientService: AssignmentService = {
  baseRoute: "/api/assignments",
  routes: {
    fetchAssignments: "/",
    fetchAssignmentById: "/",
    fetchAssignmentsByClass: "/by-class",
    createAssignment: "/",
    updateAssignment: "/",
    deleteAssignment: "/",
  },
  fetchAssignments: async (teacherId: string) => {
    const response = await fetch(
      `${assignmentClientService.baseRoute}${assignmentClientService.routes.fetchAssignments}?teacherId=${teacherId}`,
    )
    if (!response.ok) {
      throw new Error("Failed to fetch assignments")
    }
    return response.json()
  },
  fetchAssignmentById: async (id: string) => {
    const response = await fetch(
      `${assignmentClientService.baseRoute}${assignmentClientService.routes.fetchAssignmentById}/${id}`,
    )
    if (!response.ok) {
      throw new Error("Failed to fetch assignment")
    }
    return response.json()
  },
  fetchAssignmentsByClass: async (classId: string) => {
    const response = await fetch(
      `${assignmentClientService.baseRoute}${assignmentClientService.routes.fetchAssignmentsByClass}?classId=${classId}`,
    )
    if (!response.ok) {
      throw new Error("Failed to fetch assignments for class")
    }
    return response.json()
  },
  createAssignment: async (data: AssignmentCreateInput) => {
    const response = await fetch(
      `${assignmentClientService.baseRoute}${assignmentClientService.routes.createAssignment}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to create assignment")
    }

    return response.json()
  },
  updateAssignment: async (data: AssignmentUpdateInput) => {
    const response = await fetch(
      `${assignmentClientService.baseRoute}${assignmentClientService.routes.updateAssignment}/${data.id}`,
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
      throw new Error(error.error || "Failed to update assignment")
    }

    return response.json()
  },
  deleteAssignment: async (id: string) => {
    const response = await fetch(
      `${assignmentClientService.baseRoute}${assignmentClientService.routes.deleteAssignment}/${id}`,
      {
        method: "DELETE",
      },
    )

    if (!response.ok) {
      throw new Error("Failed to delete assignment")
    }

    return response.json()
  },
}
