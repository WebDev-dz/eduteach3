"use server"
import { db } from "@/lib/db";
import { grades, students, assignments } from "@/lib/db/schema";
import { eq, and, sql, getTableColumns } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { AssignmentGrade, GradeServerService, GradeWithDetails } from "@/types/services";
import { GradeCreateInput, GradeUpdateInput } from "@/types/entities";


export function calculateGradeDistribution(grades: { score: number; maxScore: number }[]) {
  if (!grades.length) {
    return {
      average: 0,
      median: 0,
      min: 0,
      max: 0,
      distribution: {
        A: 0,
        B: 0,
        C: 0,
        D: 0,
        F: 0
      },
      percentages: [] as number[]
    };
  }

  // Calculate percentages
  const percentages = grades.map(grade => (grade.score / grade.maxScore) * 100);
  
  // Sort percentages for statistical calculations
  const sortedPercentages = [...percentages].sort((a, b) => a - b);
  
  // Calculate basic statistics
  const min = sortedPercentages[0];
  const max = sortedPercentages[sortedPercentages.length - 1];
  const sum = sortedPercentages.reduce((acc, val) => acc + val, 0);
  const average = sum / sortedPercentages.length;
  
  // Calculate median
  const mid = Math.floor(sortedPercentages.length / 2);
  const median = sortedPercentages.length % 2 === 0
    ? (sortedPercentages[mid - 1] + sortedPercentages[mid]) / 2
    : sortedPercentages[mid];
  
  // Calculate letter grade distribution
  const distribution = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    F: 0
  };
  
  percentages.forEach(percentage => {
    if (percentage >= 90) {
      distribution.A += 1;
    } else if (percentage >= 80) {
      distribution.B += 1;
    } else if (percentage >= 70) {
      distribution.C += 1;
    } else if (percentage >= 60) {
      distribution.D += 1;
    } else {
      distribution.F += 1;
    }
  });
  
  return {
    average,
    median,
    min,
    max,
    distribution,
    percentages
  };
}

/**
 * Fetches grade data from the database and calculates distribution
 * Can filter by class, assignment, and/or student
 */




