"use client";

import { useState } from "react";
import { AppSidebar } from "../../components/app-sidebar";
import { SiteHeader } from "../../components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  PlusIcon,
  CalendarIcon,
  ClockIcon,
  UsersIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ClipboardListIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAssignments } from "@/services/assignment-service";
import { Skeleton } from "@/components/ui/skeleton";

export default function AssignmentsPage() {
  const [selectedTab, setSelectedTab] = useState("all");
  const router = useRouter();
  const { data: session } = useSession();

  // Use the assignments service to fetch data
  const {
    data: assignments = [],
    isLoading,
    isError,
  } = useAssignments(session?.user?.id);

  const filteredAssignments = assignments.filter((assignment) => {
    if (selectedTab === "all") return true;
    if (selectedTab === "draft") return assignment.status === "draft";
    if (selectedTab === "published") return assignment.status === "published";
    if (selectedTab === "graded") return assignment.status === "graded";
    if (selectedTab === "archived") return assignment.status === "archived";

    return true;
  });

  return (
    <>
      <SiteHeader title="Assignments" />
      <div className="flex flex-1 flex-col p-4 md:p-6 gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Assignments</h1>
          <Button onClick={() => router.push("/assignments/create")}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Create Assignment
          </Button>
        </div>

        <Tabs
          defaultValue="all"
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="w-full"
        >
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="graded">Graded</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
          <TabsContent value={selectedTab} className="mt-4">
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
            ) : isError ? (
              <div className="flex items-center justify-center h-40 border rounded-lg border-dashed">
                <p className="text-muted-foreground">
                  Error loading assignments. Please try again.
                </p>
              </div>
            ) : filteredAssignments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAssignments.map((assignment) => (
                  <AssignmentCard key={assignment.id} assignment={assignment} />
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 border rounded-lg border-dashed">
                <p className="text-muted-foreground">
                  No assignments found. Create your first assignment to get
                  started.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

function AssignmentCard({ assignment }: { assignment: any }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{assignment.title}</CardTitle>
            <CardDescription>{assignment.subject}</CardDescription>
          </div>
          <StatusBadge status={assignment.status} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2 text-sm">
          <div className="flex items-center">
            <UsersIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{assignment.className || "All Classes"}</span>
          </div>
          <div className="flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>
              Due: {new Date(assignment.dueDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center">
            <ClipboardListIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{assignment.submissionStatus || "No submissions yet"}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          View Details
        </Button>
        {assignment.status === "Completed" ? (
          <Button size="sm">View Grades</Button>
        ) : (
          <Button size="sm">Manage</Button>
        )}
      </CardFooter>
    </Card>
  );
}

function StatusBadge({ status }: { status: AssignmentStatus }) {
  const getStatusConfig = (status: AssignmentStatus) => {
    switch (status) {
      case "Active":
        return { variant: "default" as const, icon: AlertCircleIcon };
      case "Upcoming":
        return { variant: "outline" as const, icon: ClockIcon };
      case "Completed":
        return { variant: "secondary" as const, icon: CheckCircleIcon };
      default:
        return { variant: "outline" as const, icon: ClockIcon };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <config.icon className="h-3 w-3" />
      {status}
    </Badge>
  );
}

type AssignmentStatus = "Active" | "Upcoming" | "Completed";
