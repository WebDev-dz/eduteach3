"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "../../../components/app-sidebar"
import { SiteHeader } from "../../../components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeftIcon, UserPlusIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import { useClasses } from "@/services/class-service"
import { useCreateStudent } from "@/services/student-service"
import { toast } from "sonner"

export default function CreateStudentPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    studentId: "",
    classId: "",
    enrollmentDate: "",
    previousSchool: "",
    specialNeeds: false,
    academicNotes: "",
    email: "",
    phone: "",
    address: "",
    emergencyContact: "",
    emergencyPhone: "",
    relationship: "",
  })

  // Use TanStack Query to fetch classes
  const { data: classes = [], isLoading: isLoadingClasses } = useClasses(session?.user?.id)

  // Use TanStack Query for create mutation
  const createStudentMutation = useCreateStudent()

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
      toast.error("You must be logged in to create a student")
      return
    }

    createStudentMutation.mutate(
      {
        ...formData,
        teacherId: session.user.id,
      },
      {
        onSuccess: () => {
          router.push("/students")
        },
      },
    )
  }

  return (
    <>
        <SiteHeader title="Add New Student" />
        <div className="flex flex-1 flex-col p-4 md:p-6 gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Add New Student</h1>
          </div>

          <Card className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Student Information</CardTitle>
                <CardDescription>Enter the details for the new student you want to add.</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="personal">Personal Info</TabsTrigger>
                    <TabsTrigger value="academic">Academic Info</TabsTrigger>
                    <TabsTrigger value="contact">Contact Info</TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal" className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          placeholder="Enter first name"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          placeholder="Enter last name"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select value={formData.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                          <SelectTrigger id="gender">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="studentId">Student ID</Label>
                      <Input
                        id="studentId"
                        placeholder="Enter student ID"
                        value={formData.studentId}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="academic" className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="classId">Class</Label>
                        <Select
                          value={formData.classId}
                          onValueChange={(value) => handleSelectChange("classId", value)}
                          required
                        >
                          <SelectTrigger id="classId">
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                          <SelectContent>
                            {classes.map((c) => (
                              <SelectItem key={c.id} value={c.id}>
                                {c.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="enrollmentDate">Enrollment Date</Label>
                        <Input
                          id="enrollmentDate"
                          type="date"
                          value={formData.enrollmentDate}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="previousSchool">Previous School (if applicable)</Label>
                      <Input
                        id="previousSchool"
                        placeholder="Enter previous school name"
                        value={formData.previousSchool}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="specialNeeds"
                          checked={formData.specialNeeds}
                          onCheckedChange={(checked) => handleCheckboxChange("specialNeeds", checked as boolean)}
                        />
                        <Label htmlFor="specialNeeds">Special Educational Needs</Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="academicNotes">Academic Notes</Label>
                      <Textarea
                        id="academicNotes"
                        placeholder="Enter any academic notes or special considerations"
                        rows={3}
                        value={formData.academicNotes}
                        onChange={handleChange}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="contact" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="student@school.edu"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        placeholder="Enter home address"
                        rows={2}
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                      <Input
                        id="emergencyContact"
                        placeholder="Enter emergency contact name"
                        value={formData.emergencyContact}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                      <Input
                        id="emergencyPhone"
                        placeholder="Enter emergency contact phone"
                        value={formData.emergencyPhone}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="relationship">Relationship to Student</Label>
                      <Input
                        id="relationship"
                        placeholder="e.g., Parent, Guardian"
                        value={formData.relationship}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createStudentMutation.isPending}>
                  {createStudentMutation.isPending ? (
                    <>Adding Student...</>
                  ) : (
                    <>
                      <UserPlusIcon className="mr-2 h-4 w-4" />
                      Add Student
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
