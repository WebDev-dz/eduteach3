"use client"

import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useClass, useStudentsInClass } from "@/services/class-service"
import { useAssignmentsByClass } from "@/services/assignment-service"
import { useMaterialsByClass } from "@/services/material-service"
import { useLessonPlansByClass } from "@/services/lesson-plan-service"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { DeleteDialog } from "@/components/delete-dialog"
import {
  ArrowLeftIcon,
  CalendarIcon,
  EditIcon,
  FileTextIcon,
  GraduationCapIcon,
  LayoutDashboardIcon,
  ListChecksIcon,
  PlusIcon,
  TrashIcon,
  UsersIcon,
} from "lucide-react"
import { useDeleteClass } from "@/services/class-service"
import Link from "next/link"
import { formatDate } from "date-fns"

export default function ClassDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const classId = params.id as string

  // Fetch class data
  const { data: classData, isLoading: isLoadingClass, isError: isClassError } = useClass(classId)

  // Fetch students in class
  const { data: students, isLoading: isLoadingStudents } = useStudentsInClass(classId)

  // Fetch assignments for class
  const { data: assignments, isLoading: isLoadingAssignments } = useAssignmentsByClass(classId)

  // Fetch materials for class
  const { data: materials, isLoading: isLoadingMaterials } = useMaterialsByClass(classId)

  // Fetch lesson plans for class
  const { data: lessonPlans, isLoading: isLoadingLessonPlans } = useLessonPlansByClass(classId)

  // Delete class mutation
  const { mutate: deleteClassMutation, isPending: isDeletingClass } = useDeleteClass()

  // Handle delete class
  const handleDeleteClass = async () => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to delete a class")
      return
    }

    deleteClassMutation(classId, {
      onSuccess: () => {
        router.push("/classes")
      },
    })
  }

  // Handle error
  if (isClassError) {
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader title="Class Details" />
          <div className="flex flex-1 flex-col p-4 md:p-6 gap-4 items-center justify-center">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Error</CardTitle>
                <CardDescription>Failed to load class details</CardDescription>
              </CardHeader>
              <CardContent>
                <p>There was an error loading the class details. Please try again later.</p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => router.push("/classes")}>
                  <ArrowLeftIcon className="mr-2 h-4 w-4" />
                  Back to Classes
                </Button>
              </CardFooter>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  return (
    <>
        <SiteHeader title={classData?.name || "Class Details"} />
        <div className="flex flex-1 flex-col p-4 md:p-6 gap-4">
          {/* Header with actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => router.back()}>
                <ArrowLeftIcon className="h-4 w-4" />
              </Button>
              {isLoadingClass ? (
                <Skeleton className="h-8 w-48" />
              ) : (
                <h1 className="text-2xl font-bold">{classData?.name}</h1>
              )}
              {isLoadingClass ? (
                <Skeleton className="h-6 w-24" />
              ) : classData?.isActive ? (
                <Badge variant="default">Active</Badge>
              ) : (
                <Badge variant="secondary">Inactive</Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link href={`/classes/edit/${classId}`}>
                  <EditIcon className="mr-2 h-4 w-4" />
                  Edit Class
                </Link>
              </Button>
              <DeleteDialog
                title="Delete Class"
                description="Are you sure you want to delete this class? This action cannot be undone and will remove all associated data."
                onDelete={handleDeleteClass}
                trigger={
                  <Button variant="destructive">
                    <TrashIcon className="mr-2 h-4 w-4" />
                    Delete Class
                  </Button>
                }
              />
            </div>
          </div>

          {/* Class details */}
          <Card>
            <CardHeader>
              <CardTitle>Class Information</CardTitle>
              <CardDescription>Details about this class</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isLoadingClass ? (
                <>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-48" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-48" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-48" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-48" />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Subject</p>
                    <p className="text-base">{classData?.subject}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Grade Level</p>
                    <p className="text-base">{classData?.gradeLevel}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Academic Year</p>
                    <p className="text-base">{classData?.academicYear}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Schedule</p>
                    <p className="text-base">{classData?.schedule || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Room</p>
                    <p className="text-base">{classData?.room || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Capacity</p>
                    <p className="text-base">{classData?.capacity || "Not specified"}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Description</p>
                    <p className="text-base">{classData?.description || "No description provided"}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Tabs for different sections */}
          <Tabs defaultValue="students" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:w-[600px]">
              <TabsTrigger value="students">
                <UsersIcon className="mr-2 h-4 w-4" />
                Students
              </TabsTrigger>
              <TabsTrigger value="assignments">
                <ListChecksIcon className="mr-2 h-4 w-4" />
                Assignments
              </TabsTrigger>
              <TabsTrigger value="materials">
                <FileTextIcon className="mr-2 h-4 w-4" />
                Materials
              </TabsTrigger>
              <TabsTrigger value="lesson-plans">
                <GraduationCapIcon className="mr-2 h-4 w-4" />
                Lesson Plans
              </TabsTrigger>
            </TabsList>

            {/* Students Tab */}
            <TabsContent value="students" className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Students</CardTitle>
                    <CardDescription>Students enrolled in this class</CardDescription>
                  </div>
                  <Button asChild>
                    <Link href={`/students/add?classId=${classId}`}>
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Add Student
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  {isLoadingStudents ? (
                    <div className="space-y-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : students && students.length > 0 ? (
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-4">
                        {students.map((student) => (
                          <div key={student.studentId} className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <Avatar>
                                <AvatarFallback>
                                  {student.firstName.charAt(0) + student.lastName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{`${student.firstName} ${student.lastName}`}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/students/${student.studentId}`}>View</Link>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <UsersIcon className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No students enrolled in this class yet</p>
                      <Button className="mt-4" asChild>
                        <Link href={`/students/add?classId=${classId}`}>
                          <PlusIcon className="mr-2 h-4 w-4" />
                          Add Student
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Assignments Tab */}
            <TabsContent value="assignments" className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Assignments</CardTitle>
                    <CardDescription>Assignments for this class</CardDescription>
                  </div>
                  <Button asChild>
                    <Link href={`/assignments/create?classId=${classId}`}>
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Create Assignment
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  {isLoadingAssignments ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                          <Skeleton className="h-6 w-48" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-24" />
                          <Separator className="my-2" />
                        </div>
                      ))}
                    </div>
                  ) : assignments && assignments.length > 0 ? (
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-4">
                        {assignments.map((assignment) => (
                          <div key={assignment.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium">{assignment.title}</h3>
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/assignments/${assignment.id}`}>View</Link>
                              </Button>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {assignment.description || "No description provided"}
                            </p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{assignment.points} points</Badge>
                              <Badge variant="outline">Due: {formatDate(assignment.dueDate, "dd/MM/yyyy")}</Badge>
                            </div>
                            <Separator className="my-2" />
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <ListChecksIcon className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No assignments created for this class yet</p>
                      <Button className="mt-4" asChild>
                        <Link href={`/assignments/create?classId=${classId}`}>
                          <PlusIcon className="mr-2 h-4 w-4" />
                          Create Assignment
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Materials Tab */}
            <TabsContent value="materials" className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Materials</CardTitle>
                    <CardDescription>Learning materials for this class</CardDescription>
                  </div>
                  <Button asChild>
                    <Link href={`/materials/create?classId=${classId}`}>
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Add Material
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  {isLoadingMaterials ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                          <Skeleton className="h-6 w-48" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-24" />
                          <Separator className="my-2" />
                        </div>
                      ))}
                    </div>
                  ) : materials && materials.length > 0 ? (
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-4">
                        {materials.map((material) => (
                          <div key={material.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium">{material.title}</h3>
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/materials/${material.id}`}>View</Link>
                              </Button>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {material.description || "No description provided"}
                            </p>
                            <Badge variant="outline">{material.type}</Badge>
                            <Separator className="my-2" />
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <FileTextIcon className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No materials added for this class yet</p>
                      <Button className="mt-4" asChild>
                        <Link href={`/materials/create?classId=${classId}`}>
                          <PlusIcon className="mr-2 h-4 w-4" />
                          Add Material
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Lesson Plans Tab */}
            <TabsContent value="lesson-plans" className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Lesson Plans</CardTitle>
                    <CardDescription>Lesson plans for this class</CardDescription>
                  </div>
                  <Button asChild>
                    <Link href={`/lesson-plans/create?classId=${classId}`}>
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Create Lesson Plan
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  {isLoadingLessonPlans ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                          <Skeleton className="h-6 w-48" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-24" />
                          <Separator className="my-2" />
                        </div>
                      ))}
                    </div>
                  ) : lessonPlans && lessonPlans.length > 0 ? (
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-4">
                        {lessonPlans.map((plan) => (
                          <div key={plan.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium">{plan.title}</h3>
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/lesson-plans/details/${plan.id}`}>View</Link>
                              </Button>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {plan.description || "No description provided"}
                            </p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{formatDate(plan.date, "dd/MM/yyyy")}</Badge>
                              <Badge variant="outline">{plan.duration} minutes</Badge>
                            </div>
                            <Separator className="my-2" />
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <GraduationCapIcon className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No lesson plans created for this class yet</p>
                      <Button className="mt-4" asChild>
                        <Link href={`/lesson-plans/create?classId=${classId}`}>
                          <PlusIcon className="mr-2 h-4 w-4" />
                          Create Lesson Plan
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common actions for this class</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto py-4 justify-start" asChild>
                  <Link href={`/calendar?classId=${classId}`}>
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    <div className="text-left">
                      <p className="font-medium">View Calendar</p>
                      <p className="text-sm text-muted-foreground">See scheduled events</p>
                    </div>
                  </Link>
                </Button>
                <Button variant="outline" className="h-auto py-4 justify-start" asChild>
                  <Link href={`/grades?classId=${classId}`}>
                    <LayoutDashboardIcon className="h-5 w-5 mr-2" />
                    <div className="text-left">
                      <p className="font-medium">Grade Book</p>
                      <p className="text-sm text-muted-foreground">Manage student grades</p>
                    </div>
                  </Link>
                </Button>
                <Button variant="outline" className="h-auto py-4 justify-start" asChild>
                  <Link href={`/lesson-plans/consult?classId=${classId}`}>
                    <GraduationCapIcon className="h-5 w-5 mr-2" />
                    <div className="text-left">
                      <p className="font-medium">AI Lesson Planning</p>
                      <p className="text-sm text-muted-foreground">Get AI assistance</p>
                    </div>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
  )
}
