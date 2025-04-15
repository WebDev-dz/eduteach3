"use client"

import { useRouter, useParams } from "next/navigation"
import { AppSidebar } from "../@/components/shared/app-sidebar"
import { SiteHeader } from "../@/components/shared/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  EditIcon,
  FileTextIcon,
  PrinterIcon,
  ShareIcon,
  UsersIcon,
} from "lucide-react"

export default function LessonPlanDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const id = Number(params.id)

  // Find the lesson plan with the matching ID
  const lessonPlan = lessonPlans.find((plan) => plan.id === id)

  if (!lessonPlan) {
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader title="Lesson Plan Details" />
          <div className="flex flex-1 flex-col p-4 md:p-6 gap-4 items-center justify-center">
            <h1 className="text-2xl font-bold">Lesson Plan Not Found</h1>
            <p className="text-muted-foreground">The requested lesson plan could not be found.</p>
            <Button onClick={() => router.push("/lesson-plans")}>Return to Lesson Plans</Button>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  return (
    <>
        <SiteHeader title="Lesson Plan Details" />
        <div className="flex flex-1 flex-col p-4 md:p-6 gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => router.push("/lesson-plans")}>
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Lesson Plan Details</h1>
          </div>

          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">{lessonPlan.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge>{lessonPlan.subject}</Badge>
                <Badge variant="outline">{lessonPlan.gradeLevel}</Badge>
                <Badge variant={lessonPlan.status === "Complete" ? "default" : "secondary"}>{lessonPlan.status}</Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <PrinterIcon className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button variant="outline" size="sm">
                <ShareIcon className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button size="sm" onClick={() => router.push(`/lesson-plans/create?edit=${lessonPlan.id}`)}>
                <EditIcon className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Duration</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-2">
                <ClockIcon className="h-4 w-4 text-muted-foreground" />
                <span>{lessonPlan.duration}</span>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Date</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span>{lessonPlan.date}</span>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Class</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-2">
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
                <span>{lessonPlan.gradeLevel}</span>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Lesson Details</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Objectives</CardTitle>
                  <CardDescription>What students will learn from this lesson</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1">
                    {lessonPlan.objectives.map((objective, index) => (
                      <li key={index}>{objective}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Materials Needed</CardTitle>
                  <CardDescription>Resources required for this lesson</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1">
                    {lessonPlan.materials.map((material, index) => (
                      <li key={index}>{material}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Assessment</CardTitle>
                  <CardDescription>How student learning will be evaluated</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{lessonPlan.assessment}</p>
                </CardContent>
              </Card>

              {lessonPlan.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle>Teacher Notes</CardTitle>
                    <CardDescription>Additional information for implementation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{lessonPlan.notes}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="details" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Lesson Procedure</CardTitle>
                  <CardDescription>Step-by-step guide for implementing this lesson</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Introduction</h3>
                    <p>{lessonPlan.procedure.introduction}</p>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-2">Main Activity</h3>
                    <p>{lessonPlan.procedure.mainActivity}</p>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-2">Conclusion</h3>
                    <p>{lessonPlan.procedure.conclusion}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="resources" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Attached Resources</CardTitle>
                  <CardDescription>Files and materials for this lesson</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 border rounded-md">
                      <div className="flex items-center gap-2">
                        <FileTextIcon className="h-5 w-5 text-muted-foreground" />
                        <span>Student Worksheet.pdf</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        Download
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded-md">
                      <div className="flex items-center gap-2">
                        <FileTextIcon className="h-5 w-5 text-muted-foreground" />
                        <span>Answer Key.pdf</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        Download
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded-md">
                      <div className="flex items-center gap-2">
                        <FileTextIcon className="h-5 w-5 text-muted-foreground" />
                        <span>Presentation Slides.pptx</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <FileTextIcon className="mr-2 h-4 w-4" />
                    Upload Additional Resources
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </>
  )
}

type LessonPlan = {
  id: number
  title: string
  subject: string
  gradeLevel: string
  duration: string
  date: string
  status: string
  objectives: string[]
  materials: string[]
  procedure: {
    introduction: string
    mainActivity: string
    conclusion: string
  }
  assessment: string
  notes: string
}

const lessonPlans: LessonPlan[] = [
  {
    id: 1,
    title: "Introduction to Quadratic Equations",
    subject: "Mathematics",
    gradeLevel: "Grade 10",
    duration: "60 minutes",
    date: "May 15, 2024",
    status: "Draft",
    objectives: [
      "Define quadratic equations",
      "Identify the standard form of quadratic equations",
      "Solve simple quadratic equations by factoring",
    ],
    materials: ["Whiteboard and markers", "Student worksheets", "Graphing calculators"],
    procedure: {
      introduction: "Begin with a review of linear equations and introduce the concept of quadratic equations.",
      mainActivity: "Demonstrate solving quadratic equations by factoring with several examples.",
      conclusion: "Summarize key points and assign homework problems.",
    },
    assessment: "Students will complete a worksheet with 5 quadratic equations to solve.",
    notes: "Some students may need additional support with factoring.",
  },
  {
    id: 2,
    title: "Shakespeare's Romeo and Juliet: Act 1",
    subject: "English",
    gradeLevel: "Grade 9",
    duration: "90 minutes",
    date: "May 18, 2024",
    status: "Complete",
    objectives: [
      "Understand the historical context of the play",
      "Analyze the main characters introduced in Act 1",
      "Identify key themes and literary devices",
    ],
    materials: ["Copies of Romeo and Juliet", "Character analysis worksheet", "Projector for video clips"],
    procedure: {
      introduction: "Introduce the historical context of Shakespeare's time and the setting of the play.",
      mainActivity: "Read key scenes from Act 1 and discuss character motivations and conflicts.",
      conclusion: "Summarize the events of Act 1 and preview Act 2.",
    },
    assessment: "Students will complete a character analysis worksheet and participate in class discussion.",
    notes: "Consider showing clips from a modern adaptation to help students connect with the material.",
  },
  {
    id: 3,
    title: "Cell Structure and Function",
    subject: "Science",
    gradeLevel: "Grade 9",
    duration: "75 minutes",
    date: "May 20, 2024",
    status: "Draft",
    objectives: [
      "Identify the main parts of a cell",
      "Explain the function of each cell organelle",
      "Compare and contrast plant and animal cells",
    ],
    materials: [
      "Microscopes",
      "Prepared slides of plant and animal cells",
      "Cell diagram handouts",
      "Modeling clay for cell models",
    ],
    procedure: {
      introduction: "Begin with a discussion about the basic unit of life and the cell theory.",
      mainActivity: "Students will observe cells under microscopes and identify organelles.",
      conclusion: "Create a comparison chart of plant and animal cells as a class.",
    },
    assessment: "Students will label cell diagrams and explain the function of each organelle.",
    notes: "Prepare extra microscopes in case some are not functioning properly.",
  },
  {
    id: 4,
    title: "World War II: Causes and Early Events",
    subject: "History",
    gradeLevel: "Grade 11",
    duration: "60 minutes",
    date: "May 22, 2024",
    status: "Complete",
    objectives: [
      "Identify the major causes of World War II",
      "Understand the policy of appeasement and its consequences",
      "Analyze the early events of the war (1939-1941)",
    ],
    materials: ["Historical maps", "Primary source documents", "Timeline handout", "Video clips of historical footage"],
    procedure: {
      introduction: "Review the aftermath of World War I and the rise of totalitarian regimes.",
      mainActivity: "Analyze primary sources and create a timeline of events leading to WWII.",
      conclusion: "Discuss the global impact of the early years of the war.",
    },
    assessment: "Students will write a short essay on one of the causes of World War II.",
    notes: "Some content may be sensitive; prepare students accordingly.",
  },
  {
    id: 5,
    title: "Color Theory and Mixing",
    subject: "Art",
    gradeLevel: "Grade 10",
    duration: "90 minutes",
    date: "May 25, 2024",
    status: "Draft",
    objectives: [
      "Understand the color wheel and color relationships",
      "Learn techniques for mixing primary colors to create secondary and tertiary colors",
      "Apply color theory to create a harmonious composition",
    ],
    materials: [
      "Acrylic paints (primary colors plus black and white)",
      "Painting paper or canvas",
      "Brushes and palettes",
      "Color wheel reference charts",
    ],
    procedure: {
      introduction: "Introduce the color wheel and basic color theory concepts.",
      mainActivity:
        "Students will mix colors and create a color wheel, then apply their knowledge in a simple painting.",
      conclusion: "Gallery walk to observe and discuss each other's work.",
    },
    assessment: "Students will be evaluated on their color mixing accuracy and application in their painting.",
    notes: "Have extra smocks available for students who forget theirs.",
  },
  {
    id: 6,
    title: "Introduction to Chemical Reactions",
    subject: "Science",
    gradeLevel: "Grade 11",
    duration: "75 minutes",
    date: "May 28, 2024",
    status: "Complete",
    objectives: [
      "Identify the signs of a chemical reaction",
      "Balance simple chemical equations",
      "Classify different types of chemical reactions",
    ],
    materials: [
      "Lab safety equipment",
      "Chemicals for demonstration reactions",
      "Reaction worksheet",
      "Digital balance",
    ],
    procedure: {
      introduction: "Review atomic structure and introduce the concept of chemical reactions.",
      mainActivity: "Demonstrate several types of chemical reactions and have students record observations.",
      conclusion: "Practice balancing chemical equations as a class.",
    },
    assessment: "Students will complete a worksheet identifying and balancing chemical equations.",
    notes: "Review lab safety procedures before demonstrations.",
  },
]
