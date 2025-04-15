// @/components/custom/classes/form-fields.tsx
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
import { FormField, FormItem, FormLabel, FormDescription, FormMessage, FormControl } from "@/components/ui";

type ClassFormData = typeof defaultValues.class.insert;

function NameField (
    form: UseFormReturn<typeof defaultValues.class.insert>
  ): React.ReactNode {
    return (
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel htmlFor="name">Class Name</FormLabel>
            <FormControl>
              <Input id="name" {...field} placeholder="e.g., Class 9A" />
            </FormControl>
            <FormDescription></FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
function SubjectField (
    form: UseFormReturn<typeof defaultValues.class.insert>
  ): React.ReactNode {
    return (
      <FormField
        control={form.control}
        name="subject"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel htmlFor="subject">Subject</FormLabel>
            <FormControl>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="science">Science</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="history">History</SelectItem>
                  <SelectItem value="geography">Geography</SelectItem>
                  <SelectItem value="art">Art</SelectItem>
                  <SelectItem value="music">Music</SelectItem>
                  <SelectItem value="physical_education">
                    Physical Education
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription></FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
function GradeLevelField (
    form: UseFormReturn<typeof defaultValues.class.insert>
  ): React.ReactNode {
    return (
      <FormField
        control={form.control}
        name="gradeLevel"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel htmlFor="gradeLevel">Grade Level</FormLabel>
            <FormControl>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <SelectTrigger id="gradeLevel">
                  <SelectValue placeholder="Select grade level" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(12)].map((_, i) => (
                    <SelectItem key={i + 1} value={String(i + 1)}>
                      Grade {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription></FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
function AcademicYearField (
    form: UseFormReturn<typeof defaultValues.class.insert>
  ): React.ReactNode {
    return (
      <FormField
        control={form.control}
        name="academicYear"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel htmlFor="academicYear">Academic Year</FormLabel>
            <FormControl>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <SelectTrigger id="academicYear">
                  <SelectValue placeholder="Select academic year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-2025">2024-2025</SelectItem>
                  <SelectItem value="2025-2026">2025-2026</SelectItem>
                  <SelectItem value="2026-2027">2026-2027</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription></FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
function TeacherIdField (
    form: UseFormReturn<typeof defaultValues.class.insert>
  ): React.ReactNode {
    // Teacher ID is automatically set from the session, so this field is hidden
    return null;
  }
function ScheduleField (
    form: UseFormReturn<typeof defaultValues.class.insert>
  ): React.ReactNode {
    return (
      <FormField
        control={form.control}
        name="schedule"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel htmlFor="schedule">Schedule</FormLabel>
            <FormControl>
              <Input
                id="schedule"
                {...field}
                value={field.value || ""}
                placeholder="e.g., Mon/Wed/Fri 9:00-10:30 AM"
              />
            </FormControl>
            <FormDescription></FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
function RoomField (
    form: UseFormReturn<typeof defaultValues.class.insert>
  ): React.ReactNode {
    return (
      <FormField
        control={form.control}
        name="room"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel htmlFor="room">Room</FormLabel>
            <FormControl>
              <Input id="room" {...field} value={field.value || ""} placeholder="e.g., Room 203" />
            </FormControl>
            <FormDescription></FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
function CapacityField (
    form: UseFormReturn<typeof defaultValues.class.insert>
  ): React.ReactNode {
    return (
      <FormField
        control={form.control}
        name="capacity"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel htmlFor="capacity">Maximum Capacity</FormLabel>
            <FormControl>
              <Input
                id="capacity"
                type="number"
                min="1"
                {...field}
                placeholder="e.g., 30"
              />
            </FormControl>
            <FormDescription></FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
function DescriptionField (
    form: UseFormReturn<typeof defaultValues.class.insert>
  ): React.ReactNode {
    return (
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel htmlFor="description">Description</FormLabel>
            <FormControl>
              <Textarea
                id="description"
                {...field}
                value={field.value || ""}
                placeholder="Enter a brief description of the class"
                rows={3}
              />
            </FormControl>
            <FormDescription></FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
function IsActiveField (
    form: UseFormReturn<typeof defaultValues.class.insert>
  ): React.ReactNode {
    return (
      <FormField
        control={form.control}
        name="isActive"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <div className="flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  id="isActive"
                  checked={field.value ?? false}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
              <FormLabel htmlFor="isActive">Active Class</FormLabel>
            </div>
            <p className="text-sm text-muted-foreground">
              Inactive classes won't appear in the active classes list.
            </p>
          </FormItem>
        )}
      />
    );
  }

// Create the actual FormFields object with all field functions
const classFields: FormFields<ClassFormData> = {
    NameField,
    SubjectField,
    GradeLevelField,
    AcademicYearField,
    TeacherIdField,
    ScheduleField,
    RoomField,
    CapacityField,
    DescriptionField,
    IsActiveField,
  };
  
  
  
  // Export all individual fields for direct imports
  export {
    NameField,
    SubjectField,
    GradeLevelField,
    AcademicYearField,
    TeacherIdField,
    ScheduleField,
    RoomField,
    CapacityField,
    DescriptionField,
    IsActiveField,
  } 