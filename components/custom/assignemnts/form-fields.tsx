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
import { FormFields, WritableSchemaData } from "@/types/ui";
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

type AssignmentFormData = Omit<
  typeof defaultValues.assignment.insert,
  "IdField" |
  "teacherId"|
  "createdAt"|
  "updatedAt"
>;

// Create the actual FormFields object with all field functions
const assignmentFields: FormFields<Required<AssignmentFormData>> = {
  TitleField({ form }): React.ReactNode {
    return (
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel htmlFor="name">Assignment Title</FormLabel>
            <FormControl>
              <Input id="title" {...field} placeholder="e.g., Assignment 9A" />
            </FormControl>
            <FormDescription></FormDescription>
            <FormMessage />
          </FormItem>
        )} />
    );
  },
  ClassIdField: ({form, data}) => (
    <FormField
      control={form.control}
      name="classId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Class</FormLabel>
          <Select onValueChange={field.onChange} value={field.value || ""}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {data?.classes?.map((cls) => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  ),
  TypeField({ form }): React.ReactNode {
    return (
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel>Assignment Type</FormLabel>
            <RadioGroup
              defaultValue="homework"
              value={field.value}
              onValueChange={(data) => {console.log({type: data}); field.onChange(data)}}
              className="grid grid-cols-2 gap-4 pt-2"
            >
              <div>
                <RadioGroupItem
                  value="homework"
                  id="homework"
                  className="peer sr-only" />
                <Label
                  htmlFor="homework"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <span>Homework</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="quiz"
                  id="quiz"
                  className="peer sr-only" />
                <Label
                  htmlFor="quiz"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <span>Quiz</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="test"
                  id="test"
                  className="peer sr-only" />
                <Label
                  htmlFor="test"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <span>Test</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="project"
                  id="project"
                  className="peer sr-only" />
                <Label
                  htmlFor="project"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <span>Project</span>
                </Label>
              </div>
            </RadioGroup>
          </FormItem>
        )} />
    );
  },
  StatusField({ form }): React.ReactNode {
    return (
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel htmlFor="gradeLevel">Status</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {["draft", "published", "archived", "graded"].map(
                    (item, i) => (
                      <SelectItem key={i + 1} value={item}>
                        {item.toLocaleUpperCase()}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription></FormDescription>
            <FormMessage />
          </FormItem>
        )} />
    );
  },
  InstructionsField({ form }): React.ReactNode {
    return (
      <FormField
        control={form.control}
        name="instructions"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel htmlFor="instructions">Instructions</FormLabel>
            <FormControl>
              <Textarea
                id="instructions"
                placeholder="Enter detailed instructions for the assignment"
                {...field}
                rows={5}
                required />
            </FormControl>
            <FormDescription></FormDescription>
            <FormMessage />
          </FormItem>
        )} />
    );
  },
  DueDateField({ form }): React.ReactNode {
    return (
      <FormField
        control={form.control}
        name="dueDate"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel htmlFor="schedule">Date</FormLabel>
            <FormControl>
              <Input
                id="dueDate"
                type="date"
                {...field}
                // value={field.value?.toISOString() || ""}
                placeholder="e.g., Mon/Wed/Fri 9:00-10:30 AM" />
            </FormControl>
            <FormDescription></FormDescription>
            <FormMessage />
          </FormItem>
        )} />
    );
  },
  TotalPointsField({ form }): React.ReactNode {
    return (
      <FormField
        control={form.control}
        name="totalPoints"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel htmlFor="totalPoints">Total Points</FormLabel>
            <FormControl>
              <Input
                id="totalPoints"
                type="number"
                min="1"
                {...field}
                placeholder="e.g., 30" />
            </FormControl>
            <FormDescription></FormDescription>
            <FormMessage />
          </FormItem>
        )} />
    );
  },
  AllowLateSubmissionsField({ form }): React.ReactNode {
    return (
      <FormField
        control={form.control}
        name="allowLateSubmissions"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <div className="flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  id="allowLateSubmissions"
                  checked={field.value ?? false}
                  onCheckedChange={field.onChange} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
              <FormLabel htmlFor="allowLateSubmissions">
                Allow Late Submissions
              </FormLabel>
            </div>
            {/* <p className="text-sm text-muted-foreground">
                                Inactive classes won't appear in the active classes list.
                              </p> */}
          </FormItem>
        )} />
    );
  },
  TimeLimitField({ form }): React.ReactNode {
    return (
      <FormField
        control={form.control}
        name="timeLimit"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="time-limit" />
              <Label htmlFor="time-limit">Set Time Limit</Label>
            </div>
            <Input
              id="time-limit-minutes"
              value={field.value || 0}
              onChange={field.onChange}
              type="number"
              min="1"
              placeholder="Time limit in minutes"
              className="mt-2" />
          </FormItem>
        )} />
    );
  },
  IdField: function (props: { form: UseFormReturn<Required<AssignmentFormData>>; data?: WritableSchemaData; }): React.ReactNode {
    throw new Error("Function not implemented.");
  },
  EstimatedTimeField: function (props: { form: UseFormReturn<Required<AssignmentFormData>>; data?: WritableSchemaData; }): React.ReactNode {
    throw new Error("Function not implemented.");
  },
  ResourcesField: function (props: { form: UseFormReturn<Required<AssignmentFormData>>; data?: WritableSchemaData; }): React.ReactNode {
    throw new Error("Function not implemented.");
  }
};

// Export all individual fields for direct imports
export const {
  TitleField,
  ClassIdField,
  TypeField,
  StatusField,
  DueDateField,
  TimeLimitField,
  TotalPointsField,
  InstructionsField,
  AllowLateSubmissionsField,
} = assignmentFields;
