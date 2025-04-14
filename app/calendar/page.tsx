"use client";

import { useState, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { CalendarEvent } from "@/types/entities";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { SiteHeader } from "@/components/site-header";
import {
  useUpdateCalendarEvent,
  useCreateCalendarEvent,
  useCalendarEvents,
  useCalendarEventsByClass,
  useDeleteCalendarEvent,
} from "@/services/calendar-event-service";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { v4 as uuidv4 } from "uuid";

const localizer = momentLocalizer(moment);

// Initialize drag-and-drop calendar
const DnDCalendar = withDragAndDrop<CalendarEvent>(Calendar);

// Recurrence patterns
const recurrencePatterns = [
  { label: "Daily", value: "FREQ=DAILY" },
  { label: "Weekly", value: "FREQ=WEEKLY" },
  { label: "Every Weekday", value: "FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR" },
  { label: "Every Weekend", value: "FREQ=WEEKLY;BYDAY=SA,SU" },
  { label: "Bi-Weekly", value: "FREQ=WEEKLY;INTERVAL=2" },
  { label: "Monthly", value: "FREQ=MONTHLY" },
  { label: "Yearly", value: "FREQ=YEARLY" },
];

// Reminder options
const reminderTimeOptions = [
  { label: "5 minutes", value: 5 },
  { label: "10 minutes", value: 10 },
  { label: "15 minutes", value: 15 },
  { label: "30 minutes", value: 30 },
  { label: "1 hour", value: 60 },
  { label: "2 hours", value: 120 },
  { label: "1 day", value: 1440 },
  { label: "2 days", value: 2880 },
];

const reminderMethodOptions = [
  { label: "Email", value: "email" },
  { label: "Notification", value: "notification" },
];

// Event type colors for badges
const eventTypeStyles: Record<string, string> = {
  class: "bg-blue-100 text-blue-800",
  assignment: "bg-green-100 text-green-800",
  exam: "bg-red-100 text-red-800",
  meeting: "bg-purple-100 text-purple-800",
  personal: "bg-yellow-100 text-yellow-800",
};

interface DraggableEvent {
  id: string;
  title: string;
  type: "class" | "assignment" | "exam" | "meeting" | "personal";
  color: string;
  duration: number; // Duration in minutes
}

const initialDraggableEvents: DraggableEvent[] = [
  { id: uuidv4(), title: "Class", type: "class", color: "#3B82F6", duration: 60 },
  {
    id: uuidv4(),
    title: "Assignment",
    type: "assignment",
    color: "#10B981",
    duration: 90,
  },
  { id: uuidv4(), title: "Exam", type: "exam", color: "#EF4444", duration: 120 },
  {
    id: uuidv4(),
    title: "Meeting",
    type: "meeting",
    color: "#A855F7",
    duration: 45,
  },
  {
    id: uuidv4(),
    title: "Personal",
    type: "personal",
    color: "#F59E0B",
    duration: 30,
  },
];

export default function CalendarPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // State for selected class filter
  const [selectedClassType, setSelectedClassType] = useState<
    "class" | "assignment" | "exam" | "meeting" | "personal" | null
  >(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [draggableEvents, setDraggableEvents] = useState<DraggableEvent[]>(
    initialDraggableEvents
  );
  const draggedEvent = useRef<DraggableEvent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNewEvent, setIsNewEvent] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  // Fetch events (all or filtered by class)
  const {
    data: allEvents,
    isLoading: isLoadingAll,
    error: errorAll,
  } = useCalendarEvents(userId);
  const {
    data: classEvents,
    isPending: isLoadingClass,
    error: errorClass,
  } = useCalendarEventsByClass(selectedClassType!);

  const { mutate: createEvent, isPending: isLoadingCreate } =
    useCreateCalendarEvent();
  const { mutate: updateEvent, isPending: isLoadingUpdate } =
    useUpdateCalendarEvent();
  const { mutate: deleteEvent, isPending: isLoadingDelete } =
    useDeleteCalendarEvent();


  // Use filtered events if a class type is selected, otherwise use all events
  const events = selectedClassType ? classEvents : allEvents;

  const form = useForm<z.infer<typeof calendarEventInsertSchema>>({
    resolver: zodResolver(calendarEventInsertSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(),
      allDay: false,
      location: "",
      type: "class",
      color: "#3B82F6",
      isRecurring: false,
      recurrenceRule: "",
      visibility: "private",
      reminders: [],
    },
  });

  const handleSelectSlot = useCallback(
    ({ start, end }: { start: Date; end: Date }) => {
      setIsNewEvent(true);
      form.reset({
        title: "",
        description: "",
        startDate: start,
        endDate: end,
        allDay: false,
        location: "",
        type: selectedClassType || "class", // Preselect based on filter
        color: "#3B82F6",
        isRecurring: false,
        recurrenceRule: "",
        visibility: "private",
        reminders: [],
      });
      setActiveTab("details");
      setIsDialogOpen(true);
    },
    [form, selectedClassType]
  );

  const handleSelectEvent = useCallback(
    (event: CalendarEvent) => {
      setIsNewEvent(false);
      setSelectedEvent(event);
      form.reset({
        title: event.title,
        description: event.description || "",
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
        allDay: event.allDay,
        location: event.location || "",
        type: event.type,
        color: event.color || "#3B82F6",
        isRecurring: event.isRecurring || false,
        recurrenceRule: event.recurrenceRule || "",
        visibility: event.visibility || "private",
        reminders: event.reminders || [],
      });
      setActiveTab("details");
      setIsDialogOpen(true);
    },
    [form]
  );

  const handleEventDrop = useCallback(
    ({
      event,
      start,
      end,
    }: {
      event: CalendarEvent;
      start: Date;
      end: Date;
    }) => {
      if (!userId) return;
      updateEvent({
        id: event.id,
        startDate: start,
        endDate: end,
        teacherId: userId,
      });
    },
    [updateEvent, userId]
  );

  const handleEventResize = useCallback(
    ({
      event,
      start,
      end,
    }: {
      event: CalendarEvent;
      start: Date;
      end: Date;
    }) => {
      if (!userId) return;
      updateEvent({
        id: event.id,
        startDate: start,
        endDate: end,
        teacherId: userId,
      });
    },
    [updateEvent, userId]
  );

  const handleSaveEvent = () => {
    if (!userId) return;
    const values = form.getValues();

    if (isNewEvent) {
      createEvent({
        ...values,
        startDate: new Date(values.startDate),
        endDate: new Date(values.endDate),
        teacherId: userId,
      });
    } else if (selectedEvent) {
      updateEvent({
        id: selectedEvent.id,
        ...values,
        startDate: new Date(values.startDate),
        endDate: new Date(values.endDate),
        teacherId: userId,
      });
    }

    setIsDialogOpen(false);
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      deleteEvent(selectedEvent.id);
      setIsDialogOpen(false);
    }
  };

  const addReminder = () => {
    const currentReminders = form.getValues().reminders || [];
    form.setValue("reminders", [
      ...currentReminders,
      { time: 15, unit: "minutes", method: "notification" },
    ]);
  };

  const removeReminder = (index: number) => {
    const currentReminders = form.getValues().reminders || [];
    form.setValue(
      "reminders",
      currentReminders?.filter((_, i) => i !== index)
    );
  };

  const updateReminder = (index: number, field: string, value: any) => {
    const currentReminders = form.getValues().reminders || [];
    const newReminders = [...currentReminders];
    newReminders[index] = { ...newReminders[index], [field]: value };
    form.setValue("reminders", newReminders);
  };

  const formatEvents = (events: CalendarEvent[] = []) => {
    return events.map((event) => ({
      ...event,
      start: new Date(event.startDate),
      end: new Date(event.endDate),
      title: event.title,
    }));
  };

  // Handle loading and error states
  if (isLoadingAll || (selectedClassType && isLoadingClass)) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Calendar</h1>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
            <CardDescription>
              Please wait while we load your events.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-center h-[600px]">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (errorAll || (selectedClassType && errorClass)) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Calendar</h1>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Failed to load calendar events.</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {errorAll?.message || errorClass?.message || "An error occurred"}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleDragStart = (event: React.DragEvent, draggableEvent: DraggableEvent) => {
    draggedEvent.current = draggableEvent;
  };

  const handleDrop = (dropDate: Date) => {
    if (draggedEvent.current) {
      const { title, type, color, duration } = draggedEvent.current;
      const end = new Date(dropDate.getTime() + duration * 60000); // Add duration in minutes
      handleSelectSlot({ start: dropDate, end, title, type, color });
      draggedEvent.current = null;
    }
  };

  const duplicateDraggableEvent = (event: DraggableEvent) => {
    setDraggableEvents([...draggableEvents, { ...event, id: uuidv4() }]);
  };

  return (
    <>
      <SiteHeader title="Classes" />
      <div className="flex flex-1 flex-col p-4 md:p-6 gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Calendar</h1>
          <div className="w-48">
            <Select
              value={selectedClassType || ""}
              onValueChange={(value) =>
                setSelectedClassType(
                  value === "all"
                    ? null
                    : (value as "class" | "assignment" | "exam" | "meeting" | "personal")
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="class">Class</SelectItem>
                <SelectItem value="assignment">Assignment</SelectItem>
                <SelectItem value="exam">Exam</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Card className="shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-xl font-semibold text-gray-700">
              Drag and Drop Events
            </CardTitle>
            <CardDescription className="text-gray-500">
              Drag these events onto the calendar to schedule them.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4">
              {draggableEvents.map((event) => (
                <div
                  key={event.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, event)}
                  className={`rounded-lg p-3 cursor-grab shadow-sm border border-gray-200 ${
                    eventTypeStyles[event.type] || "bg-gray-100 text-gray-800"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{event.title}</span>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => duplicateDraggableEvent(event)}
                        className="hover:bg-gray-200 rounded-full"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>






        <Card className="shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-xl font-semibold text-gray-700">
              Your Schedule
            </CardTitle>
            <CardDescription className="text-gray-500">
              Manage your classes, assignments, and events with ease.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[600px] rounded-lg border border-gray-200">
              <DnDCalendar
                localizer={localizer}
                events={formatEvents(events)}
                startAccessor={(event) => new Date(event?.startDate)}
                endAccessor={(event) => new Date(event?.endDate)}
                selectable
                resizable
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                onEventDrop={handleEventDrop}                
                onEventResize={handleEventResize}
                eventPropGetter={(event) => ({
                  style: {
                    backgroundColor: event.color || "#3B82F6",
                    borderRadius: "6px",
                    padding: "4px 8px",
                    fontSize: "14px",
                    color: "#fff",
                    border: "none",
                  },
                  className: "hover:opacity-80 transition-opacity",
                  
                })}
                className="rbc-calendar-custom"
              />
            </div>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl">
            <DialogHeader className="border-b pb-4">
              <DialogTitle className="text-2xl font-semibold text-gray-800">
                {isNewEvent ? "Add New Event" : "Edit Event"}
              </DialogTitle>
              <DialogDescription className="text-gray-500">
                {isNewEvent
                  ? "Create a new event in your calendar"
                  : "Update the details of this event"}
              </DialogDescription>
            </DialogHeader>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 mb-6 bg-gray-100 rounded-lg p-1">
                <TabsTrigger
                  value="details"
                  className={cn(
                    "rounded-md py-2 text-sm font-medium transition-all",
                    activeTab === "details" && "bg-white shadow-sm"
                  )}
                >
                  Details
                </TabsTrigger>
                <TabsTrigger
                  value="recurrence"
                  className={cn(
                    "rounded-md py-2 text-sm font-medium transition-all",
                    activeTab === "recurrence" && "bg-white shadow-sm"
                  )}
                >
                  Recurrence
                </TabsTrigger>
                <TabsTrigger
                  value="reminders"
                  className={cn(
                    "rounded-md py-2 text-sm font-medium transition-all",
                    activeTab === "reminders" && "bg-white shadow-sm"
                  )}
                >
                  Reminders
                </TabsTrigger>
              </TabsList>
              <Form {...form}>
                <TabsContent value="details" className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="title"
                          className="text-right font-medium text-gray-700"
                        >
                          Title
                        </Label>
                        <Input
                          id="title"
                          {...field}
                          className="col-span-3 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Event title"
                        />
                      </div>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <div className="grid grid-cols-4 items-start gap-4">
                        <Label
                          htmlFor="description"
                          className="text-right font-medium text-gray-700 pt-2"
                        >
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          {...field}
                          value={field.value || ""}
                          className="col-span-3 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Add event details"
                        />
                      </div>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="startDate"
                          className="text-right font-medium text-gray-700"
                        >
                          Start
                        </Label>
                        <Input
                          id="startDate"
                          type="datetime-local"
                          value={moment(field.value).format("YYYY-MM-DDTHH:mm")}
                          onChange={(e) =>
                            field.onChange(new Date(e.target.value))
                          }
                          className="col-span-3 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="endDate"
                          className="text-right font-medium text-gray-700"
                        >
                          End
                        </Label>
                        <Input
                          id="endDate"
                          type="datetime-local"
                          value={moment(field.value).format("YYYY-MM-DDTHH:mm")}
                          onChange={(e) =>
                            field.onChange(new Date(e.target.value))
                          }
                          className="col-span-3 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="allDay"
                    render={({ field }) => (
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="allDay"
                          className="text-right font-medium text-gray-700"
                        >
                          All Day
                        </Label>
                        <div className="col-span-3">
                          <Switch
                            id="allDay"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-blue-600"
                          />
                        </div>
                      </div>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="location"
                          className="text-right font-medium text-gray-700"
                        >
                          Location
                        </Label>
                        <Input
                          id="location"
                          {...field}
                          value={field.value || ""}
                          className="col-span-3 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Event location"
                        />
                      </div>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="type"
                          className="text-right font-medium text-gray-700"
                        >
                          Type
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
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="color"
                          className="text-right font-medium text-gray-700"
                        >
                          Color
                        </Label>
                        <Input
                          id="color"
                          type="color"
                          {...field}
                          className="col-span-3 h-10 rounded-md border-gray-300"
                        />
                      </div>
                    )}
                  />
                </TabsContent>

                <TabsContent value="recurrence" className="space-y-6">
                  <FormField
                    control={form.control}
                    name="isRecurring"
                    render={({ field }) => (
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="isRecurring"
                          className="text-right font-medium text-gray-700"
                        >
                          Recurring Event
                        </Label>
                        <div className="col-span-3">
                          <Switch
                            id="isRecurring"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-blue-600"
                          />
                        </div>
                      </div>
                    )}
                  />
                  {form.watch("isRecurring") && (
                    <FormField
                      control={form.control}
                      name="recurrenceRule"
                      render={({ field }) => (
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="recurrenceRule"
                            className="text-right font-medium text-gray-700"
                          >
                            Repeat
                          </Label>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="col-span-3 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                              <SelectValue placeholder="Select recurrence pattern" />
                            </SelectTrigger>
                            <SelectContent>
                              {recurrencePatterns.map((pattern) => (
                                <SelectItem
                                  key={pattern.value}
                                  value={pattern.value}
                                >
                                  {pattern.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    />
                  )}
                  {form.watch("isRecurring") && (
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label className="text-right font-medium text-gray-700 pt-2">
                        End Recurrence
                      </Label>
                      <div className="col-span-3 space-y-4">
                        <RadioGroup defaultValue="never" className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="never" id="never" />
                            <Label htmlFor="never" className="text-gray-700">
                              Never
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="after" id="after" />
                            <Label htmlFor="after" className="text-gray-700">
                              After
                            </Label>
                            <Input
                              type="number"
                              className="w-20 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                              min="1"
                              defaultValue="10"
                            />
                            <span className="text-gray-600">occurrences</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="on-date" id="on-date" />
                            <Label htmlFor="on-date" className="text-gray-700">
                              On date
                            </Label>
                            <Input
                              type="date"
                              className="w-40 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                              defaultValue={moment()
                                .add(1, "year")
                                .format("YYYY-MM-DD")}
                            />
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="reminders" className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Event Reminders
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addReminder}
                      className="hover:bg-gray-100 transition-colors"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Add Reminder
                    </Button>
                  </div>
                  {form.watch("reminders")?.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No reminders set. Click "Add Reminder" to create one.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {form.watch("reminders")?.map((reminder, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-4 border rounded-lg bg-gray-50"
                        >
                          <Select
                            value={reminder.time.toString()}
                            onValueChange={(value) =>
                              updateReminder(
                                index,
                                "time",
                                Number.parseInt(value)
                              )
                            }
                          >
                            <SelectTrigger className="w-32 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                              <SelectValue placeholder="Time" />
                            </SelectTrigger>
                            <SelectContent>
                              {reminderTimeOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value.toString()}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <span className="text-gray-600">
                            before event via
                          </span>
                          <Select
                            value={reminder.method}
                            onValueChange={(value) =>
                              updateReminder(index, "method", value)
                            }
                          >
                            <SelectTrigger className="w-32 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                              <SelectValue placeholder="Method" />
                            </SelectTrigger>
                            <SelectContent>
                              {reminderMethodOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeReminder(index)}
                            className="ml-auto hover:bg-red-100"
                          >
                            <TrashIcon className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Form>
            </Tabs>

            <DialogFooter className="flex justify-between pt-4 border-t">
              {!isNewEvent && selectedEvent && (
                <Button
                  variant="destructive"
                  onClick={handleDeleteEvent}
                  className="hover:bg-red-700 transition-colors"
                >
                  Delete Event
                </Button>
              )}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="hover:bg-gray-100 transition-colors"
                >
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