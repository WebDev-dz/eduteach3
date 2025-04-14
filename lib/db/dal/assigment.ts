import { db } from "@/lib/db";
import { classes, assignments, students } from "@/lib/db/schema";
import { AssignmentsServices, AssignmentWithDetails } from "@/services/assignment-service";
import { eq, and, sql, getTableColumns } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid"

export type AssignmentCreateInput = {
  studentId: string;
  assignmentId: string;
  classId: string;
  score: number;
  maxScore: number;
  comments?: string;
  teacherId: string;
};

export type AssignmentUpdateInput = Omit<AssignmentCreateInput, "teacherId"> & {
  id: string;
  teacherId: string;
};

export type BulkAssignmentInput = {
  classId: string;
  assignmentId: string;
  assignments: {
    studentId: string;
    score: number;
    comments?: string;
  }[];
  teacherId: string;
};

export type StudentAssignments = typeof students.$inferSelect & {
  assignments: (typeof assignments.$inferSelect)[];
};

const getAssignmentsByStudent = async (
  studentId: string
): Promise<StudentAssignments | undefined> => {
  const assignmentsOfStudent = await db.query.students.findFirst({
    where: eq(students.id, studentId),
    with: {
      assignments: true,
    },
  });

  return assignmentsOfStudent;
};

export const getAssignmentsByClass = async (
  classId: string,
  subject: string,
  teacherId: string
): Promise<AssignmentWithDetails[]> => {
  // Get all students in the class
  const studentsInClass = await db.execute(sql`
      SELECT s.id, s.student_id, s.first_name, s.last_name
      FROM students s
      JOIN class_students cs ON s.id = cs.student_id
      WHERE cs.class_id = ${classId} AND s.teacher_id = ${teacherId}
    `);

  // Get class details
  const classDetails = await db.query.classes.findFirst({
    where: and(eq(classes.id, classId), eq(classes.teacherId, teacherId)),
    columns: {
      name: true,
      subject: true,
    },
  });

  if (!classDetails) {
    return [];
  }

  // Get assignments for this class
  const assignmentsForClass = await db.query.assignments.findMany({
    where: eq(assignments.classId, classId),
    orderBy: assignments.dueDate,
    columns: {
      id: true,
      title: true,
      type: true,
    },
  });

  // Get assignments for all students in this class
  const assignmentsData = await db.execute(sql`
      SELECT g.student_id, g.assignment_id, g.score, g.max_score
      FROM assignments g
      WHERE g.class_id = ${classId} AND g.teacher_id = ${teacherId}
    `);

  // Create a map of student assignments
  const studentAssignments = new Map<string, Map<string, number>>();
  assignmentsData.forEach((row: any) => {
    if (!studentAssignments.has(row.student_id)) {
      studentAssignments.set(row.student_id, new Map());
    }
    const percentage = Math.round(
      (Number(row.score) / Number(row.max_score)) * 100
    );
    studentAssignments.get(row.student_id)?.set(row.assignment_id, percentage);
  });

  // Create assignment objects for each student
  return studentsInClass.map((student: any) => {
    const studentAssignmentMap = studentAssignments.get(student.id) || new Map();

    // Calculate overall assignment (average of all assignments)
    let totalScore = 0;
    let count = 0;
    studentAssignmentMap.forEach((score) => {
      totalScore += score;
      count++;
    });

    const overall = count > 0 ? Math.round(totalScore / count) : 0;

    // For simplicity, we're using fixed assignment names
    // In a real app, you'd map actual assignment IDs to their scores
    return {
      studentId: student.student_id,
      studentName: `${student.first_name} ${student.last_name}`,
      score: overall,
      class: classDetails.name,
      subject: classDetails.subject,
      assignment1: studentAssignmentMap.get(assignmentsForClass[0]?.id) || 0,
      assignment2: studentAssignmentMap.get(assignmentsForClass[1]?.id) || 0,
      quiz1: studentAssignmentMap.get(assignmentsForClass[2]?.id) || 0,
      midterm: studentAssignmentMap.get(assignmentsForClass[3]?.id) || 0,
      final: studentAssignmentMap.get(assignmentsForClass[4]?.id) || 0,
      overall,
    };
  });
};

export const getClassAverages = async (teacherId: string) : Promise<{ id: string; name: string; subject: string; average: number }[]> => {
  const result = await db.execute(sql`
    SELECT c.id, c.name, c.subject, AVG(g.score * 100 / g.max_score) as average
    FROM classes c
    JOIN assignments g ON c.id = g.class_id
    WHERE c.teacher_id = ${teacherId}
    GROUP BY c.id, c.name, c.subject
    ORDER BY average DESC
  `);

  return result.map((row: any) => ({
    id: row.id,
    name: row.name,
    subject: row.subject,
    average: Math.round(Number(row.average) || 0),
  }));
};

