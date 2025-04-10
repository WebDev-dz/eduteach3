"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "../../components/app-sidebar"
import { SiteHeader } from "../../components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { DownloadIcon, FilterIcon, PencilIcon, SearchIcon, UploadIcon } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { useSession } from "next-auth/react"
import { Skeleton } from "@/components/ui/skeleton"
import { useClasses } from "@/services/class-service"
import { useGrades } from "@/services/grade-service"
import { toast } from "sonner"

export default function GradesPage() {
  const { data: session } = useSession()
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  // Use TanStack Query to fetch classes
  const { data: classes = [], isLoading: isLoadingClasses, isError: isErrorClasses } = useClasses(session?.user?.id)

  // Set initial selected class and subject when classes are loaded
  useEffect(() => {
    if (classes.length > 0 && !selectedClass) {
      setSelectedClass(classes[0].id)
      setSelectedSubject(classes[0].subject)
    }
  }, [classes, selectedClass])

  // Use TanStack Query to fetch grades based on selected class and subject
  const {
    data: grades = [],
    isLoading: isLoadingGrades,
    isError: isErrorGrades,
  } = useGrades(selectedClass)

  // Use TanStack Query to fetch grade distribution
  // const {
  //   data: gradeDistribution = [],
  //   isLoading: isLoadingDistribution,
  //   isError: isErrorDistribution,
  // } = useGradeDistribution(selectedClass, {
  //   enabled: !!selectedClass,
  // })

  // Show error toasts if queries fail
  useEffect(() => {
    if (isErrorClasses) {
      toast.error("Failed to fetch classes")
    }
    if (isErrorGrades) {
      toast.error("Failed to fetch grades")
    }
  }, [isErrorClasses, isErrorGrades])

  const filteredGrades = grades.filter((grade) => grade.studentName.toLowerCase().includes(searchQuery.toLowerCase()))

  const isLoading = isLoadingClasses || isLoadingGrades

  const selectedClassObj = classes.find((c) => c.id === selectedClass)
  const selectedClassName = selectedClassObj?.name || ""
  const selectedSubjectName = selectedClassObj?.subject || ""

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Grades" />
        <div className="flex flex-1 flex-col p-4 md:p-6 gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Grade Book</h1>
            <div className="flex gap-2">
              <Button variant="outline">
                <UploadIcon className="mr-2 h-4 w-4" />
                Import
              </Button>
              <Button variant="outline">
                <DownloadIcon className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Class Average</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className="text-3xl font-bold">{calculateClassAverage(filteredGrades)}%</div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Highest Grade</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className="text-3xl font-bold">{calculateHighestGrade(filteredGrades)}%</div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Lowest Grade</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className="text-3xl font-bold">{calculateLowestGrade(filteredGrades)}%</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* <Card>
            <CardHeader>
              <CardTitle>Grade Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-60">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Skeleton className="h-40 w-full" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={gradeDistribution}>
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card> */}

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="relative w-full md:w-96">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search students..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="w-full md:w-40">
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger className="w-full md:w-40">
                      <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes
                        .filter((c) => c.id === selectedClass)
                        .map((c) => (
                          <SelectItem key={c.subject} value={c.subject}>
                            {c.subject}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <FilterIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Assignment</TableHead>
                  <TableHead>Score</TableHead>
                 
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton className="h-4 w-32" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-16" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-8" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-8" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-8" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-8" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-12" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-8 w-8 ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                ) : filteredGrades.length > 0 ? (
                  filteredGrades.map((grade) => (
                    <TableRow key={grade.studentId}>
                      <TableCell>{grade.studentId}</TableCell>
                      <TableCell>{grade.studentName}</TableCell>
                      <TableCell>{grade.assignmentTitle}</TableCell>
                      <TableCell className="font-medium">{grade.score}%</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <PencilIcon className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-6">
                      No grades found for this class and subject.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

function calculateClassAverage(grades: any[]): number {
  if (grades.length === 0) return 0
  const sum = grades.reduce((acc, grade) => acc + grade.overall, 0)
  return Math.round(sum / grades.length)
}

function calculateHighestGrade(grades: any[]): number {
  if (grades.length === 0) return 0
  return Math.max(...grades.map((grade) => grade.overall))
}

function calculateLowestGrade(grades: any[]): number {
  if (grades.length === 0) return 0
  return Math.min(...grades.map((grade) => grade.overall))
}
