"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

type Student = {
  id: string
  firstName: string
  lastName: string
  email: string
  class: {
    id: string
    name: string
  }
}

export function StudentDetails({
  student,
  deleteStudentAction,
}: {
  student: Student
  deleteStudentAction: (id: string) => Promise<{ success?: boolean; error?: string }>
}) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this student?")) return

    setIsDeleting(true)
    const result = await deleteStudentAction(student.id)

    if (result.error) {
      toast.error(result.error)
      setIsDeleting(false)
    } else {
      toast.success("Student deleted successfully")
      router.push("/students")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {student.firstName} {student.lastName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>
            <strong>Email:</strong> {student.email}
          </p>
          <p>
            <strong>Class:</strong> {student.class.name}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? "Deleting..." : "Delete Student"}
        </Button>
      </CardFooter>
    </Card>
  )
}
