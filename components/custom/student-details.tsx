"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Badge,
  Separator,
  Avatar,
  AvatarFallback,
  Input,
  Label,
  Textarea,
  Switch,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDeleteStudent, useUpdateStudent } from "@/services/student-service";
import { Student, ClassStudent, Class, Grade } from "@/types/entities";
import {
  Calendar,
  Mail,
  MapPin,
  Phone,
  User,
  School,
  FileText,
  Edit,
} from "lucide-react";
import { format } from "date-fns";

type StudentDetailsProps = {
  student: Student & {
    classStudents: (ClassStudent & {
      class: Class;
    })[];
    grades?: Grade[];
  };
};

export function StudentProfile({ student }: StudentDetailsProps) {
  const router = useRouter();
  const { mutate: deleteStudent, isPending: isDeleting } = useDeleteStudent();
  const { mutate: updateStudent, isPending: isUpdating } = useUpdateStudent();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: student.firstName,
    lastName: student.lastName,
    email: student.email || "",
    dateOfBirth: student.dateOfBirth || "",
    address: student.address || "",
    emergencyContact: student.emergencyContact || "",
    emergencyPhone: student.emergencyPhone || "",
    specialNeeds: student.specialNeeds || false,
    notes: student.notes || "",
  });

  const handleDelete = () => {
    deleteStudent(student.id, {
      onSuccess: () => {
        router.push("/students");
      },
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudent(
      { id: student.id, ...formData },
      {
        onSuccess: () => {
          setIsEditDialogOpen(false);
        },
      }
    );
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, specialNeeds: checked }));
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const calculateAverageGrade = () => {
    if (!student.grades || student.grades.length === 0) return "N/A";
    const total = student.grades.reduce(
      (sum, grade) =>
        sum + (parseFloat(grade.score) / parseFloat(grade.maxScore)) * 100,
      0
    );
    return `${(total / student.grades.length).toFixed(1)}%`;
  };

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full border-none shadow-none">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-2xl">
                  {getInitials(student.firstName, student.lastName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-3xl font-bold">
                  {student.firstName} {student.lastName}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Student ID: {student.studentId}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(true)}
                disabled={isUpdating}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
              <Button
                variant="destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Student"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="classes">Classes</TabsTrigger>
                <TabsTrigger value="grades">Grades</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <Label className="text-sm font-medium">Email</Label>
                      <p className="text-sm text-muted-foreground">
                        {student.email || "Not provided"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <Label className="text-sm font-medium">Date of Birth</Label>
                      <p className="text-sm text-muted-foreground">
                        {student.dateOfBirth
                          ? format(new Date(student.dateOfBirth), "PPP")
                          : "Not provided"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <Label className="text-sm font-medium">Address</Label>
                      <p className="text-sm text-muted-foreground">
                        {student.address || "Not provided"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <Label className="text-sm font-medium">
                        Emergency Contact
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {student.emergencyContact
                          ? `${student.emergencyContact} (${student.emergencyPhone})`
                          : "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <Label className="text-sm font-medium">Special Needs</Label>
                      <Badge
                        variant={student.specialNeeds ? "default" : "secondary"}
                      >
                        {student.specialNeeds ? "Yes" : "No"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground mt-1" />
                    <div>
                      <Label className="text-sm font-medium">Notes</Label>
                      <p className="text-sm text-muted-foreground">
                        {student.notes || "No additional notes"}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Classes Tab */}
              <TabsContent value="classes">
                {student.classStudents && student.classStudents.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Class Name</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Grade Level</TableHead>
                        <TableHead>Academic Year</TableHead>
                        <TableHead>Room</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {student.classStudents.map((classStudent) => (
                        <TableRow key={classStudent.classId}>
                          <TableCell>{classStudent.class.name}</TableCell>
                          <TableCell>{classStudent.class.subject}</TableCell>
                          <TableCell>{classStudent.class.gradeLevel}</TableCell>
                          <TableCell>{classStudent.class.academicYear}</TableCell>
                          <TableCell>
                            {classStudent.class.room || "N/A"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    Not enrolled in any classes
                  </p>
                )}
              </TabsContent>

              {/* Grades Tab */}
              <TabsContent value="grades">
                {student.grades && student.grades.length > 0 ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Average Grade</p>
                      <Badge variant="default">{calculateAverageGrade()}</Badge>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Assignment</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Max Score</TableHead>
                          <TableHead>Comments</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {student.grades.map((grade) => (
                          <TableRow key={grade.id}>
                            <TableCell>
                              {grade.assignmentId ? "Assignment" : "General"}
                            </TableCell>
                            <TableCell>{grade.score}</TableCell>
                            <TableCell>{grade.maxScore}</TableCell>
                            <TableCell>
                              {grade.comments || "No comments"}
                            </TableCell>
                            <TableCell>
                              {format(new Date(grade.createdAt), "PPP")}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No grades available
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Student Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="firstName" className="text-right">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastName" className="text-right">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dateOfBirth" className="text-right">
                  Date of Birth
                </Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={
                    formData.dateOfBirth
                      ? format(new Date(formData.dateOfBirth), "yyyy-MM-dd")
                      : ""
                  }
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Address
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="emergencyContact" className="text-right">
                  Emergency Contact
                </Label>
                <Input
                  id="emergencyContact"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="emergencyPhone" className="text-right">
                  Emergency Phone
                </Label>
                <Input
                  id="emergencyPhone"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="specialNeeds" className="text-right">
                  Special Needs
                </Label>
                <div className="col-span-3 flex items-center">
                  <Switch
                    id="specialNeeds"
                    checked={formData.specialNeeds}
                    onCheckedChange={handleSwitchChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="notes" className="text-right pt-2">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Student</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {student.firstName}{" "}
              {student.lastName}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}