// @/services/class-service
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  ClassService,
} from "@/types/services"
import { Class, ClassCreateInput, ClassUpdateInput } from "@/types/entities"
import { toUrl } from "@/lib/utils"
import { fileExportService } from "./import-export-service"


export const classKeys = {
  all: ["classes"] as const,
  lists: () => [...classKeys.all, "list"] as const,
  list: (filters: Record<string, any>) => [...classKeys.lists(), filters] as const,
  details: () => [...classKeys.all, "detail"] as const,
  detail: (id: string) => [...classKeys.details(), id] as const,
  students: (classId: string) => [...classKeys.all, "students", classId] as const,
}

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
    queryKey: classKeys.students(classId),
    queryFn: () => classClientService.fetchStudentsInClass(classId),
    enabled: !!classId,
  })
}

export function useCreateClass() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: classClientService.createClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classKeys.lists() })
      toast.success("Class created successfully")
    },
    onError: (error: Error) => toast.error(error.message),
  })
}

export function useUpdateClass() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: classClientService.updateClass,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: classKeys.detail(variables.id) })
      toast.success("Class updated successfully")
    },
    onError: (error: Error) => toast.error(error.message),
  })
}

export function useDeleteClass() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: classClientService.deleteClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classKeys.lists() })
      toast.success("Class deleted successfully")
    },
    onError: (error: Error) => toast.error(error.message),
  })
}

export function useAddStudentToClass() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: classClientService.addStudentToClass,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: classKeys.students(variables.classId) })
      toast.success("Student added to class")
    },
    onError: (error: Error) => toast.error(error.message),
  })
}

export function useRemoveStudentFromClass() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: classClientService.removeStudentFromClass,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: classKeys.students(variables.classId) })
      toast.success("Student removed from class")
    },
    onError: (error: Error) => toast.error(error.message),
  })
}

export const classClientService: ClassService = {
  baseRoute: "/api/classes",
  routes: {
    fetchClasses: (teacherId: string) => {
      return toUrl(classClientService.baseRoute, { teacherId })
    },
    fetchClassById: (id: string) => {
      return toUrl(`${classClientService.baseRoute}/${id}`)
    },
    fetchStudentsInClass: (classId: string) => {
      const params = { classId, students: "true" }
      return toUrl(classClientService.baseRoute, params)
    },
    createClass: () => toUrl(classClientService.baseRoute),
    updateClass: () => toUrl(classClientService.baseRoute),
    deleteClass: (id: string) => {
      const params = { id }
      return toUrl(classClientService.baseRoute, params)
    },
    addStudentToClass: ({ classId, studentId }) => {
      const params = { classId, studentId }
      return toUrl(`${classClientService.baseRoute}/add-student`, params)
    },
    removeStudentFromClass: ({ classId, studentId }) => {
      const params = { classId, studentId }
      return toUrl(`${classClientService.baseRoute}/`, params)
    },
  },
  fetchClasses: async (teacherId: string) => {
    const res = await fetch(classClientService.routes.fetchClasses(teacherId))
    if (!res.ok) throw new Error("Failed to fetch classes")
    return res.json()
  },
  fetchClassById: async (id: string) => {
    const res = await fetch(classClientService.routes.fetchClassById(id))
    if (!res.ok) throw new Error("Failed to fetch class")
    return res.json()
  },
  fetchStudentsInClass: async (classId: string) => {
    const res = await fetch(classClientService.routes.fetchStudentsInClass(classId))
    if (!res.ok) throw new Error("Failed to fetch students in class")
    return res.json()
  },
  createClass: async (data: ClassCreateInput) => {
    const res = await fetch(classClientService.routes.createClass(undefined), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || "Failed to create class")
    }
    return res.json()
  },
  updateClass: async (data: ClassUpdateInput) => {
    const res = await fetch(`${classClientService.routes.updateClass(undefined)}/${data.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || "Failed to update class")
    }
    return res.json()
  },
  deleteClass: async (id: string) => {
    const res = await fetch(classClientService.routes.deleteClass(id), {
      method: "DELETE" })
    if (!res.ok) throw new Error("Failed to delete class")
    return res.json()
  },
  addStudentToClass: async (params: { classId: string; studentId: string }) => {
    const res = await fetch(classClientService.routes.addStudentToClass(params), {
      method: "POST",
    })
    if (!res.ok) throw new Error("Failed to add student to class")
    return res.json()
  },
  removeStudentFromClass: async (params: { classId: string; studentId: string }) => {
    const res = await fetch(classClientService.routes.removeStudentFromClass(params), {
      method: "DELETE",
    })
    if (!res.ok) throw new Error("Failed to remove student from class")
    return res.json()
  },
  exportClasses: async (data: Class[], format) => {
    switch (format) {
      case "csv":
        return fileExportService.toCsv<Class>(data)
      case "excel":
        return fileExportService.toExcel<Class>(data)
      default:
        throw new Error("Invalid format")
    }
  },
  importClasses: async (file: File, { format }: { format: "csv" | "excel" }) => {
    switch (format) {
      case "csv":
        return fileExportService.fromCsv<Class>(file)
      case "excel":
        return fileExportService.fromExcel<Class>(file)
      default:
        throw new Error("Invalid format")
    }
  },
}
