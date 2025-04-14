// @/services/user-service
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { User, UserCreateInput, UserUpdateInput, UserService } from "@/types/services"
import { toUrl } from "@/lib/utils"

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: () => [...userKeys.lists()] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
}

export function useUsers() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: userClientService.fetchUsers,
    onSuccess: () => {
      toast.success("Fetched users successfully")
    },
    onError: (error: Error) => toast.error(error.message),
  })
}

export function useUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: userClientService.fetchUserById,
    onSuccess: () => {
      toast.success("Fetched user successfully")
    },
    onError: (error: Error) => toast.error(error.message),
  })
}

export function useSignup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: userClientService.signup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      toast.success("User signed up successfully")
    },
    onError: (error: Error) => toast.error(error.message),
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: userClientService.updateUser,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id!) })
      toast.success("User updated successfully")
    },
    onError: (error: Error) => toast.error(error.message),
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: userClientService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      toast.success("User deleted successfully")
    },
    onError: (error: Error) => toast.error(error.message),
  })
}

export const userClientService: UserService = {
  baseRoute: "/api/auth",
  routes: {
    fetchUsers: () => toUrl(userClientService.baseRoute),
    fetchUserById: (id: string) => toUrl(userClientService.baseRoute, { id }),
    signup: () => toUrl(`${userClientService.baseRoute}/register`),
    updateUser: (id: string) => toUrl(userClientService.baseRoute, { id }),
    deleteUser: (id: string) => toUrl(userClientService.baseRoute, { id }),
  },
  fetchUsers: async () => {
    const res = await fetch(userClientService.routes.fetchUsers())
    if (!res.ok) throw new Error("Failed to fetch users")
    return res.json()
  },
  fetchUserById: async (id: string) => {
    const res = await fetch(userClientService.routes.fetchUserById(id))
    if (!res.ok) throw new Error("Failed to fetch user")
    return res.json()
  },
  signup: async (data: UserCreateInput) => {
    const res = await fetch(userClientService.routes.signup(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || "Failed to signup")
    }
    return res.json()
  },
  updateUser: async (data: UserUpdateInput) => {
    const res = await fetch(userClientService.routes.updateUser(data.id!), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || "Failed to update user")
    }
    return res.json()
  },
  deleteUser: async (id: string) => {
    const res = await fetch(userClientService.routes.deleteUser(id), {
      method: "DELETE",
    })
    if (!res.ok) throw new Error("Failed to delete user")
    return res.json()
  },
}
