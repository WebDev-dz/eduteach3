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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeftIcon, MessageSquareIcon } from "lucide-react"

export default function LessonPlanConsultPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [consultationType, setConsultationType] = useState("new-plan")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/lesson-plans")
    }, 1000)
  }

  return (
    <>me="flex flex-1 flex-col p-4 md:p-6 gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Request Lesson Plan Consultation</h1>
          </div>

          <Card className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Consultation Request</CardTitle>
                <CardDescription>
                  Get expert help with creating or improving your lesson plans. Our curriculum specialists will provide
                  personalized guidance.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Consultation Type</Label>
                  <RadioGroup
                    defaultValue="new-plan"
                    value={consultationType}
                    onValueChange={setConsultationType}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2"
                  >
                    <div>
                      <RadioGroupItem value="new-plan" id="new-plan" className="peer sr-only" />
                      <Label
                        htmlFor="new-plan"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <span>New Lesson Plan</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="review" id="review" className="peer sr-only" />
                      <Label
                        htmlFor="review"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <span>Review Existing Plan</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="curriculum" id="curriculum" className="peer sr-only" />
                      <Label
                        htmlFor="curriculum"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <span>Curriculum Alignment</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select required>
                      <SelectTrigger id="subject">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mathematics">Mathematics</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="science">Science</SelectItem>
                        <SelectItem value="history">History</SelectItem>
                        <SelectItem value="art">Art</SelectItem>
                        <SelectItem value="music">Music</SelectItem>
                        <SelectItem value="physical-education">Physical Education</SelectItem>
                        <SelectItem value="computer-science">Computer Science</SelectItem>
                        <SelectItem value="foreign-language">Foreign Language</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="grade-level">Grade Level</Label>
                    <Select required>
                      <SelectTrigger id="grade-level">
                        <SelectValue placeholder="Select grade level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grade-9">Grade 9</SelectItem>
                        <SelectItem value="grade-10">Grade 10</SelectItem>
                        <SelectItem value="grade-11">Grade 11</SelectItem>
                        <SelectItem value="grade-12">Grade 12</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="topic">Topic or Lesson Title</Label>
                  <Input id="topic" placeholder="Enter the main topic or title of your lesson" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="objectives">Learning Objectives</Label>
                  <Textarea
                    id="objectives"
                    placeholder="What should students know or be able to do after this lesson?"
                    rows={3}
                    required
                  />
                </div>

                {consultationType === "review" && (
                  <div className="space-y-2">
                    <Label htmlFor="existing-plan">Upload Existing Lesson Plan</Label>
                    <Input id="existing-plan" type="file" accept=".pdf,.doc,.docx" />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="specific-needs">Specific Consultation Needs</Label>
                  <Textarea
                    id="specific-needs"
                    placeholder="Describe what specific help you need with this lesson plan"
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Areas of Focus (Select all that apply)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="focus-engagement" />
                      <Label htmlFor="focus-engagement">Student Engagement</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="focus-differentiation" />
                      <Label htmlFor="focus-differentiation">Differentiation Strategies</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="focus-assessment" />
                      <Label htmlFor="focus-assessment">Assessment Methods</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="focus-technology" />
                      <Label htmlFor="focus-technology">Technology Integration</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="focus-standards" />
                      <Label htmlFor="focus-standards">Standards Alignment</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="focus-activities" />
                      <Label htmlFor="focus-activities">Learning Activities</Label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timeline">Timeline</Label>
                    <Select required>
                      <SelectTrigger id="timeline">
                        <SelectValue placeholder="When do you need this?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="urgent">Urgent (1-2 days)</SelectItem>
                        <SelectItem value="standard">Standard (3-5 days)</SelectItem>
                        <SelectItem value="flexible">Flexible (1-2 weeks)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="consultation-method">Preferred Consultation Method</Label>
                    <Select required>
                      <SelectTrigger id="consultation-method">
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="written">Written Feedback</SelectItem>
                        <SelectItem value="video-call">Video Call</SelectItem>
                        <SelectItem value="phone">Phone Call</SelectItem>
                        <SelectItem value="in-person">In-Person Meeting</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" required />
                    <Label htmlFor="terms">
                      I understand that a curriculum specialist will contact me to schedule the consultation.
                    </Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>Submitting Request...</>
                  ) : (
                    <>
                      <MessageSquareIcon className="mr-2 h-4 w-4" />
                      Submit Consultation Request
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </>
  )
}
