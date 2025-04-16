// @/components/custom/calendar-events/form-fields.tsx
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { FormFields } from "@/types/ui";
import { defaultValues } from "@/lib/consts";
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
  FormControl,
  Label,
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui";
import { Json } from "drizzle-zod";
import { Reminder } from "@/lib/db/schema";

type CalendarEventFormData = typeof defaultValues.calendarEvent.insert;

const calendarEventsFields: Required<FormFields<CalendarEventFormData>> = {
  TitleField: function (form): React.ReactNode {
    return (
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel htmlFor="event-title">Event Title</FormLabel>
            <FormControl>
              <Input
                id="event-title"
                {...field}
                placeholder="Enter event title"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  },
  LocationField: function (form) {
    return (
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel htmlFor="event-location">Location (Optional)</FormLabel>
            <FormControl>
              <Input
                id="event-location"
                {...field}
                placeholder="Enter location"
              />
            </FormControl><FormMessage />
          </FormItem>
        )}
      />
    );
  },
  TeacherIdField: function (form): React.ReactNode {
    return <></>;
  },
  StartDateField: function (form): React.ReactNode {
    return (
      <FormField
        control={form.control}
        name="startDate"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel htmlFor="event-start-date">Start Date</FormLabel>
            <FormControl>
              <Input type="datetime-local" id="event-start-date" {...field} />
            </FormControl><FormMessage />
          </FormItem>
        )}
      />
    );
  },
  EndDateField: function (form): React.ReactNode {
    return (
      <FormField
        control={form.control}
        name="endDate"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel htmlFor="event-end-date">End Date</FormLabel>
            <FormControl>
              <Input type="datetime-local" id="event-end-date" {...field} />
            </FormControl><FormMessage />
          </FormItem>
        )}
      />
    );
  },
  IdField: function (form): React.ReactNode {
    return (
      <FormField
        control={form.control}
        name="id"
        render={({ field }) => <Input type="hidden" {...field} />}
      />
    );
  },
  DescriptionField: function (form): React.ReactNode {
    return (
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel htmlFor="event-description">Description</FormLabel>
            <FormControl>
              <Textarea
                id="event-description"
                {...field}
                placeholder="Enter event description"
              />
            </FormControl><FormMessage />
          </FormItem>
        )}
      />
    );
  },
  CreatedAtField: function (form): React.ReactNode {
    return (
      <FormField
        control={form.control}
        name="createdAt"
        render={({ field }) => <Input type="hidden" {...field} />}
      />
    );
  },
  UpdatedAtField: function (form): React.ReactNode {
    return (
      <FormField
        control={form.control}
        name="updatedAt"
        render={({ field }) => <Input type="hidden" {...field} />}
      />
    );
  },
  ClassIdField: function (form): React.ReactNode {
    return (
      <FormField
        control={form.control}
        name="classId"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel htmlFor="event-class">Class</FormLabel>
            <FormControl>
              <Input id="event-class" {...field} placeholder="Select class" />
            </FormControl><FormMessage />
          </FormItem>
        )}
      />
    );
  },
  TypeField: function (form): React.ReactNode {
    return (
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel htmlFor="event-type">Event Type</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger id="event-type">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="class">Class</SelectItem>
                  <SelectItem value="assignment">Assignment</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </FormControl><FormMessage />
          </FormItem>
        )}
      />
    );
  },
  AssignmentIdField: function (form): React.ReactNode {
    return (
      <FormField
        control={form.control}
        name="assignmentId"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel htmlFor="event-assignment">Assignment</FormLabel>
            <FormControl>
              <Input
                id="event-assignment"
                {...field}
                placeholder="Select assignment"
              />
            </FormControl><FormMessage />
          </FormItem>
        )}
      />
    );
  },
  AllDayField: function (form): React.ReactNode {
    return (
      <FormField
        control={form.control}
        name="allDay"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center space-x-2 space-y-0">
            <FormControl>
              <Checkbox
                id="event-all-day"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl><FormMessage />
            <FormLabel htmlFor="event-all-day" className="cursor-pointer">
              All Day Event
            </FormLabel>
            <FormControl></FormControl><FormMessage />
          </FormItem>
        )}
      />
    );
  },
  LessonPlanIdField: function (form): React.ReactNode {
    return (
      <FormField
        control={form.control}
        name="lessonPlanId"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel htmlFor="event-lesson-plan">Lesson Plan</FormLabel>
            <FormControl>
              <Input
                id="event-lesson-plan"
                {...field}
                placeholder="Select lesson plan"
              />
            </FormControl><FormMessage />
          </FormItem>
        )}
      />
    );
  },
  ColorField: function (form): React.ReactNode {
    return (
      <FormField
        control={form.control}
        name="color"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel htmlFor="event-color">Color</FormLabel>
            <FormControl>
              <Input
                type="color"
                id="event-color"
                {...field}
                className="w-full h-10"
              />
            </FormControl><FormMessage />
          </FormItem>
        )}
      />
    );
  },
  RecurrenceRuleField: function (form): React.ReactNode {
    return (
      <FormField
        control={form.control}
        name="recurrenceRule"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel htmlFor="event-recurrence">Recurrence Rule</FormLabel>
            <FormControl>
              <Input
                id="event-recurrence"
                {...field}
                placeholder="RRULE:FREQ=WEEKLY;BYDAY=MO,WE,FR"
              />
            </FormControl><FormMessage />
          </FormItem>
        )}
      />
    );
  },
  IsRecurringField: function (form): React.ReactNode {
    return (
      <FormField
        control={form.control}
        name="isRecurring"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center space-x-2 space-y-0">
            <FormControl>
              <Checkbox
                id="event-is-recurring"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl><FormMessage />
            <FormLabel htmlFor="event-is-recurring" className="cursor-pointer">
              Recurring Event
            </FormLabel>
            <FormControl></FormControl><FormMessage />
          </FormItem>
        )}
      />
    );
  },
  VisibilityField: function (form): React.ReactNode {
    return (
      <FormField
        control={form.control}
        name="visibility"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel htmlFor="event-visibility">Visibility</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger id="event-visibility">
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="class">Class Only</SelectItem>
                </SelectContent>
              </Select>
            </FormControl><FormMessage />
          </FormItem>
        )}
      />
    );
  },
  RemindersField: function (form): React.ReactNode {
    return (
      <FormField
        control={form.control}
        name="reminders"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel htmlFor="event-reminders">
              Reminders (minutes before)
            </FormLabel>
            <FormControl>
              <Input id="event-reminders" {...field} placeholder="15,30,60" />
            </FormControl>
              <FormDescription>
                Enter comma-separated minutes (e.g., 15,30,60)
              </FormDescription>
              <FormMessage />
          </FormItem>
        )}
      />
    );
  },
};

export const {
  TitleField,
  StartDateField,
  EndDateField,
  LocationField,
  TeacherIdField,
  IdField,
  DescriptionField,
  CreatedAtField,
  UpdatedAtField,
  ClassIdField,
  TypeField,
  AssignmentIdField,
  AllDayField,
  LessonPlanIdField,
  ColorField,
  RecurrenceRuleField,
  IsRecurringField,
  VisibilityField,
  RemindersField,
} = calendarEventsFields;
