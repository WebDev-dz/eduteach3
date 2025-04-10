"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AppSidebar } from "../../../components/app-sidebar"
import { SiteHeader } from "../../../components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeftIcon, BookIcon, PlusIcon, TrashIcon } from "lucide-react"

export default function CreateLessonPlanPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const templateId = searchParams.get("template")
  const editId = searchParams.get("edit")

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [objectives, setObjectives] = useState<string[]>([""])
  const [materials, setMaterials] = useState<string[]>([""])
  const [title, setTitle] = useState("")
  const [subject, setSubject] = useState("")
  const [gradeLevel, setGradeLevel] = useState("")
  const [duration, setDuration] = useState("")
  const [introduction, setIntroduction] = useState("")
  const [mainActivity, setMainActivity] = useState("")
  const [conclusion, setConclusion] = useState("")
  const [assessment, setAssessment] = useState("")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    // If template or edit ID is provided, pre-fill the form
    if (templateId) {
      const template = templates.find((t) => t.id === Number.parseInt(templateId))
      if (template) {
        setTitle("")
        setSubject(template.subject)
        setGradeLevel("")
        setDuration(template.duration.split("-")[0])
        setObjectives(template.objectives)
        setMaterials(template.materials)
        setIntroduction(template.procedure.introduction)
        setMainActivity(template.procedure.mainActivity)
        setConclusion(template.procedure.conclusion)
        setAssessment(template.assessment)
        setNotes(template.notes)
      }
    } else if (editId) {
      const lessonPlan = lessonPlans.find((p) => p.id === Number.parseInt(editId))
      if (lessonPlan) {
        setTitle(lessonPlan.title)
        setSubject(lessonPlan.subject)
        setGradeLevel(lessonPlan.gradeLevel)
        setDuration(lessonPlan.duration.split(" ")[0])
        setObjectives(lessonPlan.objectives)
        setMaterials(lessonPlan.materials)
        setIntroduction(lessonPlan.procedure.introduction)
        setMainActivity(lessonPlan.procedure.mainActivity)
        setConclusion(lessonPlan.procedure.conclusion)
        setAssessment(lessonPlan.assessment)
        setNotes(lessonPlan.notes)
      }
    }
  }, [templateId, editId])

  const handleAddObjective = () => {
    setObjectives([...objectives, ""])
  }

  const handleObjectiveChange = (index: number, value: string) => {
    const newObjectives = [...objectives]
    newObjectives[index] = value
    setObjectives(newObjectives)
  }

  const handleRemoveObjective = (index: number) => {
    if (objectives.length > 1) {
      const newObjectives = [...objectives]
      newObjectives.splice(index, 1)
      setObjectives(newObjectives)
    }
  }

  const handleAddMaterial = () => {
    setMaterials([...materials, ""])
  }

  const handleMaterialChange = (index: number, value: string) => {
    const newMaterials = [...materials]
    newMaterials[index] = value
    setMaterials(newMaterials)
  }

  const handleRemoveMaterial = (index: number) => {
    if (materials.length > 1) {
      const newMaterials = [...materials]
      newMaterials.splice(index, 1)
      setMaterials(newMaterials)
    }
  }

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
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title={editId ? "Edit Lesson Plan" : "Create Lesson Plan"} />
        <div className="flex flex-1 flex-col p-4 md:p-6 gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">{editId ? "Edit Lesson Plan" : "Create Lesson Plan"}</h1>
          </div>

          <Card className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>{editId ? "Edit Lesson Plan" : "Create a New Lesson Plan"}</CardTitle>
                <CardDescription>
                  {templateId
                    ? "You're using a template as a starting point. Customize it to fit your needs."
                    : "Fill in the details to create a comprehensive lesson plan for your class."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="procedure">Lesson Procedure</TabsTrigger>
                    <TabsTrigger value="resources">Resources & Assessment</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Lesson Title</Label>
                      <Input
                        id="title"
                        placeholder="Enter a descriptive title for your lesson"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Select value={subject} onValueChange={setSubject} required>
                          <SelectTrigger id="subject">
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Mathematics">Mathematics</SelectItem>
                            <SelectItem value="English">English</SelectItem>
                            <SelectItem value="Science">Science</SelectItem>
                            <SelectItem value="History">History</SelectItem>
                            <SelectItem value="Art">Art</SelectItem>
                            <SelectItem value="Music">Music</SelectItem>
                            <SelectItem value="Physical Education">Physical Education</SelectItem>
                            <SelectItem value="Computer Science">Computer Science</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="grade-level">Grade Level</Label>
                        <Select value={gradeLevel} onValueChange={setGradeLevel} required>
                          <SelectTrigger id="grade-level">
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
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="duration">Duration (minutes)</Label>
                        <Input
                          id="duration"
                          type="number"
                          min="1"
                          placeholder="e.g., 60"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input id="date" type="date" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Learning Objectives</Label>
                      <p className="text-sm text-muted-foreground">
                        What students will know or be able to do after this lesson
                      </p>
                      <div className="space-y-2">
                        {objectives.map((objective, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              placeholder={`Objective ${index + 1}`}
                              value={objective}
                              onChange={(e) => handleObjectiveChange(index, e.target.value)}
                              required
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => handleRemoveObjective(index)}
                              disabled={objectives.length <= 1}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <Button type="button" variant="outline" size="sm" onClick={handleAddObjective} className="mt-2">
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Add Objective
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="procedure" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="introduction">Introduction / Warm-up</Label>
                      <Textarea
                        id="introduction"
                        placeholder="Describe how you will begin the lesson and engage students"
                        rows={4}
                        value={introduction}
                        onChange={(e) => setIntroduction(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="main-activity">Main Activity</Label>
                      <Textarea
                        id="main-activity"
                        placeholder="Describe the main learning activities and teaching strategies"
                        rows={6}
                        value={mainActivity}
                        onChange={(e) => setMainActivity(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="conclusion">Conclusion / Wrap-up</Label>
                      <Textarea
                        id="conclusion"
                        placeholder="Describe how you will conclude the lesson and reinforce learning"
                        rows={4}
                        value={conclusion}
                        onChange={(e) => setConclusion(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="differentiation" />
                        <Label htmlFor="differentiation">Include differentiation strategies</Label>
                      </div>
                      <Textarea
                        id="differentiation-strategies"
                        placeholder="Describe how you will adapt the lesson for different learning needs"
                        rows={3}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="resources" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>Materials Needed</Label>
                      <div className="space-y-2">
                        {materials.map((material, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              placeholder={`Material ${index + 1}`}
                              value={material}
                              onChange={(e) => handleMaterialChange(index, e.target.value)}
                              required
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => handleRemoveMaterial(index)}
                              disabled={materials.length <= 1}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <Button type="button" variant="outline" size="sm" onClick={handleAddMaterial} className="mt-2">
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Add Material
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="resources">Additional Resources</Label>
                      <Input id="resources" type="file" multiple />
                      <p className="text-sm text-muted-foreground mt-1">
                        Upload worksheets, presentations, or other resources for this lesson.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="assessment">Assessment</Label>
                      <Textarea
                        id="assessment"
                        placeholder="Describe how you will assess student learning"
                        rows={4}
                        value={assessment}
                        onChange={(e) => setAssessment(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Teacher Notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Add any additional notes or reminders for yourself"
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="standards" />
                        <Label htmlFor="standards">Align with curriculum standards</Label>
                      </div>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select standards" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="common-core">Common Core Standards</SelectItem>
                          <SelectItem value="ngss">Next Generation Science Standards</SelectItem>
                          <SelectItem value="state">State-Specific Standards</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => router.back()}>
                  Cancel
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" type="button">
                    Save as Draft
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>Saving Lesson Plan...</>
                    ) : (
                      <>
                        <BookIcon className="mr-2 h-4 w-4" />
                        {editId ? "Update Lesson Plan" : "Create Lesson Plan"}
                      </>
                    )}
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
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
]

const templates = [
  {
    id: 101,
    title: "5E Model Science Lesson Template",
    subject: "Science",
    gradeLevel: "All Grades",
    duration: "60-90 minutes",
    date: "",
    status: "Template",
    objectives: [
      "Engage students in scientific inquiry",
      "Explore scientific concepts through hands-on activities",
      "Explain scientific principles",
      "Elaborate on concepts through application",
      "Evaluate student understanding",
    ],
    materials: ["Varies based on topic", "Lab equipment", "Student worksheets", "Assessment materials"],
    procedure: {
      introduction: "Engage: Begin with a demonstration or question that captures student interest.",
      mainActivity:
        "Explore: Students conduct an investigation. Explain: Teacher clarifies concepts. Elaborate: Students apply learning to new situations.",
      conclusion: "Evaluate: Assess student understanding through formative or summative assessment.",
    },
    assessment: "Multiple assessment strategies throughout the lesson.",
    notes: "Adapt timing for each phase based on student needs and complexity of content.",
  },
  {
    id: 102,
    title: "Literature Analysis Lesson Template",
    subject: "English",
    gradeLevel: "All Grades",
    duration: "45-60 minutes",
    date: "",
    status: "Template",
    objectives: [
      "Analyze literary elements in a text",
      "Identify author's purpose and techniques",
      "Connect themes to broader contexts",
      "Develop critical thinking skills",
    ],
    materials: [
      "Text copies for each student",
      "Analysis graphic organizers",
      "Discussion prompts",
      "Annotation supplies",
    ],
    procedure: {
      introduction: "Activate prior knowledge and introduce the text with context.",
      mainActivity: "Guided reading with focus questions, followed by small group analysis.",
      conclusion: "Whole class discussion connecting to broader themes and concepts.",
    },
    assessment: "Text annotations, discussion participation, and written response.",
    notes: "Select appropriate texts based on grade level and reading abilities.",
  },
  {
    id: 103,
    title: "Problem-Based Math Lesson Template",
    subject: "Mathematics",
    gradeLevel: "All Grades",
    duration: "45-60 minutes",
    date: "",
    status: "Template",
    objectives: [
      "Apply mathematical concepts to real-world problems",
      "Develop problem-solving strategies",
      "Communicate mathematical thinking",
      "Use appropriate tools strategically",
    ],
    materials: [
      "Problem scenario handouts",
      "Manipulatives or digital tools",
      "Solution recording sheets",
      "Extension problems",
    ],
    procedure: {
      introduction: "Present a real-world problem scenario that requires the target mathematical concept.",
      mainActivity: "Students work in groups to solve the problem using various strategies.",
      conclusion: "Groups present solutions and teacher facilitates discussion of different approaches.",
    },
    assessment: "Solution accuracy, strategy selection, mathematical reasoning, and presentation.",
    notes: "Prepare extension problems for early finishers and scaffolding for struggling students.",
  },
]
