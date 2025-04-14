// @/services/assignment-service
"use client"

import { URL } from 'url'

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { LessonPlanService } from "@/types/services"
import { LessonPlanCreateInput, LessonPlanUpdateInput } from "@/types/entities"
import { toUrl } from '@/lib/utils'



export const lessonPlanKeys = {
  all: ["lessonPlans"] as const,
  lists: () => [...lessonPlanKeys.all, "list"] as const,
  list: (filters: Record<string, any>) => [...lessonPlanKeys.lists(), filters] as const,
  details: () => [...lessonPlanKeys.all, "detail"] as const,
  detail: (id: string) => [...lessonPlanKeys.details(), id] as const,
  class: (classId: string) => [...lessonPlanKeys.all, "class", classId] as const,
}

export function useLessonPlans(teacherId: string | undefined) {
  return useQuery({
    queryKey: lessonPlanKeys.list({ teacherId }),
    queryFn: () => (teacherId ? lessonPlanClientService.fetchLessonPlans(teacherId) : Promise.resolve([])),
    enabled: !!teacherId,
  })
}

export function useLessonPlan(id: string) {
  return useQuery({
    queryKey: lessonPlanKeys.detail(id),
    queryFn: () => lessonPlanClientService.fetchLessonPlanById(id),
    enabled: !!id,
  })
}

export function useLessonPlansByClass(classId: string) {
  return useQuery({
    queryKey: lessonPlanKeys.class(classId),
    queryFn: () => lessonPlanClientService.fetchLessonPlansByClass(classId),
    enabled: !!classId,
  })
}

export function useCreateLessonPlan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: lessonPlanClientService.createLessonPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lessonPlanKeys.lists() })
      toast.success("Lesson plan created successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useUpdateLessonPlan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: lessonPlanClientService.updateLessonPlan,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: lessonPlanKeys.detail(variables.id) })
      toast.success("Lesson plan updated successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useDeleteLessonPlan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: lessonPlanClientService.deleteLessonPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lessonPlanKeys.lists() })
      toast.success("Lesson plan deleted successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const lessonPlanClientService: LessonPlanService = {
  baseRoute: "/api/lesson-plans",
  routes: {
    fetchLessonPlans: (teacherId: string) => {
      return toUrl(lessonPlanClientService.baseRoute, { teacherId })
    },
    fetchLessonPlanById: (id: string) => {
      return toUrl(lessonPlanClientService.baseRoute, { id })
    },
    fetchLessonPlansByClass: (classId: string) => {
      return toUrl(lessonPlanClientService.baseRoute, { classId })
    },
    createLessonPlan: () => toUrl(lessonPlanClientService.baseRoute),
    updateLessonPlan: (id: string) => toUrl(lessonPlanClientService.baseRoute, { id }),
    deleteLessonPlan: (id: string) => toUrl(lessonPlanClientService.baseRoute, { id }),
  },
  fetchLessonPlans: async (teacherId: string) => {
    const res = await fetch(lessonPlanClientService.routes.fetchLessonPlans(teacherId))
    if (!res.ok) throw new Error("Failed to fetch lesson plans")
    return res.json()
  },
  fetchLessonPlanById: async (id: string) => {
    const res = await fetch(lessonPlanClientService.routes.fetchLessonPlanById(id))
    if (!res.ok) throw new Error("Failed to fetch lesson plan")
    return res.json()
  },
  fetchLessonPlansByClass: async (classId: string) => {
    const res = await fetch(lessonPlanClientService.routes.fetchLessonPlansByClass(classId))
    if (!res.ok) throw new Error("Failed to fetch lesson plans by class")
    return res.json()
  },
  createLessonPlan: async (data: LessonPlanCreateInput) => {
    const res = await fetch(lessonPlanClientService.routes.createLessonPlan(undefined), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || "Failed to create lesson plan")
    }
    return res.json()
  },
  updateLessonPlan: async (data: LessonPlanUpdateInput) => {
    const res = await fetch(`${lessonPlanClientService.routes.updateLessonPlan(undefined)}/${data.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || "Failed to update lesson plan")
    }
    return res.json()
  },
  deleteLessonPlan: async (id: string) => {
    const res = await fetch(lessonPlanClientService.routes.deleteLessonPlan(id), {
      method: "DELETE",
    })
    if (!res.ok) throw new Error("Failed to delete lesson plan")
    return res.json()
  },
}
