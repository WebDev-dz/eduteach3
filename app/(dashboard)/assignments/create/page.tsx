"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SiteHeader } from "@/components/shared/site-header"
import { SidebarInset } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeftIcon, ClipboardListIcon } from "lucide-react"
import { Form } from "@/components/ui"
import { useForm } from "react-hook-form"
import { defaultValues } from "@/lib/consts"
import { zodResolver } from "@hookform/resolvers/zod"
import { assignmentInsertSchema } from "@/lib/validation/insert"
import { z } from "zod"
import { useCreateAssignment } from "@/services/assignment-service"
import { AllowLateSubmissionsField, ClassIdField, DueDateField, InstructionsField, TimeLimitField, TitleField, TotalPointsField, TypeField } from "@/components/custom/assignemnts/form-fields"
import { useClasses } from '../../../../services/class-service';
import { useSession } from "next-auth/react"

export default function CreateAssignmentPage() {
  const router = useRouter()
  const session = useSession()
  const createAssignemnt = useCreateAssignment()
  const { data: classes } = useClasses(session?.data?.user?.id)
  const form = useForm({
    defaultValues: {...defaultValues.assignment.insert},
    resolver: zodResolver(assignmentInsertSchema)
  })

  useEffect(() => {
    form.reset({
      ...defaultValues.assignment.insert,
      estimatedTime: 0,
      timeLimit: 0,
      teacherId: session?.data?.user?.id!,
      createdAt: new Date(),
      updatedAt: new Date()
    })


  }, [session?.data?.user?.id])
  
  const onSubmit = async (data : z.infer<typeof assignmentInsertSchema>) => {

    if (!session?.data?.user?.id) return
    await createAssignemnt.mutate(data)

  }

  return (
    <>
      <SidebarInset>
        <SiteHeader title="Create New Assignment" />
        <div className="flex flex-1 flex-col p-4 md:p-6 gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Create New Assignment</h1>
          </div>

          <Card className="max-w-3xl mx-auto">
            <Form {...form}>
 
            <form onSubmit={form.handleSubmit(onSubmit, (errors) => {
              console.log(errors)
            })}>
              <CardHeader>
                <CardTitle>Assignment Details</CardTitle>
                <CardDescription>Create a new assignment for your students.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                
                <TitleField form = {form} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ClassIdField form = {form} data={{classes}} />
                 
                </div>

                <div className="space-y-2">
                  <TypeField form = {form} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <DueDateField form = {form} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="due-time">Due Time</Label>
                    <Input id="due-time" type="time" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TotalPointsField form = {form} />
                  <div className="space-y-2">
                    <Label htmlFor="estimated-time">Estimated Completion Time (minutes)</Label>
                    <Input id="estimated-time" type="number" min="1" placeholder="e.g., 60" />
                  </div>
                </div>

                <InstructionsField form = {form} />

                <div className="space-y-2">
                  <Label htmlFor="resources">Resources (Optional)</Label>
                  <Input id="resources" type="file" multiple />
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload any resources or materials needed for this assignment.
                  </p>
                </div>

                <AllowLateSubmissionsField form = {form} />

                {form.watch("type") === "quiz" || form.watch("type") === "test" ? (
                  <TimeLimitField form = {form} />
                ) : null}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createAssignemnt.isPending}>
                  {createAssignemnt.isPending ? (
                    <>Creating Assignment...</>
                  ) : (
                    <>
                      <ClipboardListIcon className="mr-2 h-4 w-4" />
                      Create Assignment
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
            </Form>
          </Card>
        </div>
      </SidebarInset>
    </>
  )
}
