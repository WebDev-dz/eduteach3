"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { ArrowLeftIcon, SaveIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { useClass, useUpdateClass } from "@/services/class-service"

export default function EditClassPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data: session } = useSession()
  const [formData, setFormData] = useState({
    id: params.id,
    name: "",
    subject: "",
    gradeLevel: "",
    academicYear: "",
    schedule: "",
    room: "",
    capacity: "",
    description: "",
    isActive: true,
  })

  // Use TanStack Query to fetch class details
  const { data: classData, isLoading, isError } = useClass(params.id)

  // Use TanStack Query for update mutation
  const updateClassMutation = useUpdateClass()

  // Update form data when class data is loaded
  useEffect(() => {
    if (classData) {
      setFormData({
        id: classData.id,
        name: classData.name,
        subject: classData.subject,
        gradeLevel: classData.gradeLevel,
        academicYear: classData.academicYear,
        schedule: classData.schedule || "",
        room: classData.room || "",
        capacity: classData.capacity ? String(classData.capacity) : "",
        description: classData.description || "",
        isActive: classData.isActive,
      })
    }
  }, [classData])

  // Show error toast if query fails
  useEffect(() => {
    if (isError) {
      toast.error("Failed to fetch class details")
      router.push("/classes")
    }
  }, [isError, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [id]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session?.user?.id) {
      toast.error("You must be logged in to update a class")
      return
    }

    updateClassMutation.mutate(
      {
        ...formData,
        capacity: formData.capacity ? Number.parseInt(formData.capacity) : undefined,
        teacherId: session.user.id,
      },
      {
        onSuccess: () => {
          router.push("/classes")
        },
      },
    )
  }

  return (
    <>
        <SiteHeader title="Edit Class" />
        <div className="flex flex-1 flex-col p-4 md:p-6 gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Edit Class</h1>
          </div>

          <Card className="max-w-3xl mx-auto">
            {isLoading ? (
              <div className="p-6 space-y-4">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
                <div className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>Class Information</CardTitle>
                  <CardDescription>Update the details for this class.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Class Name</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Class 9A"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Select
                        value={formData.subject}
                        onValueChange={(value) => handleSelectChange("subject", value)}
                        required
                      >
                        <SelectTrigger id="subject">
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mathematics">Mathematics</SelectItem>
                          <SelectItem value="English Literature">English Literature</SelectItem>
                          <SelectItem value="Science">Science</SelectItem>
                          <SelectItem value="Physics">Physics</SelectItem>
                          <SelectItem value="Chemistry">Chemistry</SelectItem>
                          <SelectItem value="Biology">Biology</SelectItem>
                          <SelectItem value="History">History</SelectItem>
                          <SelectItem value="Geography">Geography</SelectItem>
                          <SelectItem value="Computer Science">Computer Science</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gradeLevel">Grade Level</Label>
                      <Select
                        value={formData.gradeLevel}
                        onValueChange={(value) => handleSelectChange("gradeLevel", value)}
                        required
                      >
                        <SelectTrigger id="gradeLevel">
                          <SelectValue placeholder="Select grade level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Grade 9">Grade 9</SelectItem>
                          <SelectItem value="Grade 10">Grade 10</SelectItem>
                          <SelectItem value="Grade 11">Grade 11</SelectItem>
                          <SelectItem value="Grade 12">Grade 12</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="academicYear">Academic Year</Label>
                      <Select
                        value={formData.academicYear}
                        onValueChange={(value) => handleSelectChange("academicYear", value)}
                        required
                      >
                        <SelectTrigger id="academicYear">
                          <SelectValue placeholder="Select academic year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2023-2024">2023-2024</SelectItem>
                          <SelectItem value="2024-2025">2024-2025</SelectItem>
                          <SelectItem value="2025-2026">2025-2026</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="schedule">Class Schedule</Label>
                    <Input
                      id="schedule"
                      placeholder="e.g., Mon, Wed, Fri - 9:00 AM"
                      value={formData.schedule}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="room">Classroom</Label>
                    <Input id="room" placeholder="e.g., Room 101" value={formData.room} onChange={handleChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="capacity">Maximum Capacity</Label>
                    <Input
                      id="capacity"
                      type="number"
                      min="1"
                      placeholder="e.g., 30"
                      value={formData.capacity}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter a brief description of the class"
                      rows={3}
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked) => handleCheckboxChange("isActive", checked as boolean)}
                      />
                      <Label htmlFor="isActive">Active Class</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Inactive classes won't appear in the active classes list.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" type="button" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updateClassMutation.isPending}>
                    {updateClassMutation.isPending ? (
                      <>Updating Class...</>
                    ) : (
                      <>
                        <SaveIcon className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            )}
          </Card>
        </div>
      </>
  )
}
