"use client"

import { useOptimistic } from "react"
import { Button } from "@/components/ui/button"
import { deleteStudent } from "@/lib/actions/student-actions"
import { toast } from "sonner"

type Student = {
  id: string
  firstName: string
  lastName: string
  email: string
  className: string
}

export function StudentList({ initialStudents }: { initialStudents: Student[] }) {
  // Set up optimistic state
  const [optimisticStudents, addOptimisticStudent] = useOptimistic<Student[], { id: string }>(
    initialStudents,
    (state, { id }) => state.filter((student) => student.id !== id),
  )

  async function handleDelete(id: string) {
    // Optimistically update UI
    addOptimisticStudent({ id })

    // Perform actual deletion
    const result = await deleteStudent(id)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Student deleted successfully")
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Students</h2>

      <ul className="divide-y">
        {optimisticStudents.map((student) => (
          <li key={student.id} className="py-3 flex justify-between items-center">
            <div>
              <p className="font-medium">
                {student.firstName} {student.lastName}
              </p>
              <p className="text-sm text-gray-500">{student.email}</p>
              <p className="text-xs text-gray-400">{student.className}</p>
            </div>
            <Button variant="destructive" size="sm" onClick={() => handleDelete(student.id)}>
              Delete
            </Button>
          </li>
        ))}
      </ul>

      {optimisticStudents.length === 0 && <p className="text-center text-gray-500 py-4">No students found</p>}
    </div>
  )
}
