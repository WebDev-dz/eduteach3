// calendar-events.ts

import { db } from "@/lib/db"
import { calendarEvents, classes, assignments, lessonPlans } from "@/lib/db/schema"
import { eq, and, gte, lte, getTableColumns } from "drizzle-orm"
import { v4 as uuidv4 } from "uuid"
import type { CalendarEventCreateInput, CalendarEventUpdateInput } from "@/types/entities"
import { CalendarEventServerService, CalendarEventService } from "@/types/services"

// Server Service
const calendarEventService: CalendarEventServerService = {
  fetchCalendarEvents: async (teacherId: string, startDate?: Date, endDate?: Date) => {
    const columns = getTableColumns(calendarEvents)
    try {
      let query = db
        .select({
          ...columns,
          className: classes.name,
          assignmentTitle: assignments.title,
          lessonPlanTitle: lessonPlans.title,
        })
        .from(calendarEvents)
        .leftJoin(classes, eq(calendarEvents.classId, classes.id))
        .leftJoin(assignments, eq(calendarEvents.assignmentId, assignments.id))
        .leftJoin(lessonPlans, eq(calendarEvents.lessonPlanId, lessonPlans.id))
        .where(eq(calendarEvents.teacherId, teacherId)).$dynamic()

      // Add date range filter if provided
      if (startDate && endDate) {
        
        query = query.where(and(gte(calendarEvents.startDate, startDate), lte(calendarEvents.endDate, endDate)))
      }

      const result = await query

      return result
    } catch (error) {
      console.error("Error fetching calendar events:", error)
      throw new Error("Failed to fetch calendar events")
    }
  },

  fetchCalendarEventById: async (id: string) => {
    const columns = getTableColumns(calendarEvents)
    try {
      const [event] = await db
        .select({
          ...columns,
          className: classes.name,
          assignmentTitle: assignments.title,
          lessonPlanTitle: lessonPlans.title,
        })
        .from(calendarEvents)
        .leftJoin(classes, eq(calendarEvents.classId, classes.id))
        .leftJoin(assignments, eq(calendarEvents.assignmentId, assignments.id))
        .leftJoin(lessonPlans, eq(calendarEvents.lessonPlanId, lessonPlans.id))
        .where(eq(calendarEvents.id, id))

      if (!event) {
        throw new Error("Calendar event not found")
      }

      return event
    } catch (error) {
      console.error("Error fetching calendar event:", error)
      throw new Error("Failed to fetch calendar event")
    }
  },

  fetchCalendarEventsByClass: async (classId: string) => {
    try {
      const result = await db
        .select()
        .from(calendarEvents)
        .where(eq(calendarEvents.classId, classId))

      return result
    } catch (error) {
      console.error("Error fetching calendar events by class:", error)
      throw new Error("Failed to fetch calendar events for class")
    }
  },

  createCalendarEvent: async (data: CalendarEventCreateInput) => {
    try {
      const id = uuidv4()
      const calendarEvent = {...data}

      await db.insert(calendarEvents).values(calendarEvent)

      return { id }
    } catch (error) {
      console.error("Error creating calendar event:", error)
      throw new Error("Failed to create calendar event")
    }
  },

  updateCalendarEvent: async (data: CalendarEventUpdateInput) => {
    try {
      const { id, teacherId, ...updateData } = data

      // Handle date conversion if dates are provided
      const processedData = { ...updateData }
      if (updateData.startDate) {
        processedData.startDate = new Date(updateData.startDate)
      }
      if (updateData.endDate) {
        processedData.endDate = new Date(updateData.endDate)
      }

      const updatedEvents = await db
        .update(calendarEvents)
        .set({
          ...processedData,
          updatedAt: new Date(),
        })
        .where(and(eq(calendarEvents.id, id), eq(calendarEvents.teacherId, teacherId)))
        .returning()

      return updatedEvents
    } catch (error) {
      console.error("Error updating calendar event:", error)
      throw new Error("Failed to update calendar event")
    }
  },

  deleteCalendarEvent: async (id: string) => {
    try {
      await db.delete(calendarEvents).where(and(eq(calendarEvents.id, id)))

      return { success: true }
    } catch (error) {
      console.error("Error deleting calendar event:", error)
      throw new Error("Failed to delete calendar event")
    }
  },
}


export const getCalendarEvents = calendarEventService.fetchCalendarEvents
export const getCalendarEventById = calendarEventService.fetchCalendarEventById
export const getCalendarEventsByClass = calendarEventService.fetchCalendarEventsByClass
export const createCalendarEvent = calendarEventService.createCalendarEvent
export const updateCalendarEvent = calendarEventService.updateCalendarEvent
export const deleteCalendarEvent = calendarEventService.deleteCalendarEvent