export const getDistribution = async (classId: string, teacherId: string) => {
  const result = await db.execute(sql`
    SELECT 
      CASE 
        WHEN g.score * 100 / g.max_score BETWEEN 90 AND 100 THEN '90-100'
        WHEN g.score * 100 / g.max_score BETWEEN 80 AND 89 THEN '80-89'
        WHEN g.score * 100 / g.max_score BETWEEN 70 AND 79 THEN '70-79'
        WHEN g.score * 100 / g.max_score BETWEEN 60 AND 69 THEN '60-69'
        ELSE '0-59'
      END as range,
      COUNT(*) as count
    FROM assignments g
    JOIN classes c ON g.class_id = c.id
    WHERE g.class_id = ${classId} AND c.teacher_id = ${teacherId}
    GROUP BY range
    ORDER BY range
  `);

  // Ensure all ranges are represented
  const ranges = ["90-100", "80-89", "70-79", "60-69", "0-59"];
  const distribution = ranges.map((range) => {
    const found = result.find((row: any) => row.range === range);
    return {
      range,
      count: found ? Number(found.count) : 0,
    };
  });

  return distribution;
};

// Create a new assignment
export async function createAssignment(data: AssignmentCreateInput) {
  const id = uuidv4();
  const assignment = {
    ...data,
    score: data.score.toString(),
    maxScore: data.maxScore.toString(),
    id,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as typeof assignments.$inferInsert;

  await db.insert(assignments).values(assignment);

  return { id };
}

// Update an existing assignment
export async function updateAssignment(data: AssignmentUpdateInput) {
  const { id, teacherId, ...updateData } = data;

  await db
    .update(assignments)
    .set({
      ...updateData,
      score: updateData.score.toString(),
      maxScore: updateData.maxScore.toString(),
      updatedAt: new Date(),
    })
    .where(and(eq(assignments.id, id), eq(assignments.teacherId, teacherId)));

  return { id };
}

// Delete a assignment
export async function deleteAssignment({id, teacherId}: {id: string, teacherId: string}) {
  await db
    .delete(assignments)
    .where(and(eq(assignments.id, id), eq(assignments.teacherId, teacherId)));

  return { success: true };
}

// Create multiple assignments at once (bulk entry)
export async function createBulkAssignments(data: BulkAssignmentInput) {
  const { classId, assignmentId, assignments: assignmentsList, teacherId } = data;

  const assignmentsToInsert = assignmentsList.map((assignment) => ({
    id: uuidv4(),
    studentId: assignment.studentId,
    assignmentId,
    classId,
    score: assignment.score,
    maxScore: 100, // Assuming a standard max score
    comments: assignment.comments || null,
    teacherId,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  await db.insert(assignments).values(assignmentsToInsert);

  return { success: true };
}

// Fetch assignments with student and assignment details
const getAssignments = async (teacherId: string): Promise<AssignmentWithDetails[]> => {
  const assignmentsColumns = getTableColumns(assignments);
  const classColumns = getTableColumns(classes);
  const studentColumns = getTableColumns(students);
  const assignmentColumns = getTableColumns(assignments);
  const assignmentsWithDetails = await db
    .select({
      ...assignmentsColumns,
      ...classColumns,
      ...studentColumns,
      ...assignmentColumns,
      id: assignments.id,
      score: assignments.score,
      feedback: assignments.comments,
      studentId: assignments.studentId,
      assignmentId: assignments.assignmentId,
      studentName: sql`CONCAT(${students.firstName}, ' ', ${students.lastName})`,
      assignmentTitle: assignments.title,
      createdAt: assignments.createdAt,
      updatedAt: assignments.updatedAt,
      class: classes.name,
      subject: classes.subject,
      assignment1: assignments.title,
      assignment2: assignments.title,
      quiz1: assignments.title,
      midterm: assignments.title,
      final: assignments.title,
      overall: assignments.title,
    })
    .from(assignments)
    .leftJoin(students, eq(assignments.studentId, students.id))
    .leftJoin(assignments, eq(assignments.assignmentId, assignments.id))
    .leftJoin(classes, eq(assignments.classId, classes.id))
    .where(eq(assignments.teacherId, teacherId));

  return assignmentsWithDetails as AssignmentWithDetails[];
};

// Fetch a single assignment
const getAssignmentById = async (id: string): Promise<AssignmentWithDetails> => {
  const [assignment] = await db
    .select({
      id: assignments.id,
      score: assignments.score,
      comments: assignments.comments,
      studentId: assignments.studentId,
      assignmentId: assignments.assignmentId,
      studentName: sql`CONCAT(${students.firstName}, ' ', ${students.lastName})`,
      assignmentTitle: assignments.title,
      createdAt: assignments.createdAt,
      updatedAt: assignments.updatedAt,
    })
    .from(assignments)
    .leftJoin(students, eq(assignments.studentId, students.id))
    .leftJoin(assignments, eq(assignments.assignmentId, assignments.id))
    .where(eq(assignments.id, id));

  if (!assignment) {
    throw new Error("Assignment not found");
  }

  return assignment as AssignmentWithDetails;
};

const assignmentsServerService: Omit<AssignmentsServices, "routes" | "baseUrl"> = {
  fetchAssignments: getAssignments,
  fetchAssignmentsByClass: getAssignmentsByClass,
  fetchClassAverages: getClassAverages,
  fetchClassDistribution: getDistribution,
  fetchAssignmentById: getAssignmentById,
  fetchAssignmentsByStudent: getAssignmentsByStudent,
  createAssignment: createAssignment,
  updateAssignment: updateAssignment,
  deleteAssignment: deleteAssignment,
  // TODO
  // @ts-ignore
  createBulkAssignments: createBulkAssignments,
};
