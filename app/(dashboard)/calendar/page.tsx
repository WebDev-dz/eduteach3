"use client";

import React, { useEffect, useMemo } from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldErrors, useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { calendarEventInsertSchema } from "@/lib/validation/insert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { SiteHeader } from "@/components/shared/site-header";
import {
  Calendar as CalendarIcon,
  Loader2,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UsersIcon,
  ClipboardListIcon,
  GraduationCapIcon,
  FileTextIcon,
} from "lucide-react";
import { CalendarEvent } from "@/types/entities";
import {
  subMonths,
  subWeeks,
  addDays,
  addMonths,
  addWeeks,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  parseISO,
  isSameMonth,
} from "date-fns";
import { format } from "date-fns";
import { defaultValues } from "@/lib/consts";
import {
  useCalendarEvents,
  useCreateCalendarEvent,
  useUpdateCalendarEvent,
} from "../../../services/calendar-event-service";
import { z } from "zod";
import {
  AllDayField,
  AssignmentIdField,
  ClassIdField,
  ColorField,
  CreatedAtField,
  DescriptionField,
  EndDateField,
  IdField,
  IsRecurringField,
  LessonPlanIdField,
  LocationField,
  RecurrenceRuleField,
  RemindersField,
  StartDateField,
  TitleField,
  TypeField,
  UpdatedAtField,
  VisibilityField,
} from "@/components/custom/calendar-events/form-fields";
import { useSession } from "next-auth/react";
import { Calendar } from "@/components/ui";
import { toast } from "sonner";

