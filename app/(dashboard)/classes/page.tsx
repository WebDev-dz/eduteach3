"use client"

import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/shared/app-sidebar"
import { SiteHeader } from "@/components/shared/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusIcon, UsersIcon, BookOpenIcon, ClockIcon, MoreHorizontalIcon, Pencil, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Skeleton } from "@/components/ui/skeleton"
import { DeleteDialog } from "@/components/shared/delete-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { useClasses, useDeleteClass } from "@/services/class-service"
import { ClassWithStudentCount } from "@/types/entities"
import Link from "next/link"

export default function ClassesPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState("active")

  // Use TanStack Query to fetch classes
  const { data: classes = [], isLoading, isError } = useClasses(session?.user?.id)

  // Use TanStack Query for delete mutation
  const deleteClassMutation = useDeleteClass()

  // Filter classes based on active tab
  const filteredClasses = classes.filter((classItem) => {
    if (activeTab === "active") return classItem.isActive !== false
    if (activeTab === "archived") return classItem.isActive === false
    return false // For "upcoming" tab, we don't have this data yet
  })

  const handleDeleteClass = async (classId: string) => {
    deleteClassMutation.mutate(classId)
  }

  // Show error toast if query fails
  useEffect(() => {
    if (isError) {
      toast.error("Failed to fetch classes")
    }
  }, [isError])

  return (
    <>
      <SiteHeader title="Classes" />
        <div className="flex flex-1 flex-col p-4 md:p-6 gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">My Classes</h1>
            <Button onClick={() => router.push("/classes/create")}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add New Class
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="active">Active Classes</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="mt-4">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i}>
                      <CardHeader className="pb-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2 mt-2" />
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col space-y-2 text-sm">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Skeleton className="h-9 w-24" />
                        <Skeleton className="h-9 w-20" />
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : filteredClasses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredClasses.map((classItem) => (
                    <ClassCard
                      key={classItem.id}
                      classItem={classItem}
                      onDelete={handleDeleteClass}
                      onEdit={() => router.push(`/classes/edit/${classItem.id}`)}
                      isDeleting={deleteClassMutation.isPending && deleteClassMutation.variables === classItem.id}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-40 border rounded-lg border-dashed">
                  <p className="text-muted-foreground">No classes found. Create your first class to get started.</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="upcoming">
              <div className="flex items-center justify-center h-40 border rounded-lg border-dashed">
                <p className="text-muted-foreground">No upcoming classes scheduled</p>
              </div>
            </TabsContent>
            <TabsContent value="archived">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2].map((i) => (
                    <Card key={i}>
                      <CardHeader className="pb-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2 mt-2" />
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col space-y-2 text-sm">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredClasses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredClasses.map((classItem) => (
                    <ClassCard
                      key={classItem.id}
                      classItem={classItem}
                      onDelete={handleDeleteClass}
                      onEdit={() => router.push(`/classes/edit/${classItem.id}`)}
                      isDeleting={deleteClassMutation.isPending && deleteClassMutation.variables === classItem.id}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-40 border rounded-lg border-dashed">
                  <p className="text-muted-foreground">No archived classes</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </>
  )
}

interface ClassCardProps {
  classItem: ClassWithStudentCount
  onDelete: (id: string) => void
  onEdit: () => void
  isDeleting?: boolean
}

function ClassCard({ classItem, onDelete, onEdit, isDeleting }: ClassCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <Link href={`/classes/${classItem.id}`}>
              <CardTitle>{classItem.name}</CardTitle>
              <CardDescription>{classItem.subject}</CardDescription>
            </Link>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontalIcon className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DeleteDialog
                title="Delete Class"
                description="Are you sure you want to delete this class? This action cannot be undone."
                onDelete={async () => onDelete(classItem.id)}
                trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                }
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2 text-sm">
          <div className="flex items-center">
            <UsersIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{classItem.studentCount} Students</span>
          </div>
          <div className="flex items-center">
            <BookOpenIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{classItem.assignmentCount} Assignments</span>
          </div>
          <div className="flex items-center">
            <ClockIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{classItem.schedule || "No schedule set"}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          View Details
        </Button>
        <Button size="sm" disabled={isDeleting}>
          {isDeleting ? "Deleting..." : "Manage"}
        </Button>
      </CardFooter>
    </Card>
  )
}
