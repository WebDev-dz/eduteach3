import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { LessonPlanCreateInput, LessonPlanUpdateInput } from "@/lib/db/dal/lesson-plans"

// Query keys
export const lessonPlanKeys = {
  all: ["lessonPlans"] as const,
  lists: () => [...lessonPlanKeys.all, "list"] as const,
  list: (filters: Record<string, any>) => [...lessonPlanKeys.lists(), filters] as const,
  details: () => [...lessonPlanKeys.all, "detail"] as const,
  detail: (id: string) => [...lessonPlanKeys.details(), id] as const,
  class: (classId: string) => [...lessonPlanKeys.all, "class", classId] as const,
}

export interface LessonPlanService {
  baseRoute: string
  routes: {
    fetchLessonPlans: string
    fetchLessonPlanById: string
    fetchLessonPlansByClass: string
    createLessonPlan: string
    updateLessonPlan: string
    deleteLessonPlan: string
  }
  fetchLessonPlans: (teacherId: string) => Promise<any[]>
  fetchLessonPlanById: (id: string) => Promise<any>
  fetchLessonPlansByClass: (classId: string) => Promise<any[]>
  createLessonPlan: (data: LessonPlanCreateInput) => Promise<any>
  updateLessonPlan: (data: LessonPlanUpdateInput) => Promise<any>
  deleteLessonPlan: (id: string) => Promise<any>
}

// Hooks
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
    onSuccess: (data, variables) => {
      // Invalidate the lesson plans list query
      queryClient.invalidateQueries({ queryKey: lessonPlanKeys.lists() })
      // Invalidate the class-specific lesson plans query
      if (variables.classId) {
        queryClient.invalidateQueries({
          queryKey: lessonPlanKeys.class(variables.classId),
        })
      }
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
      // Invalidate both the list and the specific lesson plan detail
      queryClient.invalidateQueries({ queryKey: lessonPlanKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: lessonPlanKeys.detail(variables.id),
      })
      // Invalidate the class-specific lesson plans query if classId is provided
      if (variables.classId) {
        queryClient.invalidateQueries({
          queryKey: lessonPlanKeys.class(variables.classId),
        })
      }
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
    onSuccess: (data, variables) => {
      // Invalidate the lesson plans list query
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
    fetchLessonPlans: "/",
    fetchLessonPlanById: "/",
    fetchLessonPlansByClass: "/by-class",
    createLessonPlan: "/",
    updateLessonPlan: "/",
    deleteLessonPlan: "/",
  },
  fetchLessonPlans: async (teacherId: string) => {
    const response = await fetch(
      `${lessonPlanClientService.baseRoute}${lessonPlanClientService.routes.fetchLessonPlans}?teacherId=${teacherId}`,
    )
    if (!response.ok) {
      throw new Error("Failed to fetch lesson plans")
    }
    return response.json()
  },
  fetchLessonPlanById: async (id: string) => {
    const response = await fetch(
      `${lessonPlanClientService.baseRoute}${lessonPlanClientService.routes.fetchLessonPlanById}/${id}`,
    )
    if (!response.ok) {
      throw new Error("Failed to fetch lesson plan")
    }
    return response.json()
  },
  fetchLessonPlansByClass: async (classId: string) => {
    const response = await fetch(
      `${lessonPlanClientService.baseRoute}${lessonPlanClientService.routes.fetchLessonPlansByClass}?classId=${classId}`,
    )
    if (!response.ok) {
      throw new Error("Failed to fetch lesson plans for class")
    }
    return response.json()
  },
  createLessonPlan: async (data: LessonPlanCreateInput) => {
    const response = await fetch(
      `${lessonPlanClientService.baseRoute}${lessonPlanClientService.routes.createLessonPlan}`,
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
      throw new Error(error.error || "Failed to create lesson plan")
    }

    return response.json()
  },
  updateLessonPlan: async (data: LessonPlanUpdateInput) => {
    const response = await fetch(
      `${lessonPlanClientService.baseRoute}${lessonPlanClientService.routes.updateLessonPlan}/${data.id}`,
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
      throw new Error(error.error || "Failed to update lesson plan")
    }

    return response.json()
  },
  deleteLessonPlan: async (id: string) => {
    const response = await fetch(
      `${lessonPlanClientService.baseRoute}${lessonPlanClientService.routes.deleteLessonPlan}/${id}`,
      {
        method: "DELETE",
      },
    )

    if (!response.ok) {
      throw new Error("Failed to delete lesson plan")
    }

    return response.json()
  },
}
