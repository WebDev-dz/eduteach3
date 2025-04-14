// @/services/assignment-service
"use client"

import { URL } from 'url'

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { MaterialService } from "@/types/services"
import { MaterialCreateInput, MaterialUpdateInput } from "@/types/entities"
import { toUrl } from '@/lib/utils'

export const materialKeys = {
  all: ["materials"] as const,
  lists: () => [...materialKeys.all, "list"] as const,
  list: (filters: Record<string, any>) => [...materialKeys.lists(), filters] as const,
  details: () => [...materialKeys.all, "detail"] as const,
  detail: (id: string) => [...materialKeys.details(), id] as const,
  class: (classId: string) => [...materialKeys.all, "class", classId] as const,
}

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialKeys.lists() })
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
      queryClient.invalidateQueries({ queryKey: materialKeys.detail(variables.id) })
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
    onSuccess: () => {
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
    fetchMaterials: (teacherId: string) => {
      return toUrl(materialClientService.baseRoute, { teacherId })
    },
    fetchMaterialById: (id: string) => {
      return toUrl(materialClientService.baseRoute, { id })
    },
    fetchMaterialsByClass: (classId: string) => {
      return toUrl(materialClientService.baseRoute, { classId })
    },
    createMaterial: () => toUrl(materialClientService.baseRoute),
    updateMaterial: (id: string) => toUrl(materialClientService.baseRoute, { id }),
    deleteMaterial: (id: string) => toUrl(materialClientService.baseRoute, { id }),
  },
  fetchMaterials: async (teacherId: string) => {
    const res = await fetch(materialClientService.routes.fetchMaterials(teacherId))
    if (!res.ok) throw new Error("Failed to fetch materials")
    return res.json()
  },
  fetchMaterialById: async (id: string) => {
    const res = await fetch(materialClientService.routes.fetchMaterialById(id))
    if (!res.ok) throw new Error("Failed to fetch material")
    return res.json()
  },
  fetchMaterialsByClass: async (classId: string) => {
    const res = await fetch(materialClientService.routes.fetchMaterialsByClass(classId))
    if (!res.ok) throw new Error("Failed to fetch materials by class")
    return res.json()
  },
  createMaterial: async (data: MaterialCreateInput) => {
    const res = await fetch(materialClientService.routes.createMaterial(undefined), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || "Failed to create material")
    }
    return res.json()
  },
  updateMaterial: async (data: MaterialUpdateInput) => {
    const res = await fetch(`${materialClientService.routes.updateMaterial(undefined)}/${data.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || "Failed to update material")
    }
    return res.json()
  },
  deleteMaterial: async (id: string) => {
    const res = await fetch(`${materialClientService.routes.deleteMaterial(id)}`, {
      method: "DELETE",
    })
    if (!res.ok) throw new Error("Failed to delete material")
    return res.json()
  },
}
