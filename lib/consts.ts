import { LessonPlan } from "@/types/entities"
import { assignmentInsertSchema, calendarEventInsertSchema, classInsertSchema, classStudentInsertSchema, featureLimitInsertSchema, gradeInsertSchema, lessonPlanInsertSchema, materialInsertSchema, organizationInsertSchema, studentInsertSchema, subscriptionInsertSchema, userInsertSchema } from "./validation/insert"
import { assignmentSelectSchema, calendarEventSelectSchema, classSelectSchema, classStudentSelectSchema, featureLimitSelectSchema, gradeSelectSchema, lessonPlanSelectSchema, materialSelectSchema, organizationSelectSchema, studentSelectSchema, subscriptionSelectSchema, userSelectSchema } from "./validation/select"

export const lessonPlans: LessonPlan[] = [
    {
      id: 1,
      title: "Introduction to Quadratic Equations",
      subject: "Mathematics",
      gradeLevel: "Grade 10",
      duration: "60 minutes",
      date: "May 15, 2024",
      status: "draft",
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
  
export const templates = [
    {
      id: "101",
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
      id: "102",
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
      id: "103",
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

export const defaultValues = {
  lessonPlan:  {insert: lessonPlanInsertSchema._type , select: lessonPlanSelectSchema._type},
  assignment: {insert: assignmentInsertSchema._type , select: assignmentSelectSchema._type},
  material: {insert: materialInsertSchema._type , select: materialSelectSchema._type},
  student: {insert: studentInsertSchema._type , select: studentSelectSchema._type},
  class: {insert: classInsertSchema._type , select: classSelectSchema._type},
  user: {insert: userInsertSchema._type , select: userSelectSchema._type},
  organization: {insert: organizationInsertSchema._type , select: organizationSelectSchema._type},
  subscription: {insert: subscriptionInsertSchema._type , select: subscriptionSelectSchema._type},
  featureLimit: {insert: featureLimitInsertSchema._type , select: featureLimitSelectSchema._type},
  classStudent: {insert: classStudentInsertSchema._type , select: classStudentSelectSchema._type},
  grade: {insert: gradeInsertSchema._type , select: gradeSelectSchema._type},
  calendarEvent: {insert: calendarEventInsertSchema._type , select: calendarEventSelectSchema._type},
  
}