const gradeServerService: GradeServerService = {
  fetchGrades: async (teacherId: string) => {
    try {
      const gradesWithDetails = await db
        .select({
          id: grades.id,
          score: grades.score,
          feedback: grades.comments,
          studentId: grades.studentId,
          assignmentId: grades.assignmentId,
          studentName: sql`CONCAT(${students.firstName}, ' ', ${students.lastName})`,
          assignmentTitle: assignments.title,
          createdAt: grades.createdAt,
          updatedAt: grades.updatedAt,
        })
        .from(grades)
        .leftJoin(students, eq(grades.studentId, students.id))
        .leftJoin(assignments, eq(grades.assignmentId, assignments.id))
        .where(eq(grades.teacherId, teacherId));

      return gradesWithDetails as unknown as GradeWithDetails[];
    } catch (error) {
      console.error("Error fetching grades:", error);
      throw new Error("Failed to fetch grades");
    }
  },

  fetchGradeById: async (id: string) => {
    try {
      const [grade] = await db
        .select({
          id: grades.id,
          score: grades.score,
          feedback: grades.comments,
          studentId: grades.studentId,
          assignmentId: grades.assignmentId,
          studentName: sql`CONCAT(${students.firstName}, ' ', ${students.lastName})`,
          assignmentTitle: assignments.title,
          createdAt: grades.createdAt,
          updatedAt: grades.updatedAt,
        })
        .from(grades)
        .leftJoin(students, eq(grades.studentId, students.id))
        .leftJoin(assignments, eq(grades.assignmentId, assignments.id))
        .where(eq(grades.id, id));

      if (!grade) {
        throw new Error("Grade not found");
      }

      return grade as unknown as GradeWithDetails;
    } catch (error) {
      console.error("Error fetching grade:", error);
      throw new Error("Failed to fetch grade");
    }
  },
  fetchGradeDistribution: async ({
    classId,
    assignmentId,
    studentId
  }: {
    classId?: string;
    assignmentId?: string;
    studentId?: string;
  }) {
    try {
      // Build where conditions based on provided filters
      const whereConditions = [];
      
      if (classId) {
        whereConditions.push(eq(grades.classId, classId));
      }
      
      if (assignmentId) {
        whereConditions.push(eq(grades.assignmentId, assignmentId));
      }
      
      if (studentId) {
        whereConditions.push(eq(grades.studentId, studentId));
      }
      
      // Query the database
      const gradeData = await db.select({
        score: grades.score,
        maxScore: grades.maxScore
      })
      .from(grades)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);
      
      // Convert decimal values to numbers for calculation
      const gradesForCalculation = gradeData.map(grade => ({
        score: Number(grade.score),
        maxScore: Number(grade.maxScore)
      }));
      
      // Calculate the distribution
      return calculateGradeDistribution(gradesForCalculation);
    } catch (error) {
      console.error("Error fetching grade distribution:", error);
      throw new Error("Failed to calculate grade distribution");
    }
  },
  
  // @virified
  fetchGradesByStudent: async (studentId: string) => {
    const gradesColumns = getTableColumns(grades);
    try {
      const studentGrades = await db
        .select({
          ...gradesColumns,
          studentName: sql`CONCAT(${students.firstName}, ' ', ${students.lastName})`,
          assignmentTitle: assignments.title,
          createdAt: grades.createdAt,
          updatedAt: grades.updatedAt,
        })
        .from(grades)
        .leftJoin(students, eq(grades.studentId, students.id))
        .leftJoin(assignments, eq(grades.assignmentId, assignments.id))
        .where(eq(grades.studentId, studentId));

      return studentGrades as unknown as AssignmentGrade[];
    } catch (error) {
      console.error("Error fetching grades by student:", error);
      throw new Error("Failed to fetch grades for student");
    }
  },

  fetchGradesByAssignment: async (assignmentId: string) => {
    const gradesColumns = getTableColumns(grades);
    try {
      const assignmentGrades = await db
        .select({
          ...gradesColumns,
          studentName: sql`CONCAT(${students.firstName}, ' ', ${students.lastName})`,
          assignmentTitle: assignments.title,
        })
        .from(grades)
        .leftJoin(students, eq(grades.studentId, students.id))
        .leftJoin(assignments, eq(grades.assignmentId, assignments.id))
        .where(eq(grades.assignmentId, assignmentId));

      return assignmentGrades as AssignmentGrade[];
    } catch (error) {
      console.error("Error fetching grades by assignment:", error);
      throw new Error("Failed to fetch grades for assignment");
    }
  },

  fetchGradesByClass: async (classId: string) => {
    const gradesColumns = getTableColumns(grades);
    try {
      const classGrades = await db
        .select({
          ...gradesColumns,
          studentName: sql`CONCAT(${students.firstName}, ' ', ${students.lastName})`,
          assignmentTitle: assignments.title,
        })
        .from(grades)
        .leftJoin(students, eq(grades.studentId, students.id))
        .leftJoin(assignments, eq(grades.assignmentId, assignments.id))
        .where(eq(assignments.classId, classId));

      return classGrades as AssignmentGrade[];
    } catch (error) {
      console.error("Error fetching grades by class:", error);
      throw new Error("Failed to fetch grades for class");
    }
  },

  createGrade: async (data: GradeCreateInput) => {
    try {
      const id = uuidv4();
      const grade = {...data, id, createdAt: new Date(), updatedAt: new Date()}
      await db.insert(grades).values(grade);
      return { id };
    } catch (error) {
      console.error("Error creating grade:", error);
      throw new Error("Failed to create grade");
    }
  },
  createBulkGrades: async (data: GradeCreateInput[]) => {
    try {
      const id = uuidv4();
      const gradesData = data.map((gr) => ({...gr, id, createdAt: new Date(), updatedAt: new Date()})) 
      await db.insert(grades).values(gradesData);
      return { id };
    } catch (error) {
      console.error("Error creating grade:", error);
      throw new Error("Failed to create grade");
    }
  },


  updateGrade: async (data: GradeUpdateInput) => {
    try {
      const { id, teacherId, ...updateData } = data;

      await db
        .update(grades)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(and(eq(grades.id, id), eq(grades.teacherId, teacherId)));

      return { id };
    } catch (error) {
      console.error("Error updating grade:", error);
      throw new Error("Failed to update grade");
    }
  },

  deleteGrade: async (id: string) => {
    try {
      await db
        .delete(grades)
        .where(eq(grades.id, id));

      return { success: true };
    } catch (error) {
      console.error("Error deleting grade:", error);
      throw new Error("Failed to delete grade");
    }
  },
};

export const createGrade = gradeServerService.createGrade;
export const updateGrade = gradeServerService.updateGrade;
export const deleteGrade = gradeServerService.deleteGrade;
export const getGrades = gradeServerService.fetchGrades;
export const getGradeById = gradeServerService.fetchGradeById;
export const getGradesByStudent = gradeServerService.fetchGradesByStudent;
export const getGradesByAssignment = gradeServerService.fetchGradesByAssignment;
export const getGradesByClass = gradeServerService.fetchGradesByClass;
export const createBulkGrades = gradeServerService.createBulkGrades
export const getGradeDistribution = gradeServerService.fetchGradeDistribution

