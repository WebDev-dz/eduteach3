import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth/auth"
import { checkRequests } from "@/lib/utils"
import { calendarEventInsertSchema } from "@/lib/validation/insert"
import { getCalendarEventsByClass, getCalendarEvents, createCalendarEvent } from "@/lib/db/dal/calendar-events"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const classId = searchParams.get("classId")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    if (classId) {
      const events = await getCalendarEventsByClass(classId)
      return NextResponse.json(events)
    } else {
      const events = await getCalendarEvents({
        teacherId: user.id,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined
      })
      return NextResponse.json(events)
    }
  } catch (error) {
    console.error("Error fetching calendar events:", error)
    return NextResponse.json({ error: "Failed to fetch calendar events" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Ensure the teacherId matches the authenticated user
    if (data.teacherId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { success, data: event, error } = checkRequests(data, calendarEventInsertSchema)
    console.log({success, event, error})
    if (!success) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    const result = await createCalendarEvent(event)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error creating calendar event:", error)
    return NextResponse.json({ error: "Failed to create calendar event" }, { status: 500 })
  }
}
