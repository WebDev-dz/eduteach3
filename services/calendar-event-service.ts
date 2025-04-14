"use client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { CalendarEventService } from "@/types/services"
import type { CalendarEventCreateInput, CalendarEventUpdateInput } from "@/types/entities"
import { parse, build, omit, keep,  } from 'search-params'
import { toUrl } from "@/lib/utils"
export const calendarEventKeys = {
  all: ["calendarEvents"] as const,
  lists: () => [...calendarEventKeys.all, "list"] as const,
  list: (filters: Record<string, any>) => [...calendarEventKeys.lists(), filters] as const,
  details: () => [...calendarEventKeys.all, "detail"] as const,
  detail: (id: string) => [...calendarEventKeys.details(), id] as const,
  class: (classId: string) => [...calendarEventKeys.all, "class", classId] as const,
}

export function useCalendarEvents(teacherId: string | undefined, startDate?: Date, endDate?: Date) {
  return useQuery({
    queryKey: calendarEventKeys.list({ teacherId, startDate, endDate }),
    queryFn: () =>
      teacherId ? calendarEventClientService.fetchCalendarEvents(teacherId, startDate, endDate) : Promise.resolve([]),
    enabled: !!teacherId,
  })
}

export function useCalendarEvent(id: string) {
  return useQuery({
    queryKey: calendarEventKeys.detail(id),
    queryFn: () => calendarEventClientService.fetchCalendarEventById(id),
    enabled: !!id,
  })
}

export function useCalendarEventsByClass(classId: string) {
  return useQuery({
    queryKey: calendarEventKeys.class(classId),
    queryFn: () => calendarEventClientService.fetchCalendarEventsByClass(classId),
    enabled: !!classId,
  })
}

export function useCreateCalendarEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: calendarEventClientService.createCalendarEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarEventKeys.lists() })
      toast.success("Calendar event created successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useUpdateCalendarEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: calendarEventClientService.updateCalendarEvent,
    onSuccess: (data, variables) => {
      // Update the individual event cache
      queryClient.setQueryData(calendarEventKeys.detail(variables.id), data);

      // Update the event list cache (if applicable)
      queryClient.setQueryData(calendarEventKeys.lists(), (oldList) => {
        if (!oldList) return oldList;
        return oldList?.map((event) =>
          event.id === variables.id ? data : event
        );
      });

      toast.success("Calendar event updated successfully");
      return data;
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteCalendarEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: calendarEventClientService.deleteCalendarEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarEventKeys.lists() })
      toast.success("Calendar event deleted successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const calendarEventClientService: CalendarEventService = {
  baseRoute: "/api/calendar-events",
  routes: {
    fetchCalendarEvents: (teacherId: string, startDate?: Date, endDate?: Date) => {
      const params = {teacherId, startDate: startDate?.toISOString(), endDate: endDate?.toISOString()}
      return toUrl(calendarEventClientService.baseRoute, params)
    },
    fetchCalendarEventById: (id: string) => {
      return toUrl(`${calendarEventClientService.baseRoute}/${id}`)
    },
    fetchCalendarEventsByClass: (classId: string) => {
      const params = {classId}
      return toUrl(calendarEventClientService.baseRoute, params)
    },
    createCalendarEvent: () => calendarEventClientService.baseRoute,
    updateCalendarEvent: (id: string) => toUrl(`${calendarEventClientService.baseRoute}/${id}`),
    deleteCalendarEvent: (id: string) => toUrl(`${calendarEventClientService.baseRoute}/${id}`),
  },
  fetchCalendarEvents: async (teacherId: string, startDate?: Date, endDate?: Date) => {
    const url = calendarEventClientService.routes.fetchCalendarEvents(teacherId, startDate, endDate)
    const res = await fetch(url)
    if (!res.ok) throw new Error("Failed to fetch calendar events")
    return res.json()
  },
  fetchCalendarEventById: async (id: string) => {
    const res = await fetch(calendarEventClientService.routes.fetchCalendarEventById(id))
    if (!res.ok) throw new Error("Failed to fetch calendar event")
    return res.json()
  },
  fetchCalendarEventsByClass: async (classId: string) => {
    const res = await fetch(calendarEventClientService.routes.fetchCalendarEventsByClass(classId))
    if (!res.ok) throw new Error("Failed to fetch calendar events by class")
    return res.json()
  },
  createCalendarEvent: async (data: CalendarEventCreateInput) => {
    const res = await fetch(calendarEventClientService.routes.createCalendarEvent(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || "Failed to create calendar event")
    }
    return res.json()
  },
  updateCalendarEvent: async (data: CalendarEventUpdateInput) => {
    const res = await fetch(calendarEventClientService.routes.updateCalendarEvent(data.id), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || "Failed to update calendar event")
    }
    return res.json()
  },
  deleteCalendarEvent: async (id: string) => {
    const res = await fetch(calendarEventClientService.routes.deleteCalendarEvent(id), {
      method: "DELETE",
    })
    if (!res.ok) throw new Error("Failed to delete calendar event")
    return res.json()
  },
}
