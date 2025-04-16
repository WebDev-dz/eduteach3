"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SiteHeader } from "@/components/shared/site-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeftIcon, BookIcon, PlusIcon, TrashIcon } from "lucide-react";
import { LessonPlan } from "@/types/entities";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { lessonPlanInsertSchema } from "@/lib/validation/insert";
import { defaultValues, lessonPlans, templates } from "@/lib/consts";
import { z } from "zod";
import { useCreateLessonPlan } from "@/services/lesson-plan-service";
import { Alert, AlertDescription, AlertTitle, Form, FormField, FormItem } from "@/components/ui";
import { useSession } from "next-auth/react";
import { LessonPlanBasicFields } from "@/components/custom/lesson-plans/basic-section";
import { LessonPlanProcedureFields } from "@/components/custom/lesson-plans/procedure-fields";

export default function CreateLessonPlanPage() {

  const { data } = useSession()
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template");
  const editId = searchParams.get("edit");
  const form = useForm<z.infer<typeof lessonPlanInsertSchema>>({
    resolver: zodResolver(lessonPlanInsertSchema),
    mode: "onChange",
    defaultValues: defaultValues.lessonPlan.insert
  })


  const createLessonPlan = useCreateLessonPlan();

  useEffect(() => {
    // If template or edit ID is provided, pre-fill the form
    if (!data) return;

    form.setValue("teacherId", data.user.id)

    if (templateId) {
      const template = templates.find(
        (t) => t.id === templateId
      );
      if (template) {
        form.reset(template as LessonPlan);
      }
    } else if (editId) {
      const lessonPlan = lessonPlans.find(
        (p) => p.id === editId
      );
      if (lessonPlan) {
        form.reset(lessonPlan);
      }
    }
  }, [templateId, editId, data]);





  const onSubmit = async (data: z.infer<typeof lessonPlanInsertSchema>) => {
    console.log({data});
    await createLessonPlan.mutate(data);
  };

  return (
    <>
      <SiteHeader title={editId ? "Edit Lesson Plan" : "Create Lesson Plan"} />
      <div className="flex flex-1 flex-col p-4 md:p-6 gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">
            {editId ? "Edit Lesson Plan" : "Create Lesson Plan"}
          </h1>
        </div>

        <Card className="max-w-4xl mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit,(error) => {
              console.error(error);
              console.log(form.getValues())
            })}>
              <CardHeader>
                <CardTitle>
                  {editId ? "Edit Lesson Plan" : "Create a New Lesson Plan"}
                </CardTitle>
                <CardDescription>
                  {templateId
                    ? "You're using a template as a starting point. Customize it to fit your needs."
                    : "Fill in the details to create a comprehensive lesson plan for your class."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {form.formState.errors.title?.message && <Alert>
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {form.formState.errors.title?.message}
                  </AlertDescription>
                </Alert>}
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="procedure">
                      Lesson Procedure
                    </TabsTrigger>
                    
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4 pt-4">
                  <LessonPlanBasicFields form={form} />

                  </TabsContent>

                  <TabsContent value="procedure" className="space-y-4 pt-4">
                    <LessonPlanProcedureFields form={form} />
                  </TabsContent>

                  {/* <TabsContent value="resources" className="space-y-4 pt-4">
                    <LessonPlanResourcesFields form={form} />
                  </TabsContent> */}

                  {/* <TabsContent value="assessment" className="space-y-4 pt-4">
                    <LessonPlanAssessmentFields form={form} />
                  </TabsContent> */}

                  {/* <TabsContent value="notes" className="space-y-4 pt-4">
                    <LessonPlanNotesFields form={form} />
                  </TabsContent> */}
                </Tabs>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">
                  {editId ? "Update Lesson Plan" : "Create Lesson Plan"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </>
  );
}
                     