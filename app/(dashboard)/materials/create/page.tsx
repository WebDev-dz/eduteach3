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
import { ArrowLeftIcon, FileUpIcon } from "lucide-react"

export default function CreateMaterialPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [materialType, setMaterialType] = useState("document")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/materials")
    }, 1000)
  }

  return (
    <>
        <SiteHeader title="Upload Teaching Material" />
        <div className="flex flex-1 flex-col p-4 md:p-6 gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Upload Teaching Material</h1>
          </div>

          <Card className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Material Details</CardTitle>
                <CardDescription>Upload a new teaching material for your classes.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Material Name</Label>
                  <Input id="name" placeholder="Enter material name" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Material Type</Label>
                    <Select value={materialType} onValueChange={setMaterialType} required>
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select material type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lesson-plan">Lesson Plan</SelectItem>
                        <SelectItem value="worksheet">Worksheet</SelectItem>
                        <SelectItem value="presentation">Presentation</SelectItem>
                        <SelectItem value="document">Document</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="audio">Audio</SelectItem>
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
                        <SelectItem value="geography">Geography</SelectItem>
                        <SelectItem value="computer-science">Computer Science</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="grade-level">Grade Level</Label>
                    <Select required>
                      <SelectTrigger id="grade-level">
                        <SelectValue placeholder="Select grade level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="9">Grade 9</SelectItem>
                        <SelectItem value="10">Grade 10</SelectItem>
                        <SelectItem value="11">Grade 11</SelectItem>
                        <SelectItem value="12">Grade 12</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="class">Associated Class (Optional)</Label>
                    <Select>
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Enter a brief description of the material" rows={3} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">Upload File</Label>
                  <Input
                    id="file"
                    type="file"
                    accept={
                      materialType === "image"
                        ? "image/*"
                        : materialType === "video"
                          ? "video/*"
                          : materialType === "audio"
                            ? "audio/*"
                            : materialType === "presentation"
                              ? ".ppt,.pptx,.key"
                              : ".pdf,.doc,.docx,.txt,.xls,.xlsx"
                    }
                    required
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    {materialType === "image" && "Accepted formats: JPG, PNG, GIF, etc."}
                    {materialType === "video" && "Accepted formats: MP4, MOV, AVI, etc."}
                    {materialType === "audio" && "Accepted formats: MP3, WAV, etc."}
                    {materialType === "presentation" && "Accepted formats: PPT, PPTX, KEY"}
                    {(materialType === "document" || materialType === "lesson-plan" || materialType === "worksheet") &&
                      "Accepted formats: PDF, DOC, DOCX, TXT, XLS, XLSX"}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="share-with-students" />
                    <Label htmlFor="share-with-students">Share with students</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="share-with-teachers" />
                    <Label htmlFor="share-with-teachers">Share with other teachers</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (Optional)</Label>
                  <Input id="tags" placeholder="Enter tags separated by commas" />
                  <p className="text-sm text-muted-foreground mt-1">Example: homework, review, exam prep</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>Uploading Material...</>
                  ) : (
                    <>
                      <FileUpIcon className="mr-2 h-4 w-4" />
                      Upload Material
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
