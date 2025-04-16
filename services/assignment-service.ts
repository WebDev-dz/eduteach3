// @/services/assignment-service
"use client"

import { URL } from 'url'

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { AssignmentService } from "@/types/services"
import { AssignmentCreateInput, AssignmentUpdateInput } from "@/types/entities"
import { toUrl } from '@/lib/utils'
import { useRouter } from 'next/navigation'

export const assignmentKeys = {
  all: ["assignments"] as const,
  lists: () => [...assignmentKeys.all, "list"] as const,
  list: (filters: Record<string, any>) => [...assignmentKeys.lists(), filters] as const,
  details: () => [...assignmentKeys.all, "detail"] as const,
  detail: (id: string) => [...assignmentKeys.details(), id] as const,
  class: (classId: string) => [...assignmentKeys.all, "class", classId] as const,
}

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
  const router = useRouter()
  return useMutation({
    mutationFn: assignmentClientService.createAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assignmentKeys.lists() })
      toast.success("Assignment created successfully")
      router.push("/assignments")
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
      queryClient.invalidateQueries({ queryKey: assignmentKeys.detail(variables.id) })
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
    onSuccess: () => {
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
    fetchAssignments: (teacherId: string) => {
      return toUrl(assignmentClientService.baseRoute, { teacherId })
    },
    fetchAssignmentById: (id: string) => {
      return toUrl(assignmentClientService.baseRoute, { id })
    },
    fetchAssignmentsByClass: (classId: string) => {
      return toUrl(assignmentClientService.baseRoute, { classId })
    },
    createAssignment: () => toUrl(assignmentClientService.baseRoute),
    updateAssignment: (id: string) => toUrl(assignmentClientService.baseRoute, { id }),
    deleteAssignment: (id: string) => toUrl(assignmentClientService.baseRoute, { id }),
  },
  fetchAssignments: async (teacherId: string) => {
    const res = await fetch(assignmentClientService.routes.fetchAssignments(teacherId))
    if (!res.ok) throw new Error("Failed to fetch assignments")
    return res.json()
  },
  fetchAssignmentById: async (id: string) => {
    const res = await fetch(assignmentClientService.routes.fetchAssignmentById(id))
    if (!res.ok) throw new Error("Failed to fetch assignment")
    return res.json()
  },
  fetchAssignmentsByClass: async (classId: string) => {
    const res = await fetch(assignmentClientService.routes.fetchAssignmentsByClass(classId))
    if (!res.ok) throw new Error("Failed to fetch assignments by class")
    return res.json()
  },
  createAssignment: async (data: AssignmentCreateInput) => {
    const res = await fetch(assignmentClientService.routes.createAssignment(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || "Failed to create assignment")
    }
    return res.json()
  },
  updateAssignment: async (data: AssignmentUpdateInput) => {
    const res = await fetch(assignmentClientService.routes.updateAssignment(data.id), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || "Failed to update assignment")
    }
    return res.json()
  },
  deleteAssignment: async (id: string) => {
    const res = await fetch(assignmentClientService.routes.deleteAssignment(id), {
      method: "DELETE",
    })
    if (!res.ok) throw new Error("Failed to delete assignment")
    return res.json()
  },
}
