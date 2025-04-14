"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SiteHeader } from "../../../components/site-header";
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

  const handleAddObjective = () => {
    form.setValue("objectives", [...form.getValues("objectives"), ""]);
  };

  const handleObjectiveChange = (index: number, value: string) => {
    console.log(form.getValues("objectives"))
    const newObjectives = [...form.getValues("objectives")];
    newObjectives[index] = value;
    form.setValue("objectives", newObjectives);
  };

  const handleRemoveObjective = (index: number) => {
    if (form.getValues("objectives").length > 1) {
      console.log(form.getValues("objectives"));
      const newObjectives = [...form.getValues("objectives")];
      newObjectives.splice(index, 1);
      form.setValue("objectives", newObjectives);
    }
  };



  const onSubmit = async (data: z.infer<typeof lessonPlanInsertSchema>) => {
    console.log({data});
    await createLessonPlan.mutate(data);
  };

  return (
    <>
<<<<<<< HEAD
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
=======
        <SiteHeader title={editId ? "Edit Lesson Plan" : "Create Lesson Plan"} />
        <div className="flex flex-1 flex-col p-4 md:p-6 gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">{editId ? "Edit Lesson Plan" : "Create Lesson Plan"}</h1>
          </div>
>>>>>>> 2f69deac4efb7941a4a0c04648c119e963a7504b

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
                    <TabsTrigger value="resources">
                      Resources & Assessment
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4 pt-4">
                    <FormField
                      name="title"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <Label htmlFor="title">Lesson Title</Label>
                          <Input
                            id="title"
                            placeholder="Enter a descriptive title for your lesson"
                            {...field}
                            required
                          />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        name="subject"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Select {...field} onValueChange={field.onChange} required>
                              <SelectTrigger id="subject">
                                <SelectValue placeholder="Select subject" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Mathematics">
                                  Mathematics
                                </SelectItem>
                                <SelectItem value="English">English</SelectItem>
                                <SelectItem value="Science">Science</SelectItem>
                                <SelectItem value="History">History</SelectItem>
                                <SelectItem value="Art">Art</SelectItem>
                                <SelectItem value="Music">Music</SelectItem>
                                <SelectItem value="Physical Education">
                                  Physical Education
                                </SelectItem>
                                <SelectItem value="Computer Science">
                                  Computer Science
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        name="gradeLevel"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <Label htmlFor="grade-level">Grade Level</Label>
                            <Select
                              {...field}
                              onValueChange={field.onChange}
                              required
                            >
                              <SelectTrigger id="grade-level">
                                <SelectValue placeholder="Select grade level" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Grade 9">Grade 9</SelectItem>
                                <SelectItem value="Grade 10">
                                  Grade 10
                                </SelectItem>
                                <SelectItem value="Grade 11">
                                  Grade 11
                                </SelectItem>
                                <SelectItem value="Grade 12">
                                  Grade 12
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        name="duration"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <Label htmlFor="duration">Duration (minutes)</Label>
                            <Input
                              id="duration"
                              type="number"
                              min="1"
                              placeholder="e.g., 60"
                              {...field}
                              required
                            />
                          </FormItem>
                        )}
                      />

                      <FormField
                        name="date"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input {...field} id="date" type="date" required />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      name="objectives"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <Label>Learning Objectives</Label>
                          <p className="text-sm text-muted-foreground">
                            What students will know or be able to do after this
                            lesson
                          </p>
                          <div className="space-y-2">
                            {field.value.map((objective, index) => (
                              <div key={index} className="flex gap-2">
                                <Input
                                  placeholder={`Objective ${index + 1}`}
                                  value={objective}
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
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleAddObjective}
                            className="mt-2"
                          >
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Add Objective
                          </Button>
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  <TabsContent value="procedure" className="space-y-4 pt-4">
                    <FormField
                      name="introduction"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <Label htmlFor="introduction">
                            Introduction / Warm-up
                          </Label>
                          <Textarea
                            id="introduction"
                            placeholder="Describe how you will begin the lesson and engage students"
                            rows={4}
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            required
                          />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="mainActivity"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <Label htmlFor="main-activity">Main Activity</Label>
                          <Textarea
                            id="main-activity"
                            placeholder="Describe the main learning activities and teaching strategies"
                            rows={6}
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            required
                          />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="conclusion"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <Label htmlFor="conclusion">
                            Conclusion / Wrap-up
                          </Label>
                          <Textarea
                            id="conclusion"
                            placeholder="Describe how you will conclude the lesson and reinforce learning"
                            rows={4}
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            required
                          />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="procedure.conclusion"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="differentiation" />
                            <Label htmlFor="differentiation">
                              Include differentiation strategies
                            </Label>
                          </div>
                          <Textarea
                            id="differentiation-strategies"
                            placeholder="Describe how you will adapt the lesson for different learning needs"
                            rows={3}
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  <TabsContent value="resources" className="space-y-4 pt-4">
                    {/* <FormField
                      name="materials"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <Label>Materials Needed</Label>
                          <div className="space-y-2">
                            {field.value?.map((material, index) => (
                              <div key={index} className="flex gap-2">
                                <Input
                                  placeholder={`Material ${index + 1}`}
                                  value={material}
                                  onChange={(e) =>
                                    field.onChange(e.target.value)
                                  }
                                  required
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleRemoveMaterial(index)}
                                  disabled={materials.length <= 1}
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleAddMaterial}
                            className="mt-2"
                          >
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Add Material
                          </Button>
                        </FormItem>
                      )}
                    /> */}

                    <FormItem className="space-y-2">
                      <Label htmlFor="resources">Additional Resources</Label>
                      <Input id="resources" type="file" multiple />
                      <p className="text-sm text-muted-foreground mt-1">
                        Upload worksheets, presentations, or other resources for
                        this lesson.
                      </p>
                    </FormItem>
                    <FormField
                      name="assessment"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <Label htmlFor="assessment">Assessment</Label>
                          <Textarea
                            id="assessment"
                            placeholder="Describe how you will assess student learning"
                            rows={4}
                            {...field}
                            value={field.value || ""}
                            required
                          />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="notes"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <Label htmlFor="notes">Teacher Notes</Label>
                          <Textarea
                            id="notes"
                            placeholder="Add any additional notes or reminders for yourself"
                            rows={3}
                            {...field}
                            value={field.value || ""}
                          />
                        </FormItem>
                      )}
                    />

                    {/* <FormField
                    name = "standards"
                    control = {form.control}
                    render = {({field} ) => (<FormItem className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox {...field} id="standards" />
                        <Label htmlFor="standards">
                          Align with curriculum standards
                        </Label>
                      </div>
                      <Select {...field}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select standards" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="common-core">
                            Common Core Standards
                          </SelectItem>
                          <SelectItem value="ngss">
                            Next Generation Science Standards
                          </SelectItem>
                          <SelectItem value="state">
                            State-Specific Standards
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>)}
                    /> */}
                  </TabsContent>
                  
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" type="button">
                    Save as Draft
                  </Button>
                  <Button type="submit" disabled={createLessonPlan.isPending}>
                    {createLessonPlan.isPending ? (
                      <>Saving Lesson Plan...</>
                    ) : (
                      <>
                        <BookIcon className="mr-2 h-4 w-4" />
                        {editId ? "Update Lesson Plan" : "Create Lesson Plan"}
                      </>
                    )}
                  </Button>
                </div>
              </CardFooter>
            </form>
<<<<<<< HEAD
          </Form>
        </Card>
      </div>
    </>
  );
=======
          </Card>
        </div>
      </>
  )
>>>>>>> 2f69deac4efb7941a4a0c04648c119e963a7504b
}