type EventDialogProps = {
  selectedEvent: CalendarEvent | typeof defaultValues.calendarEvent.insert;
  open: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const EventDialog = ({ open, setIsOpen, selectedEvent }: EventDialogProps) => {
  const form = useForm({
    defaultValues: selectedEvent || defaultValues.calendarEvent.insert,
    resolver: zodResolver(calendarEventInsertSchema),
  });

  const createEvent = useCreateCalendarEvent();
  const updateEvent = useUpdateCalendarEvent();
  const isEdit = Boolean(selectedEvent?.id);

  const onSubmit = async (data: z.infer<typeof calendarEventInsertSchema>) => {
    if (isEdit) {
      await updateEvent.mutate(data);
    } else {
      await createEvent.mutate(data);
    }
    setIsOpen(false);
  };

  const onInValid = (
    errors: FieldErrors<z.infer<typeof calendarEventInsertSchema>>
  ) => {
    console.log(errors);
    toast.error("Invalid data");
  };
  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent >
        <Form {...form}>
          <form className="sm:max-w-[500px] max-h-[90vh] overflow-hidden flex flex-col" onSubmit={form.handleSubmit(onSubmit, onInValid)}>
            <DialogHeader>
              <DialogTitle>
                {isEdit ? "Edit Event" : "Add New Event"}
              </DialogTitle>
              <DialogDescription>
                {isEdit
                  ? "Make changes to your event"
                  : "Create a new event in your calendar"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 flex-1 overflow-y-auto">
              {/* Hidden fields */}
              <IdField form={form} />
              <CreatedAtField form={form} />
              <UpdatedAtField form={form} />

              {/* Visible fields */}
              <TitleField form={form} />

              <div className="grid grid-cols-2 gap-4">
                <StartDateField form={form} />
                <EndDateField form={form} />
              </div>

              <div className="flex space-x-4">
                <div className="flex-1">
                  <TypeField form={form} />
                </div>
                <div className="flex-1">
                  <ColorField form={form} />
                </div>
              </div>

              <LocationField form={form} />
              <DescriptionField form={form} />

              <div className="flex space-x-4 items-center">
                <div className="flex-1">
                  <AllDayField form={form} />
                </div>
                <div className="flex-1">
                  <IsRecurringField form={form} />
                </div>
              </div>

              {form.watch("isRecurring") && <RecurrenceRuleField form={form} />}

              <VisibilityField form={form} />
              <RemindersField form={form} />

              {/* Conditionally show fields based on event type */}
              {form.watch("type") === "class" && <ClassIdField form={form} />}

              {form.watch("type") === "assignment" && (
                <AssignmentIdField form={form} />
              )}

              {form.watch("type") === "class" && (
                <LessonPlanIdField form={form} />
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 transition-colors"
                disabled={createEvent.isPending || updateEvent.isPending}
              >
                {createEvent.isPending || updateEvent.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {isEdit ? "Update" : "Save"} Event
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const initialFilters: FiltersFormValues = {
  classes: true,
  assignments: true,
  exams: true,
  meetings: true,
  personal: true,
};

export default function CalendarPage() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const form = useForm<FiltersFormValues>({
    resolver: zodResolver(filtersSchema),
    defaultValues: initialFilters,
  });

  // const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);
  // Use useMemo to prevent unnecessary recalculations

  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [newEventDate, setNewEventDate] = useState<Date>(new Date());

  const [eventFilters, setEventFilters] = useState({
    classes: true,
    assignments: true,
    exams: true,
    meetings: true,
    personal: true,
  });

  const handlePrevious = () => {
    if (view === "month") {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (view === "week") {
      setCurrentDate(subWeeks(currentDate, 1));
    } else if (view === "day") {
      setCurrentDate(addDays(currentDate, -1));
    }
  };

  const handleNext = () => {
    if (view === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (view === "week") {
      setCurrentDate(addWeeks(currentDate, 1));
    } else if (view === "day") {
      setCurrentDate(addDays(currentDate, 1));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const session = useSession();

  const { data: events = [], mutate: fetchCalendarEvents } =
    useCalendarEvents();

  const filteredEvents = useMemo(() => {
    const eventFilters = form.getValues();
    return events.filter((event) => {
      if (event.type === "class" && !eventFilters.classes) return false;
      if (event.type === "assignment" && !eventFilters.assignments)
        return false;
      if (event.type === "exam" && !eventFilters.exams) return false;
      if (event.type === "meeting" && !eventFilters.meetings) return false;
      if (event.type === "personal" && !eventFilters.personal) return false;
      return true;
    });
  }, [
    events,
    form.watch(["classes", "assignments", "exams", "meetings", "personal"]),
  ]);

  useEffect(() => {
    console.log("Current filteredEvents:", filteredEvents);
  }, [filteredEvents]);

  useEffect(() => {
    if (session?.data?.user) {
      fetchCalendarEvents({ teacherId: session.data.user.id });
    }
    console.log({ filteredEvents });
  }, [session?.data?.user]);
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "class":
        return "bg-blue-500";
      case "assignment":
        return "bg-green-500";
      case "exam":
        return "bg-red-500";
      case "meeting":
        return "bg-purple-500";
      case "personal":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "class":
        return <GraduationCapIcon className="h-4 w-4" />;
      case "assignment":
        return <ClipboardListIcon className="h-4 w-4" />;
      case "exam":
        return <FileTextIcon className="h-4 w-4" />;
      case "meeting":
        return <UsersIcon className="h-4 w-4" />;
      case "personal":
        return <CalendarIcon className="h-4 w-4" />;
      default:
        return <CalendarIcon className="h-4 w-4" />;
    }
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-medium py-2">
            {day}
          </div>
        ))}
        {days.map((day, i) => {
          // This condition should be here, not around the entire map function
          const dayEvents = filteredEvents.filter((event) => {
            // Handle the date conversion properly
            try {
              const eventDate = new Date(event.startDate);
              return isSameDay(eventDate, day);
            } catch (error) {
              console.error("Error parsing date:", event.startDate, error);
              return false;
            }
          });

          return (
            <div
              key={i}
              className={cn(
                "min-h-[100px] p-1 border rounded-md",
                !isSameMonth(day, monthStart) &&
                  "bg-muted/50 text-muted-foreground",
                isSameDay(day, new Date()) && "bg-accent/50"
              )}
              onClick={() => {
                setNewEventDate(day);
                setIsAddEventOpen(true);
              }}
            >
              <div className="font-medium text-right p-1">
                {format(day, "d")}
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event, eventIndex) => (
                  <div
                    key={eventIndex}
                    className={cn(
                      "text-xs px-2 py-1 rounded-md truncate cursor-pointer text-white",
                      getEventTypeColor(event.type)
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEventClick(event);
                    }}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-center text-muted-foreground">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate);
    const weekEnd = endOfWeek(currentDate);
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return (
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, i) => (
          <div key={i} className="flex flex-col">
            <div
              className={cn(
                "text-center font-medium py-2",
                isSameDay(day, new Date()) && "bg-accent rounded-md"
              )}
            >
              <div>{format(day, "EEE")}</div>
              <div>{format(day, "d")}</div>
            </div>
            <div className="flex-1 space-y-1 mt-2">
              {filteredEvents
                .filter((event) => isSameDay(event.startDate, day))
                .map((event, eventIndex) => (
                  <div
                    key={eventIndex}
                    className={cn(
                      "text-sm px-2 py-1 rounded-md cursor-pointer text-white",
                      getEventTypeColor(event.type)
                    )}
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="font-medium truncate">{event.title}</div>
                    <div className="text-xs">
                      {format(event.startDate, "h:mm a")}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderDayView = () => {
    const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7 AM to 8 PM

    return (
      <div className="flex flex-col space-y-2">
        <div className="text-center font-medium py-2">
          <div className="text-lg">{format(currentDate, "EEEE")}</div>
          <div
            className={cn(
              "inline-block px-2 py-1 rounded-md",
              isSameDay(currentDate, new Date()) && "bg-accent"
            )}
          >
            {format(currentDate, "MMMM d, yyyy")}
          </div>
        </div>
        <div className="grid grid-cols-[100px_1fr] gap-2">
          {hours.map((hour) => {
            const hourEvents = filteredEvents.filter((event) => {
              const eventDate = event.startDate;
              return (
                isSameDay(eventDate, currentDate) &&
                eventDate?.getHours() === hour
              );
            });

            return (
              <React.Fragment key={hour}>
                <div className="text-right pr-2 py-2 text-muted-foreground">
                  {hour === 12
                    ? "12 PM"
                    : hour < 12
                      ? `${hour} AM`
                      : `${hour - 12} PM`}
                </div>
                <div
                  className="border-t min-h-[60px] relative"
                  onClick={() => {
                    const newDate = new Date(currentDate);
                    newDate.setHours(hour, 0, 0, 0);
                    setNewEventDate(newDate);
                    setIsAddEventOpen(true);
                  }}
                >
                  {hourEvents.map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className={cn(
                        "absolute left-0 right-0 m-1 px-2 py-1 rounded-md cursor-pointer text-white",
                        getEventTypeColor(event.type)
                      )}
                      style={{ top: `${eventIndex * 20}px` }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEventClick(event);
                      }}
                    >
                      <div className="font-medium">{event.title}</div>
                      <div className="text-xs">
                        {format(event.startDate, "h:mm a")}
                      </div>
                    </div>
                  ))}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <SiteHeader title="Calendar" />
      <div className="flex flex-1 flex-col p-4 md:p-6 gap-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Calendar</h1>
            <p className="text-muted-foreground">
              Manage your schedule and events
            </p>
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
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
                <CardDescription>
                  Manage your schedule and events
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <Form {...form}>
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <Calendar
                        mode="single"
                        selected={currentDate}
                        onSelect={(date) => date && setCurrentDate(date)}
                        className="rounded-md border"
                      />
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleToday}
                    >
                      Today
                    </Button>
                  </div>
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <h3 className="font-medium">Filters</h3>
                  <FiltersComponent form={form} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <h3 className="font-medium">Upcoming Events</h3>
                  <div className="space-y-2">
                    {events
                      .filter((event) => new Date(event.startDate) > new Date())
                      .sort(
                        (a, b) =>
                          new Date(a.startDate).getTime() -
                          new Date(b.startDate).getTime()
                      )
                      .slice(0, 5)
                      .map((event, index) => (
                        <div
                          key={index}
                          className="p-2 border rounded-md cursor-pointer hover:bg-accent"
                          onClick={() => handleEventClick(event)}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "w-2 h-2 rounded-full",
                                getEventTypeColor(event.type)
                              )}
                            ></div>
                            <div className="font-medium truncate">
                              {event.title}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {format(event.startDate, "MMM d, h:mm a")}
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
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handlePrevious}
                      >
                        <ChevronLeftIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleNext}
                      >
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
                      <Tabs
                        value={view}
                        onValueChange={(v) =>
                          setView(v as "month" | "week" | "day")
                        }
                      >
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
        {selectedEvent && (
          <EventDialog
            selectedEvent={selectedEvent}
            open={!!selectedEvent}
            setIsOpen={() => setSelectedEvent(null)}
          />
        )}

        {/* Add Event Dialog */}
        <EventDialog
          selectedEvent={{
            ...defaultValues.calendarEvent.insert,
            startDate: newEventDate,
            endDate: new Date(newEventDate.getTime() + 60 * 60 * 1000),
          }}
          open={isAddEventOpen}
          setIsOpen={setIsAddEventOpen}
        />
      </div>
    </>
  );
}

const filtersSchema = z.object({
  classes: z.boolean(),
  assignments: z.boolean(),
  exams: z.boolean(),
  meetings: z.boolean(),
  personal: z.boolean(),
});

type FiltersFormValues = z.infer<typeof filtersSchema>;

type FiltersComponentProps = {
  onChange?: (values: FiltersFormValues) => void;
  form: UseFormReturn<FiltersFormValues>;
};

// Also, modify the FiltersComponent to correctly handle form changes:
export function FiltersComponent({ onChange, form }: FiltersComponentProps) {
  const colors: Record<keyof FiltersFormValues, string> = {
    classes: "bg-blue-500",
    assignments: "bg-green-500",
    exams: "bg-red-500",
    meetings: "bg-purple-500",
    personal: "bg-yellow-500",
  };

  // Remove the problematic useEffect that creates the loop
  // Instead, use form.watch with a callback that doesn't re-render

  // Apply changes to form on user input - not on every render
  const handleFilterChange = (field: string, checked: boolean) => {
    form.setValue(field as keyof FiltersFormValues, checked, {
      shouldValidate: true,
      shouldDirty: true,
    });

    // Only call onChange when we have actual values to pass
    if (onChange) {
      const currentValues = form.getValues();
      onChange(currentValues);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-2">
        {Object.keys(colors).map((key) => (
          <FormField
            key={key}
            control={form.control}
            name={key as keyof FiltersFormValues}
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    id={`filter-${key}`}
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      // Call our handler instead of directly using field.onChange
                      handleFilterChange(key, checked === true);
                    }}
                  />
                </FormControl>
                <FormLabel
                  htmlFor={`filter-${key}`}
                  className="flex items-center"
                >
                  <div
                    className={`w-3 h-3 rounded-full ${colors[key as keyof FiltersFormValues]} mr-2`}
                  ></div>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </FormLabel>
              </FormItem>
            )}
          />
        ))}
      </form>
    </Form>
  );
}
