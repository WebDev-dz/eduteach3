// @/services/student-service
"use client"

import { URL } from 'url'

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { StudentService } from "@/types/services"
import { Student, StudentCreateInput, StudentUpdateInput } from "@/types/entities"
import { toUrl } from '@/lib/utils'
import { fileExportService } from './import-export-service'

export const studentKeys = {
  all: ["students"] as const,
  lists: () => [...studentKeys.all, "list"] as const,
  list: (filters: Record<string, any>) => [...studentKeys.lists(), filters] as const,
  details: () => [...studentKeys.all, "detail"] as const,
  detail: (id: string) => [...studentKeys.details(), id] as const,
  class: (classId: string) => [...studentKeys.all, "class", classId] as const,
}

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
      queryClient.invalidateQueries({ queryKey: studentKeys.detail(variables.id) })
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
    onSuccess: () => {
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
    fetchStudents: (teacherId: string) => {
      return toUrl(studentClientService.baseRoute, { teacherId })
    },
 
    fetchStudentById: (id: string) => {
      return toUrl(studentClientService.baseRoute, { id })
    },
    fetchStudentsByClass: (classId: string) => {
      return toUrl(studentClientService.baseRoute, { classId })
    },
    createStudent: () => toUrl(studentClientService.baseRoute),
    updateStudent: (id: string) => toUrl(`${studentClientService.baseRoute}/${id}`),
    deleteStudent: (id: string) => toUrl(`${studentClientService.baseRoute}/${id}`),
  },
  fetchStudents: async (teacherId: string) => {
    const res = await fetch(studentClientService.routes.fetchStudents(teacherId))
    if (!res.ok) throw new Error("Failed to fetch students")
    return res.json()
  },
  fetchStudentById: async (id: string) => {
    const res = await fetch(studentClientService.routes.fetchStudentById(id))
    if (!res.ok) throw new Error("Failed to fetch student")
    return res.json()
  },
  fetchStudentsByClass: async (classId: string) => {
    const res = await fetch(studentClientService.routes.fetchStudentsByClass(classId))
    if (!res.ok) throw new Error("Failed to fetch students by class")
    return res.json()
  },
  createStudent: async (data: StudentCreateInput) => {
    const res = await fetch(studentClientService.routes.createStudent(undefined), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || "Failed to create student")
    }
    return res.json()
  },
  updateStudent: async (data: StudentUpdateInput) => {
    const res = await fetch(studentClientService.routes.updateStudent(undefined), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || "Failed to update student")
    }
    return res.json()
  },
  deleteStudent: async (id: string) => {
    const res = await fetch(studentClientService.routes.deleteStudent(id), {
      method: "DELETE",
    })
    if (!res.ok) throw new Error("Failed to delete student")
    return res.json()
  },
  exportStudents: async (teacherId: string) => {
    const res = await fetch(studentClientService.routes.fetchStudents(teacherId))
    const data = await res.json()
    if (!res.ok) throw new Error("Failed to export students")
    return fileExportService.toCsv(data, ["id", "name", "email", "classId"])
  },
  importStudents: async (
    file: File,
    options: { format: "csv" | "excel" }
  ) => {
    switch (options.format) {
      case "csv":
        return fileExportService.fromCsv<Student>(file)
      case "excel":
        return fileExportService.fromExcel<Student>(file)
      default:
        throw new Error("Invalid format")
    }
  },
} 


