import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { FormFields } from "@/types/ui";
import { gradeInsertSchema } from "@/lib/validation/insert";
import { z } from "zod";

type GradeFormData = Omit<
  z.infer<typeof gradeInsertSchema>,
  "createdAt" | "updatedAt" | "id" | "teacherId"
>;

export const gradeFields: Required<FormFields<GradeFormData>> = {
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

  StudentIdField: ({form, data}) => (
    <FormField
      control={form.control}
      name="studentId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Student</FormLabel>
          <Select onValueChange={field.onChange} value={field.value || ""}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select student" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {data?.students?.map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  {student.firstName} {student.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  ),

  ScoreField: ({form}) => (
    <FormField
      control={form.control}
      name="score"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Score</FormLabel>
          <FormControl>
            <Input type="number" step="0.1" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ),

  MaxScoreField: ({form}) => (
    <FormField
      control={form.control}
      name="maxScore"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Max Score</FormLabel>
          <FormControl>
            <Input type="number" step="0.1" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ),

  AssignmentIdField: ({form, data}) => (
    <FormField
      control={form.control}
      name="assignmentId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Assignment</FormLabel>
          <Select onValueChange={field.onChange} value={field.value || ""}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select assignment" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {data?.assignments?.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  ),

  CommentsField: ({form}) => (
    <FormField
      control={form.control}
      name="comments"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Comments</FormLabel>
          <FormControl>
            <Textarea rows={3} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ),
};

export const {
  CommentsField,
  ScoreField,
  AssignmentIdField,
  MaxScoreField,
  StudentIdField,
} = gradeFields;
