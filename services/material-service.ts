import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { MaterialCreateInput, MaterialUpdateInput } from "@/lib/db/dal/materials"

// Query keys
export const materialKeys = {
  all: ["materials"] as const,
  lists: () => [...materialKeys.all, "list"] as const,
  list: (filters: Record<string, any>) => [...materialKeys.lists(), filters] as const,
  details: () => [...materialKeys.all, "detail"] as const,
  detail: (id: string) => [...materialKeys.details(), id] as const,
  class: (classId: string) => [...materialKeys.all, "class", classId] as const,
}

export interface MaterialService {
  baseRoute: string
  routes: {
    fetchMaterials: string
    fetchMaterialById: string
    fetchMaterialsByClass: string
    createMaterial: string
    updateMaterial: string
    deleteMaterial: string
  }
  fetchMaterials: (teacherId: string) => Promise<any[]>
  fetchMaterialById: (id: string) => Promise<any>
  fetchMaterialsByClass: (classId: string) => Promise<any[]>
  createMaterial: (data: MaterialCreateInput) => Promise<any>
  updateMaterial: (data: MaterialUpdateInput) => Promise<any>
  deleteMaterial: (id: string) => Promise<any>
}

// Hooks
export function useMaterials(teacherId: string | undefined) {
  return useQuery({
    queryKey: materialKeys.list({ teacherId }),
    queryFn: () => (teacherId ? materialClientService.fetchMaterials(teacherId) : Promise.resolve([])),
    enabled: !!teacherId,
  })
}

export function useMaterial(id: string) {
  return useQuery({
    queryKey: materialKeys.detail(id),
    queryFn: () => materialClientService.fetchMaterialById(id),
    enabled: !!id,
  })
}

export function useMaterialsByClass(classId: string) {
  return useQuery({
    queryKey: materialKeys.class(classId),
    queryFn: () => materialClientService.fetchMaterialsByClass(classId),
    enabled: !!classId,
  })
}

export function useCreateMaterial() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: materialClientService.createMaterial,
    onSuccess: (data, variables) => {
      // Invalidate the materials list query
      queryClient.invalidateQueries({ queryKey: materialKeys.lists() })
      // Invalidate the class-specific materials query
      if (variables.classId) {
        queryClient.invalidateQueries({
          queryKey: materialKeys.class(variables.classId),
        })
      }
      toast.success("Material created successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useUpdateMaterial() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: materialClientService.updateMaterial,
    onSuccess: (data, variables) => {
      // Invalidate both the list and the specific material detail
      queryClient.invalidateQueries({ queryKey: materialKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: materialKeys.detail(variables.id),
      })
      // Invalidate the class-specific materials query if classId is provided
      if (variables.classId) {
        queryClient.invalidateQueries({
          queryKey: materialKeys.class(variables.classId),
        })
      }
      toast.success("Material updated successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useDeleteMaterial() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: materialClientService.deleteMaterial,
    onSuccess: (data, variables) => {
      // Invalidate the materials list query
      queryClient.invalidateQueries({ queryKey: materialKeys.lists() })
      toast.success("Material deleted successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const materialClientService: MaterialService = {
  baseRoute: "/api/materials",
  routes: {
    fetchMaterials: "/",
    fetchMaterialById: "/",
    fetchMaterialsByClass: "/by-class",
    createMaterial: "/",
    updateMaterial: "/",
    deleteMaterial: "/",
  },
  fetchMaterials: async (teacherId: string) => {
    const response = await fetch(
      `${materialClientService.baseRoute}${materialClientService.routes.fetchMaterials}?teacherId=${teacherId}`,
    )
    if (!response.ok) {
      throw new Error("Failed to fetch materials")
    }
    return response.json()
  },
  fetchMaterialById: async (id: string) => {
    const response = await fetch(
      `${materialClientService.baseRoute}${materialClientService.routes.fetchMaterialById}/${id}`,
    )
    if (!response.ok) {
      throw new Error("Failed to fetch material")
    }
    return response.json()
  },
  fetchMaterialsByClass: async (classId: string) => {
    const response = await fetch(
      `${materialClientService.baseRoute}${materialClientService.routes.fetchMaterialsByClass}?classId=${classId}`,
    )
    if (!response.ok) {
      throw new Error("Failed to fetch materials for class")
    }
    return response.json()
  },
  createMaterial: async (data: MaterialCreateInput) => {
    const response = await fetch(`${materialClientService.baseRoute}${materialClientService.routes.createMaterial}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to create material")
    }

    return response.json()
  },
  updateMaterial: async (data: MaterialUpdateInput) => {
    const response = await fetch(
      `${materialClientService.baseRoute}${materialClientService.routes.updateMaterial}/${data.id}`,
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
      throw new Error(error.error || "Failed to update material")
    }

    return response.json()
  },
  deleteMaterial: async (id: string) => {
    const response = await fetch(
      `${materialClientService.baseRoute}${materialClientService.routes.deleteMaterial}/${id}`,
      {
        method: "DELETE",
      },
    )

    if (!response.ok) {
      throw new Error("Failed to delete material")
    }

    return response.json()
  },
}
