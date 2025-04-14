import { db } from "@/lib/db"
import { students } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import StudentDetails  from "@/components/student-details"

export default async function StudentPage({ params }: { params: { id: string } }) {
  // Fetch student data on the server
  const { id } = await params
  const student = await db.query.students.findFirst({
    where: eq(students.id, id),
    with: {
      "classStudents": {
        with: {
          "class": true,
        },
      },
    },
  })

  console.log({student})

  if (!student) {
    notFound()
  }

  // Pass the server action to the client component
  return (
    <div className="max-w-3xl mx-auto p-4">
      <StudentDetails student={student}  />
    </div>
  )
}
