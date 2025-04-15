"use client";

import { useState } from "react";
import { useFileExport } from "@/services/import-export-service";

import { SiteHeader } from "@/components/shared/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SearchIcon,
  MoreHorizontalIcon,
  FilterIcon,
  UserPlusIcon,
  DownloadIcon,
  Pencil,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteDialog } from "@/components/shared/delete-dialog";
import { useClasses } from "@/services/class-service";
import { useStudents, useDeleteStudent } from "@/services/student-service";
import { Student } from "@/types/entities";
import {
  ExportDialog,
  ImportDialog,
} from "@/components/shared/export-import-dialog";
import { Form, FormField } from "@/components/ui";
import { getInitials, getPerformanceColor } from "@/lib/utils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const studentFilterSchema = z.object({
  class: z.string().optional(),
  search: z.string().optional(),
});

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const router = useRouter();
  const { data: session } = useSession();

  const form = useForm<z.infer<typeof studentFilterSchema>>({
    resolver: zodResolver(studentFilterSchema),
    defaultValues: {
      class: "all",
      search: "",
    },
  });

  // Use TanStack Query to fetch students and classes
  const {
    data: students = [],
    isLoading: isLoadingStudents,
    isError: isErrorStudents,
  } = useStudents(session?.user?.id);

  const { data: classes = [], isLoading: isLoadingClasses } = useClasses(
    session?.user?.id
  );

  const { exportMutation, importMutation } = useFileExport<Student>();

  // Use TanStack Query for delete mutation
  const deleteStudentMutation = useDeleteStudent();

  const handleDeleteStudent = async (studentId: string) => {
    deleteStudentMutation.mutate(studentId);
  };

  const filteredStudents = students.filter((student) => {
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      (student.email &&
        student.email.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesClass =
      selectedClass === "all" || student.class === selectedClass;

    return matchesSearch && matchesClass;
  });

  const isLoading = isLoadingStudents || isLoadingClasses;

  return (
    <>
      <SiteHeader title="Students" />
      <div className="flex flex-1 flex-col p-4 md:p-6 gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Students</h1>
          <Button onClick={() => router.push("/students/create")}>
            <UserPlusIcon className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <Form {...form}>
                <form>
                  <FormField
                    control={form.control}
                    name="search"
                    render={({ field }) => (
                      <div className="relative w-full md:w-96">
                        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search students..."
                          className="pl-8"
                          {...field}
                        />
                      </div>
                    )}
                  />
                 
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <FormField
                      control={form.control}
                      name={"class"}
                      render={({ field }) => (
                        <>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-full md:w-40">
                              <SelectValue placeholder="All Classes" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Classes</SelectItem>
                              {classes.map((c) => (
                                <SelectItem key={c.id} value={c.name}>
                                  {c.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button variant="outline" size="icon">
                            <FilterIcon className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    />

                    <ExportDialog
                      title="Export Students"
                      description="Choose the format to download student data."
                      data={students}
                      trigger={
                        <Button variant="outline" size="icon">
                          <DownloadIcon className="h-4 w-4" />
                        </Button>
                      }
                    />
                    <ImportDialog
                      title="Import Students"
                      description="Upload a CSV or Excel file containing student data."
                      trigger={
                        <Button variant="outline" size="icon">
                          <DownloadIcon className="h-4 w-4 rotate-180" />
                        </Button>
                      }
                    />
                    <label htmlFor="import-students">
                      <Button variant="outline" size="icon">
                        <DownloadIcon className="h-4 w-4 rotate-180" />
                      </Button>
                    </label>
                  </div>
                </form>
              </Form>
            </div>
          </CardContent>
        </Card>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-40" />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-2 w-24" />
                          <Skeleton className="h-4 w-8" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-16" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-8 w-8 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {getInitials(
                              `${student.firstName} ${student.lastName}`
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <span>{`${student.firstName} ${student.lastName}`}</span>
                      </div>
                    </TableCell>
                    <TableCell>{student.studentId}</TableCell>
                    <TableCell>{student?.class}</TableCell>
                    <TableCell>{student.email || "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 rounded-full bg-gray-200">
                          <div
                            className={`h-full rounded-full ${getPerformanceColor(student.performance)}`}
                            style={{ width: `${student.performance}%` }}
                          />
                        </div>
                        <span>{student.performance}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          student.status === "Active" ? "default" : "outline"
                        }
                      >
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontalIcon className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/students/edit/${student.id}`)
                            }
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DeleteDialog
                            title="Delete Student"
                            description="Are you sure you want to delete this student? This action cannot be undone."
                            onDelete={() => handleDeleteStudent(student.id)}
                            trigger={
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            }
                          />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    No students found. Add your first student to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
