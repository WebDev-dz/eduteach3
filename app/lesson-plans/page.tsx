"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "../../components/app-sidebar"
import { SiteHeader } from "../../components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  PlusIcon,
  CalendarIcon,
  ClockIcon,
  MoreHorizontalIcon,
  SearchIcon,
  FilterIcon,
  MessageSquareIcon,
  UsersIcon,
} from "lucide-react"
import { useSession } from "next-auth/react"
import { useLessonPlans } from "@/services/lesson-plan-service"
import { useClasses } from "@/services/class-service"
import { Skeleton } from "@/components/ui/skeleton"

export default function LessonPlansPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [selectedGrade, setSelectedGrade] = useState("all")

  // Use the lesson plans service to fetch data
  const { data: lessonPlans = [], isLoading: isLoadingPlans, isError: isErrorPlans } = useLessonPlans(session?.user?.id)

  // Use the classes service to get subjects for filtering
  const { data: classes = [], isLoading: isLoadingClasses } = useClasses(session?.user?.id)

  // Templates would typically come from a separate API endpoint, but for now we'll use static data
  // In a real app, you'd have a useTemplates hook or similar
  const templates = [
    {
      id: "101",
      title: "5E Model Science Lesson Template",
      subject: "Science",
      gradeLevel: "All Grades",
      duration: "60-90 minutes",
      status: "Template",
    },
    {
      id: "102",
      title: "Literature Analysis Lesson Template",
      subject: "English",
      gradeLevel: "All Grades",
      duration: "45-60 minutes",
      status: "Template",
    },
    {
      id: "103",
      title: "Problem-Based Math Lesson Template",
      subject: "Mathematics",
      gradeLevel: "All Grades",
      duration: "45-60 minutes",
      status: "Template",
    },
  ]

  const filteredLessonPlans = lessonPlans.filter((plan) => {
    const matchesSearch = plan.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSubject = selectedSubject === "all" || plan.subject === selectedSubject
    const matchesGrade = selectedGrade === "all" || plan.gradeLevel === selectedGrade

    return matchesSearch && matchesSubject && matchesGrade
  })

  const isLoading = isLoadingPlans || isLoadingClasses
  const isError = isErrorPlans

  return (
    <>
        <SiteHeader title="Lesson Plans" />
        <div className="flex flex-1 flex-col p-4 md:p-6 gap-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Lesson Plans</h1>
              <p className="text-muted-foreground">Create, manage, and share your lesson plans</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push("/lesson-plans/consult")}>
                <MessageSquareIcon className="mr-2 h-4 w-4" />
                Get Consultation
              </Button>
              <Button onClick={() => router.push("/lesson-plans/create")}>
                <PlusIcon className="mr-2 h-4 w-4" />
                Create Lesson Plan
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="relative w-full md:w-96">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search lesson plans..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger className="w-full md:w-40">
                      <SelectValue placeholder="All Subjects" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subjects</SelectItem>
                      {classes.map((c) => (
                        <SelectItem key={c.id} value={c.subject}>
                          {c.subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                    <SelectTrigger className="w-full md:w-40">
                      <SelectValue placeholder="All Grades" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Grades</SelectItem>
                      <SelectItem value="Grade 9">Grade 9</SelectItem>
                      <SelectItem value="Grade 10">Grade 10</SelectItem>
                      <SelectItem value="Grade 11">Grade 11</SelectItem>
                      <SelectItem value="Grade 12">Grade 12</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <FilterIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="my-plans" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="my-plans">My Plans</TabsTrigger>
              <TabsTrigger value="shared">Shared With Me</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>
            <TabsContent value="my-plans" className="mt-4">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i}>
                      <CardHeader className="pb-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2 mt-2" />
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col space-y-2 text-sm">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Skeleton className="h-9 w-24" />
                        <Skeleton className="h-9 w-9" />
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : isError ? (
                <div className="flex items-center justify-center h-40 border rounded-lg border-dashed">
                  <p className="text-muted-foreground">Error loading lesson plans. Please try again.</p>
                </div>
              ) : filteredLessonPlans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredLessonPlans.map((plan) => (
                    <LessonPlanCard
                      key={plan.id}
                      plan={plan}
                      onView={() => router.push(`/lesson-plans/details/${plan.id}`)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-40 border rounded-lg border-dashed">
                  <p className="text-muted-foreground">
                    No lesson plans found. Create your first lesson plan to get started.
                  </p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="shared" className="mt-4">
              <div className="flex items-center justify-center h-40 border rounded-lg border-dashed">
                <p className="text-muted-foreground">No lesson plans have been shared with you</p>
              </div>
            </TabsContent>
            <TabsContent value="templates" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <LessonPlanCard
                    key={template.id}
                    plan={template}
                    isTemplate
                    onView={() => router.push(`/lesson-plans/create?template=${template.id}`)}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </>
  )
}

function LessonPlanCard({
  plan,
  isTemplate = false,
  onView,
}: {
  plan: any
  isTemplate?: boolean
  onView: () => void
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{plan.title}</CardTitle>
            <CardDescription>{plan.subject}</CardDescription>
          </div>
          <Badge variant={isTemplate ? "outline" : "default"}>{isTemplate ? "Template" : plan.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2 text-sm">
          <div className="flex items-center">
            <UsersIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{plan.gradeLevel}</span>
          </div>
          <div className="flex items-center">
            <ClockIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{plan.duration}</span>
          </div>
          <div className="flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{isTemplate ? "Template" : new Date(plan.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={onView}>
          {isTemplate ? "Use Template" : "View Details"}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontalIcon className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {!isTemplate ? (
              <>
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <DropdownMenuItem>Share</DropdownMenuItem>
                <DropdownMenuItem>Export</DropdownMenuItem>
                <DropdownMenuItem>Delete</DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem>Preview</DropdownMenuItem>
                <DropdownMenuItem>Use Template</DropdownMenuItem>
                <DropdownMenuItem>Share</DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  )
}
