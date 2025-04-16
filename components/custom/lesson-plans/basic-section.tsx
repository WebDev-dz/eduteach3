// components/custom/lesson-plans/basic-section.tsx
"use client";
import { FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TrashIcon, PlusIcon } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import { lessonPlanInsertSchema } from "@/lib/validation/insert";
import {
  DateField,
  DurationField,
  GradeLevelField,
  ObjectivesField,
  SubjectField,
  TitleField,
} from "./form-fields";

type Props = {
  form: UseFormReturn<z.infer<typeof lessonPlanInsertSchema>>;
};

export const LessonPlanBasicFields = ({ form }: Props) => {
  return (
    <>
      <TitleField form={form} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SubjectField form={form} />

        <GradeLevelField form={form} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DurationField form={form} /> <DateField form={form} />
      </div>

      <ObjectivesField form={form} />
    </>
  );
};
