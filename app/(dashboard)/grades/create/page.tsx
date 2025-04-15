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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeftIcon, LineChartIcon } from "lucide-react"

export default function CreateGradePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [entryType, setEntryType] = useState("individual")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/grades")
    }, 1000)
  }

  return (
    <>
        <SiteHeader title="Add Grade Entry" />
        <div className="flex flex-1 flex-col p-4 md:p-6 gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Add Grade Entry</h1>
          </div>

          <Card className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Grade Information</CardTitle>
                <CardDescription>Add new grades for students.</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="individual" value={entryType} onValueChange={setEntryType} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="individual">Individual Student</TabsTrigger>
                    <TabsTrigger value="bulk">Bulk Entry</TabsTrigger>
                  </TabsList>

                  <TabsContent value="individual" className="space-y-4 pt-4">
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
                      <Label htmlFor="student">Student</Label>
                      <Select required>
                        <SelectTrigger id="student">
                          <SelectValue placeholder="Select student" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="s001">Emma Thompson</SelectItem>
                          <SelectItem value="s002">James Wilson</SelectItem>
                          <SelectItem value="s003">Sophia Martinez</SelectItem>
                          <SelectItem value="s004">Liam Johnson</SelectItem>
                          <SelectItem value="s005">Olivia Davis</SelectItem>
                          <SelectItem value="s006">Noah Smith</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="assignment">Assignment/Test</Label>
                        <Select required>
                          <SelectTrigger id="assignment">
                            <SelectValue placeholder="Select assignment" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="assignment1">Assignment 1</SelectItem>
                            <SelectItem value="assignment2">Assignment 2</SelectItem>
                            <SelectItem value="quiz1">Quiz 1</SelectItem>
                            <SelectItem value="midterm">Midterm</SelectItem>
                            <SelectItem value="final">Final Exam</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input id="date" type="date" required />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="score">Score</Label>
                        <Input id="score" type="number" min="0" placeholder="Enter score" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="max-score">Maximum Score</Label>
                        <Input id="max-score" type="number" min="1" placeholder="Enter maximum score" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="comments">Comments</Label>
                      <Textarea id="comments" placeholder="Enter any comments or feedback" rows={3} />
                    </div>
                  </TabsContent>

                  <TabsContent value="bulk" className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bulk-class">Class</Label>
                        <Select required>
                          <SelectTrigger id="bulk-class">
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
                        <Label htmlFor="bulk-subject">Subject</Label>
                        <Select required>
                          <SelectTrigger id="bulk-subject">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bulk-assignment">Assignment/Test</Label>
                        <Select required>
                          <SelectTrigger id="bulk-assignment">
                            <SelectValue placeholder="Select assignment" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="assignment1">Assignment 1</SelectItem>
                            <SelectItem value="assignment2">Assignment 2</SelectItem>
                            <SelectItem value="quiz1">Quiz 1</SelectItem>
                            <SelectItem value="midterm">Midterm</SelectItem>
                            <SelectItem value="final">Final Exam</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bulk-date">Date</Label>
                        <Input id="bulk-date" type="date" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bulk-max-score">Maximum Score</Label>
                      <Input id="bulk-max-score" type="number" min="1" placeholder="Enter maximum score" required />
                    </div>

                    <div className="space-y-2">
                      <Label>Student Scores</Label>
                      <div className="border rounded-md">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Student</TableHead>
                              <TableHead>ID</TableHead>
                              <TableHead>Score</TableHead>
                              <TableHead>Comments</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {[
                              { id: "S001", name: "Emma Thompson" },
                              { id: "S002", name: "James Wilson" },
                              { id: "S003", name: "Sophia Martinez" },
                              { id: "S004", name: "Liam Johnson" },
                              { id: "S005", name: "Olivia Davis" },
                            ].map((student) => (
                              <TableRow key={student.id}>
                                <TableCell>{student.name}</TableCell>
                                <TableCell>{student.id}</TableCell>
                                <TableCell>
                                  <Input type="number" min="0" placeholder="Score" />
                                </TableCell>
                                <TableCell>
                                  <Input placeholder="Comments" />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bulk-upload">Or Upload CSV File</Label>
                      <Input id="bulk-upload" type="file" accept=".csv" />
                      <p className="text-sm text-muted-foreground mt-1">
                        Upload a CSV file with columns: Student ID, Score, Comments (optional)
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>Saving Grades...</>
                  ) : (
                    <>
                      <LineChartIcon className="mr-2 h-4 w-4" />
                      Save Grades
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
