"use client";

import { useState } from "react";
import { AppSidebar } from "../../components/app-sidebar";
import { SiteHeader } from "../../components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import EditorApp from "@/components/editor/App";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  PlusIcon,
  FileTextIcon,
  FileIcon,
  ImageIcon,
  VideoIcon,
  DownloadIcon,
  MoreHorizontalIcon,
  SearchIcon,
  FilterIcon,
  BookIcon,
  PencilRulerIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMaterials } from "@/services/material-service";
import { useClasses } from "@/services/class-service";
import { Skeleton } from "@/components/ui/skeleton";

export default function MaterialsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const router = useRouter();
  const { data: session } = useSession();

  // Use the materials service to fetch data
  const {
    data: materials = [],
    isLoading: isLoadingMaterials,
    isError: isErrorMaterials,
  } = useMaterials(session?.user?.id);

  // Use the classes service to get subjects for filtering
  const { data: classes = [], isLoading: isLoadingClasses } = useClasses(
    session?.user?.id
  );

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch = material.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType =
      selectedType === "all" || material.type === selectedType;
    const matchesSubject =
      selectedSubject === "all" || material.title === selectedSubject;

    return matchesSearch && matchesType && matchesSubject;
  });

  const isLoading = isLoadingMaterials || isLoadingClasses;
  const isError = isErrorMaterials;

  return (
    
        <>
          <SiteHeader title="Teaching Materials" />
          <div className="flex flex-1 flex-col p-4 md:p-6 gap-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Teaching Materials</h1>
              <Button onClick={() => router.push("/materials/create")}>
                <PlusIcon className="mr-2 h-4 w-4" />
                Upload Material
              </Button>
            </div>

            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div className="relative w-full md:w-96">
                    <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search materials..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <Select
                      value={selectedType}
                      onValueChange={setSelectedType}
                    >
                      <SelectTrigger className="w-full md:w-40">
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="lesson-plan">
                          Lesson Plans
                        </SelectItem>
                        <SelectItem value="worksheet">Worksheets</SelectItem>
                        <SelectItem value="presentation">
                          Presentations
                        </SelectItem>
                        <SelectItem value="document">Documents</SelectItem>
                        <SelectItem value="image">Images</SelectItem>
                        <SelectItem value="video">Videos</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={selectedSubject}
                      onValueChange={setSelectedSubject}
                    >
                      <SelectTrigger className="w-full md:w-40">
                        <SelectValue placeholder="All Subjects" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Subjects</SelectItem>
                        {classes.map((c) => (
                          <SelectItem key={c.id} value={c.subject}>
                            {c.subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon">
                      <FilterIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <EditorApp />
          </div>
        </>
      
  );
}

function MaterialCard({ material }: { material: any }) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video bg-muted flex items-center justify-center">
        {getFileIcon(material.type, 48)}
      </div>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base truncate">{material.name}</CardTitle>
        <CardDescription className="truncate">
          {material.subject}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 pb-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{getTypeDisplayName(material.type)}</span>
          <span>{material.size || "Unknown"}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-2 flex justify-between">
        <Button variant="ghost" size="sm">
          <DownloadIcon className="mr-2 h-4 w-4" />
          Download
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontalIcon className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View</DropdownMenuItem>
            <DropdownMenuItem>Share</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}

function getFileIcon(type: string, size = 16) {
  const className = `h-${size === 16 ? "4" : "12"} w-${
    size === 16 ? "4" : "12"
  } ${size === 16 ? "mr-2" : ""}`;

  switch (type) {
    case "lesson-plan":
      return <BookIcon className={className} />;
    case "worksheet":
      return <PencilRulerIcon className={className} />;
    case "presentation":
      return <FileTextIcon className={className} />;
    case "document":
      return <FileIcon className={className} />;
    case "image":
      return <ImageIcon className={className} />;
    case "video":
      return <VideoIcon className={className} />;
    default:
      return <FileIcon className={className} />;
  }
}

function getTypeDisplayName(type: string): string {
  switch (type) {
    case "lesson-plan":
      return "Lesson Plan";
    case "worksheet":
      return "Worksheet";
    case "presentation":
      return "Presentation";
    case "document":
      return "Document";
    case "image":
      return "Image";
    case "video":
      return "Video";
    default:
      return type;
  }
}
