import { type NextRequest, NextResponse } from "next/server"
import {  deleteCalendarEvent, getCalendarEventById, updateCalendarEvent } from "@/lib/db/dal/calendar-events"
import { getCurrentUser } from "@/lib/auth/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const eventId = params.id
    const event = await getCalendarEventById(eventId)

    if (event.teacherId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error("Error fetching calendar event:", error)
    return NextResponse.json({ error: "Failed to fetch calendar event" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { id:eventId } = await params
    const data = await request.json()

    // Ensure the teacherId matches the authenticated user
    if (data.teacherId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Ensure the event ID in the URL matches the one in the request body
    if (data.id !== eventId) {
      return NextResponse.json({ error: "Event ID mismatch" }, { status: 400 })
    }

    const result = await updateCalendarEvent(data)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error updating calendar event:", error)
    return NextResponse.json({ error: "Failed to update calendar event" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const eventId = params.id
    const result = await deleteCalendarEvent(eventId)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error deleting calendar event:", error)
    return NextResponse.json({ error: "Failed to delete calendar event" }, { status: 500 })
  }
}
