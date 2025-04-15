"use client";

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/shared/app-sidebar"
import { SiteHeader } from "@/components/shared/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { calendarEventInsertSchema } from "@/lib/validation/insert";
import { Form, FormField } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { SiteHeader } from "@/components/shared/site-header";
import {
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  ClockIcon,
  UsersIcon,
  ClipboardListIcon,
  GraduationCapIcon,
  FileTextIcon,
} from "lucide-react"

export default function CalendarPage() {
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"month" | "week" | "day">("month")
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [newEventDate, setNewEventDate] = useState<Date | undefined>(new Date())
  const [eventFilters, setEventFilters] = useState({
    classes: true,
    assignments: true,
    exams: true,
    meetings: true,
    personal: true,
  })

  const handlePrevious = () => {
    if (view === "month") {
      setCurrentDate(subMonths(currentDate, 1))
    } else if (view === "week") {
      setCurrentDate(subWeeks(currentDate, 1))
    } else if (view === "day") {
      setCurrentDate(addDays(currentDate, -1))
    }
  }

  const handleNext = () => {
    if (view === "month") {
      setCurrentDate(addMonths(currentDate, 1))
    } else if (view === "week") {
      setCurrentDate(addWeeks(currentDate, 1))
    } else if (view === "day") {
      setCurrentDate(addDays(currentDate, 1))
    }
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const filteredEvents = events.filter((event) => {
    if (event.type === "class" && !eventFilters.classes) return false
    if (event.type === "assignment" && !eventFilters.assignments) return false
    if (event.type === "exam" && !eventFilters.exams) return false
    if (event.type === "meeting" && !eventFilters.meetings) return false
    if (event.type === "personal" && !eventFilters.personal) return false
    return true
  })

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event)
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "class":
        return "bg-blue-500"
      case "assignment":
        return "bg-green-500"
      case "exam":
        return "bg-red-500"
      case "meeting":
        return "bg-purple-500"
      case "personal":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "class":
        return <GraduationCapIcon className="h-4 w-4" />
      case "assignment":
        return <ClipboardListIcon className="h-4 w-4" />
      case "exam":
        return <FileTextIcon className="h-4 w-4" />
      case "meeting":
        return <UsersIcon className="h-4 w-4" />
      case "personal":
        return <CalendarIcon className="h-4 w-4" />
      default:
        return <CalendarIcon className="h-4 w-4" />
    }
  }

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const days = eachDayOfInterval({ start: startDate, end: endDate })

    return (
      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-medium py-2">
            {day}
          </div>
        ))}
        {days.map((day, i) => {
          const dayEvents = filteredEvents.filter((event) => isSameDay(parseISO(event.date), day))

          return (
            <div
              key={i}
              className={cn(
                "min-h-[100px] p-1 border rounded-md",
                !isSameMonth(day, monthStart) && "bg-muted/50 text-muted-foreground",
                isSameDay(day, new Date()) && "bg-accent/50",
              )}
              onClick={() => {
                setNewEventDate(day)
                setIsAddEventOpen(true)
              }}
            >
              <div className="font-medium text-right p-1">{format(day, "d")}</div>
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event, eventIndex) => (
                  <div
                    key={eventIndex}
                    className={cn(
                      "text-xs px-2 py-1 rounded-md truncate cursor-pointer text-white",
                      getEventTypeColor(event.type),
                    )}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEventClick(event)
                    }}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-center text-muted-foreground">+{dayEvents.length - 3} more</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate)
    const weekEnd = endOfWeek(currentDate)
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd })

    return (
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, i) => (
          <div key={i} className="flex flex-col">
            <div className={cn("text-center font-medium py-2", isSameDay(day, new Date()) && "bg-accent rounded-md")}>
              <div>{format(day, "EEE")}</div>
              <div>{format(day, "d")}</div>
            </div>
            <div className="flex-1 space-y-1 mt-2">
              {filteredEvents
                .filter((event) => isSameDay(parseISO(event.date), day))
                .map((event, eventIndex) => (
                  <div
                    key={eventIndex}
                    className={cn(
                      "text-sm px-2 py-1 rounded-md cursor-pointer text-white",
                      getEventTypeColor(event.type),
                    )}
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="font-medium truncate">{event.title}</div>
                    <div className="text-xs">{format(parseISO(event.date), "h:mm a")}</div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderDayView = () => {
    const hours = Array.from({ length: 14 }, (_, i) => i + 7) // 7 AM to 8 PM

    return (
      <div className="flex flex-col space-y-2">
        <div className="text-center font-medium py-2">
          <div className="text-lg">{format(currentDate, "EEEE")}</div>
          <div className={cn("inline-block px-2 py-1 rounded-md", isSameDay(currentDate, new Date()) && "bg-accent")}>
            {format(currentDate, "MMMM d, yyyy")}
          </div>
        </div>
        <div className="grid grid-cols-[100px_1fr] gap-2">
          {hours.map((hour) => {
            const hourEvents = filteredEvents.filter((event) => {
              const eventDate = parseISO(event.date)
              return isSameDay(eventDate, currentDate) && eventDate.getHours() === hour
            })

            return (
              <React.Fragment key={hour}>
                <div className="text-right pr-2 py-2 text-muted-foreground">
                  {hour === 12 ? "12 PM" : hour < 12 ? `${hour} AM` : `${hour - 12} PM`}
                </div>
                <div
                  className="border-t min-h-[60px] relative"
                  onClick={() => {
                    const newDate = new Date(currentDate)
                    newDate.setHours(hour, 0, 0, 0)
                    setNewEventDate(newDate)
                    setIsAddEventOpen(true)
                  }}
                >
                  {hourEvents.map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className={cn(
                        "absolute left-0 right-0 m-1 px-2 py-1 rounded-md cursor-pointer text-white",
                        getEventTypeColor(event.type),
                      )}
                      style={{ top: `${eventIndex * 20}px` }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEventClick(event)
                      }}
                    >
                      <div className="font-medium">{event.title}</div>
                      <div className="text-xs">{format(parseISO(event.date), "h:mm a")}</div>
                    </div>
                  ))}
                </div>
              </React.Fragment>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Calendar" />
        <div className="flex flex-1 flex-col p-4 md:p-6 gap-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Calendar</h1>
              <p className="text-muted-foreground">Manage your schedule and events</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setIsAddEventOpen(true)}>
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Event
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-64 space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <Calendar
                        mode="single"
                        selected={currentDate}
                        onSelect={(date) => date && setCurrentDate(date)}
                        className="rounded-md border"
                      />
                    </div>
                    <Button variant="outline" className="w-full" onClick={handleToday}>
                      Today
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <h3 className="font-medium">Filters</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="filter-classes"
                          checked={eventFilters.classes}
                          onCheckedChange={(checked) => setEventFilters({ ...eventFilters, classes: checked === true })}
                        />
                        <Label htmlFor="filter-classes" className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                          Classes
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="filter-assignments"
                          checked={eventFilters.assignments}
                          onCheckedChange={(checked) =>
                            setEventFilters({ ...eventFilters, assignments: checked === true })
                          }
                        />
                        <Label htmlFor="filter-assignments" className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                          Assignments
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="filter-exams"
                          checked={eventFilters.exams}
                          onCheckedChange={(checked) => setEventFilters({ ...eventFilters, exams: checked === true })}
                        />
                        <Label htmlFor="filter-exams" className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                          Exams
                        </Label>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="col-span-3 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                            <SelectValue placeholder="Select event type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="class">Class</SelectItem>
                            <SelectItem value="assignment">
                              Assignment
                            </SelectItem>
                            <SelectItem value="exam">Exam</SelectItem>
                            <SelectItem value="meeting">Meeting</SelectItem>
                            <SelectItem value="personal">Personal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="visibility"
                    render={({ field }) => (
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="visibility"
                          className="text-right font-medium text-gray-700"
                        >
                          Visibility
                        </Label>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="col-span-3 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                            <SelectValue placeholder="Select visibility" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="private">Private</SelectItem>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="organization">
                              Organization
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="filter-personal"
                          checked={eventFilters.personal}
                          onCheckedChange={(checked) =>
                            setEventFilters({ ...eventFilters, personal: checked === true })
                          }
                        />
                        <Label htmlFor="filter-personal" className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                          Personal
                        </Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <h3 className="font-medium">Upcoming Events</h3>
                    <div className="space-y-2">
                      {events
                        .filter((event) => new Date(event.date) > new Date())
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        .slice(0, 5)
                        .map((event, index) => (
                          <div
                            key={index}
                            className="p-2 border rounded-md cursor-pointer hover:bg-accent"
                            onClick={() => handleEventClick(event)}
                          >
                            <div className="flex items-center gap-2">
                              <div className={cn("w-2 h-2 rounded-full", getEventTypeColor(event.type))}></div>
                              <div className="font-medium truncate">{event.title}</div>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {format(parseISO(event.date), "MMM d, h:mm a")}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex-1">
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={handlePrevious}>
                          <ChevronLeftIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={handleNext}>
                          <ChevronRightIcon className="h-4 w-4" />
                        </Button>
                        <h2 className="text-xl font-semibold">
                          {view === "month" && format(currentDate, "MMMM yyyy")}
                          {view === "week" &&
                            `Week of ${format(startOfWeek(currentDate), "MMM d")} - ${format(endOfWeek(currentDate), "MMM d, yyyy")}`}
                          {view === "day" && format(currentDate, "MMMM d, yyyy")}
                        </h2>
                      </div>
                      <div className="flex items-center gap-2">
                        <Tabs value={view} onValueChange={(v) => setView(v as "month" | "week" | "day")}>
                          <TabsList>
                            <TabsTrigger value="month">Month</TabsTrigger>
                            <TabsTrigger value="week">Week</TabsTrigger>
                            <TabsTrigger value="day">Day</TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </div>
                    </div>

                    <div className="overflow-auto">
                      {view === "month" && renderMonthView()}
                      {view === "week" && renderWeekView()}
                      {view === "day" && renderDayView()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Event Details Dialog */}
          <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <div
                    className={cn("w-3 h-3 rounded-full", selectedEvent && getEventTypeColor(selectedEvent.type))}
                  ></div>
                  {selectedEvent?.title}
                </DialogTitle>
                <DialogDescription>
                  {selectedEvent && format(parseISO(selectedEvent.date), "EEEE, MMMM d, yyyy")}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-2">
                  <ClockIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedEvent && format(parseISO(selectedEvent.date), "h:mm a")}</span>
                </div>
                {selectedEvent?.location && (
                  <div className="flex items-center gap-2">
                    <UsersIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedEvent.location}</span>
                  </div>
                )}
                {selectedEvent?.description && (
                  <div className="pt-2">
                    <h4 className="text-sm font-medium mb-1">Description</h4>
                    <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
                  </div>
                )}
              </div>
              <DialogFooter className="flex gap-2">
                <Button variant="outline" onClick={() => setSelectedEvent(null)}>
                  Close
                </Button>
                <Button variant="default">Edit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Add Event Dialog */}
          <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
                <DialogDescription>Create a new event in your calendar</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="event-title">Event Title</Label>
                  <Input id="event-title" placeholder="Enter event title" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event-date">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newEventDate ? format(newEventDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={newEventDate} onSelect={setNewEventDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-time">Time</Label>
                    <Select defaultValue="09:00">
                      <SelectTrigger id="event-time">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 * 4 }, (_, i) => {
                          const hour = Math.floor(i / 4)
                          const minute = (i % 4) * 15
                          const formattedHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
                          const period = hour >= 12 ? "PM" : "AM"
                          return `${formattedHour}:${minute.toString().padStart(2, "0")} ${period}`
                        }).map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event-type">Event Type</Label>
                  <Select defaultValue="class">
                    <SelectTrigger id="event-type">
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="class">Class</SelectItem>
                      <SelectItem value="assignment">Assignment</SelectItem>
                      <SelectItem value="exam">Exam</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event-location">Location (Optional)</Label>
                  <Input id="event-location" placeholder="Enter location" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event-description">Description (Optional)</Label>
                  <Textarea id="event-description" placeholder="Enter event description" rows={3} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddEventOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveEvent}
                  className="bg-blue-600 hover:bg-blue-700 transition-colors"
                  disabled={isLoadingCreate || isLoadingUpdate}
                >
                  {isLoadingCreate || isLoadingUpdate ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Save Event
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}