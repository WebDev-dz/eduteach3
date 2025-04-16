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
import { lessonPlanInsertSchema } from "@/lib/validation/insert";
import { z } from "zod";
import { Button } from "@/components/ui";
import { PlusIcon, TrashIcon } from "lucide-react";

type LessonPlanFormData = Omit<
  z.infer<typeof lessonPlanInsertSchema>,
  | "createdAt"
  | "updatedAt"
  | "id"
  | "teacherId"
  | "organizationId"
  | "procedure"
>;

export const lessonPlanFields: Required<FormFields<LessonPlanFormData>> = {
  TitleField: ({
  form
}) => (
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Title</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ),

  SubjectField: ({
  form
}) => (
    <FormField
      control={form.control}
      name="subject"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Subject</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ),

  GradeLevelField: ({
  form
}) => (
    <FormField
      control={form.control}
      name="gradeLevel"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Grade Level</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ),

  DurationField: ({
  form
}) => (
    <FormField
      control={form.control}
      name="duration"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Duration</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ),

  DateField: ({
  form
}) => (
    <FormField
      control={form.control}
      name="date"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Date</FormLabel>
          <FormControl>
            <Input type="date" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ),

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

  StatusField: ({
  form
}) => (
    <FormField
      control={form.control}
      name="status"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Status</FormLabel>
          <FormControl>
            <Select {...field} value={field.value || ""}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  ),

  ObjectivesField: ({
  form
}) => {
    const handleAddObjective = () => {
      form.setValue("objectives", [...form.getValues("objectives"), ""]);
    };

    const handleObjectiveChange = (index: number, value: string) => {
      const newObjectives = [...form.getValues("objectives")];
      newObjectives[index] = value;
      form.setValue("objectives", newObjectives);
    };

    const handleRemoveObjective = (index: number) => {
      const updated = [...form.getValues("objectives")];
      updated.splice(index, 1);
      form.setValue("objectives", updated);
    };

    return (
      <FormField
        name="objectives"
        control={form.control}
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel>Learning Objectives</FormLabel>
            <div className="space-y-2">
              {(field.value as string [])?.map((obj, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Objective ${index + 1}`}
                    value={obj}
                    onChange={(e) =>
                      handleObjectiveChange(index, e.target.value)
                    }
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveObjective(index)}
                    disabled={field.value.length <= 1}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddObjective}
                className="mt-2"
              >
                <PlusIcon className="mr-2 h-4 w-4" /> Add Objective
              </Button>
            </div>
          </FormItem>
        )}
      />
    );
  },

  MaterialsField: ({
  form
}) => (
    <FormField
      control={form.control}
      name="materials"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Materials</FormLabel>
          <FormControl>
            <Textarea rows={3} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ),

  IntroductionField: ({
  form
}) => (
    <FormField
      control={form.control}
      name="introduction"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Introduction</FormLabel>
          <FormControl>
            <Textarea rows={3} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ),

  MainActivityField: ({
  form
}) => (
    <FormField
      control={form.control}
      name="mainActivity"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Main Activity</FormLabel>
          <FormControl>
            <Textarea rows={3} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ),

  ConclusionField: ({
  form
}) => (
    <FormField
      control={form.control}
      name="conclusion"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Conclusion</FormLabel>
          <FormControl>
            <Textarea rows={3} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ),

  AssessmentField: ({
  form
}) => (
    <FormField
      control={form.control}
      name="assessment"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Assessment</FormLabel>
          <FormControl>
            <Textarea rows={3} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ),

  NotesField: ({
  form
}) => (
    <FormField
      control={form.control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Notes</FormLabel>
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
  TitleField,
  SubjectField,
  GradeLevelField,
  DurationField,
  DateField,
  ClassIdField,
  StatusField,
  ObjectivesField,
  MaterialsField,
  IntroductionField,
  MainActivityField,
  ConclusionField,
  AssessmentField,
  NotesField,
} = lessonPlanFields;
