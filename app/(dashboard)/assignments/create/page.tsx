"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/shared/app-sidebar"
import { SiteHeader } from "@/components/shared/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeftIcon, ClipboardListIcon } from "lucide-react"

export default function CreateAssignmentPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [assignmentType, setAssignmentType] = useState("homework")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Get form data
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    const assignmentData = {
      title: formData.get("title") as string,
      type: assignmentType,
      classId: formData.get("class") as string,
      dueDate: new Date(`${formData.get("due-date")}T${formData.get("due-time")}`),
      totalPoints: Number.parseInt(formData.get("points") as string),
      estimatedTime: Number.parseInt((formData.get("estimated-time") as string) || "0"),
      instructions: formData.get("instructions") as string,
      allowLateSubmissions: formData.has("allow-late"),
      timeLimit: formData.has("time-limit")
        ? Number.parseInt((formData.get("time-limit-minutes") as string) || "0")
        : undefined,
      teacherId: "user-id", // This would come from authentication in a real app
    }

    try {
      // In a real app, this would call the assignment service
      // await assignmentClientService.createAssignment(assignmentData)

      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false)
        router.push("/assignments")
      }, 1000)
    } catch (error) {
      console.error("Error creating assignment:", error)
      setIsSubmitting(false)
    }
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
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Assignment Details</CardTitle>
                <CardDescription>Create a new assignment for your students.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Assignment Title</Label>
                  <Input id="title" placeholder="Enter assignment title" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="class">Class</Label>
                    <Select required>
                      <SelectTrigger id="class">
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="class-9a">Class 9A</SelectItem>
                        <SelectItem value="class-10b">Class 10B</SelectItem>
                        <SelectItem value="class-11c">Class 11C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select required>
                      <SelectTrigger id="subject">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mathematics">Mathematics</SelectItem>
                        <SelectItem value="english">English Literature</SelectItem>
                        <SelectItem value="physics">Physics</SelectItem>
                        <SelectItem value="chemistry">Chemistry</SelectItem>
                        <SelectItem value="biology">Biology</SelectItem>
                        <SelectItem value="history">History</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Assignment Type</Label>
                  <RadioGroup
                    defaultValue="homework"
                    value={assignmentType}
                    onValueChange={setAssignmentType}
                    className="grid grid-cols-2 gap-4 pt-2"
                  >
                    <div>
                      <RadioGroupItem value="homework" id="homework" className="peer sr-only" />
                      <Label
                        htmlFor="homework"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <span>Homework</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="quiz" id="quiz" className="peer sr-only" />
                      <Label
                        htmlFor="quiz"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <span>Quiz</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="test" id="test" className="peer sr-only" />
                      <Label
                        htmlFor="test"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <span>Test</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="project" id="project" className="peer sr-only" />
                      <Label
                        htmlFor="project"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <span>Project</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="due-date">Due Date</Label>
                    <Input id="due-date" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="due-time">Due Time</Label>
                    <Input id="due-time" type="time" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="points">Total Points</Label>
                    <Input id="points" type="number" min="1" placeholder="e.g., 100" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estimated-time">Estimated Completion Time (minutes)</Label>
                    <Input id="estimated-time" type="number" min="1" placeholder="e.g., 60" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructions">Instructions</Label>
                  <Textarea
                    id="instructions"
                    placeholder="Enter detailed instructions for the assignment"
                    rows={5}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resources">Resources (Optional)</Label>
                  <Input id="resources" type="file" multiple />
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload any resources or materials needed for this assignment.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="allow-late" />
                    <Label htmlFor="allow-late">Allow Late Submissions</Label>
                  </div>
                </div>

                {assignmentType === "quiz" || assignmentType === "test" ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="time-limit" />
                      <Label htmlFor="time-limit">Set Time Limit</Label>
                    </div>
                    <Input
                      id="time-limit-minutes"
                      type="number"
                      min="1"
                      placeholder="Time limit in minutes"
                      className="mt-2"
                    />
                  </div>
                ) : null}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
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
          </Card>
        </div>
      </SidebarInset>
    </>
  )
}
