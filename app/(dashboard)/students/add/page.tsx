import { db } from "@/lib/db"
import { classes } from "@/lib/db/schema"
import { StudentForm } from "@/components/custom/student-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AddStudentPage() {
  // Fetch classes directly in the server component
  const classList = await db.select({ id: classes.id, name: classes.name }).from(classes).orderBy(classes.name)

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Add New Student</CardTitle>
        </CardHeader>
        <CardContent>
          <StudentForm classes={classList} />
        </CardContent>
      </Card>
    </div>
  )
}
