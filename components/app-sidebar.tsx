"use client";

import type * as React from "react";
import {
  BookIcon,
  CalendarIcon,
  ClipboardListIcon,
  FileTextIcon,
  FolderIcon,
  GraduationCapIcon,
  LayoutDashboardIcon,
  LibraryIcon,
  LineChartIcon,
  PencilRulerIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";

import { NavDocuments } from "./nav-documents";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const data = {
  user: {
    name: "Ms. Johnson",
    email: "johnson@school.edu",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Classes",
      url: "/classes",
      icon: GraduationCapIcon,
    },
    {
      title: "Students",
      url: "/students",
      icon: UsersIcon,
    },
    {
      title: "Assignments",
      url: "/assignments",
      icon: ClipboardListIcon,
    },
    {
      title: "Grades",
      url: "/grades",
      icon: LineChartIcon,
    },
    {
      title: "Materials",
      url: "/materials",
      icon: LibraryIcon,
    },
    {
      title: "Lesson Plans",
      url: "/lesson-plans",
      icon: BookIcon,
    },
    {
      title: "Calendar",
      url: "/calendar",
      icon: CalendarIcon,
    },
  ],
  navClouds: [
    {
      title: "Lesson Plans",
      icon: BookIcon,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Current Term",
          url: "#",
        },
        {
          title: "Archive",
          url: "#",
        },
      ],
    },
    {
      title: "Exams",
      icon: FileTextIcon,
      url: "#",
      items: [
        {
          title: "Upcoming",
          url: "#",
        },
        {
          title: "Past Exams",
          url: "#",
        },
      ],
    },
    {
      title: "Resources",
      icon: LibraryIcon,
      url: "#",
      items: [
        {
          title: "Study Materials",
          url: "#",
        },
        {
          title: "Question Banks",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: SettingsIcon,
    },
    {
      title: "Help Center",
      url: "#",
      icon: SearchIcon,
    },
  ],
  documents: [
    {
      name: "Lesson Plans",
      url: "/lesson-plans",
      icon: BookIcon,
    },
    {
      name: "Study Materials",
      url: "/materials",
      icon: FolderIcon,
    },
    {
      name: "Worksheets",
      url: "#",
      icon: PencilRulerIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  const user = session?.user!;
  const path = usePathname();
  const isActive =
    !path.includes("/login") &&
    !path.includes("/signup") &&
    !path.includes("/auth") &&
    !!user &&
    !(path == "");

  if (!isActive) return null;



  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <GraduationCapIcon className="h-5 w-5" />
                <span className="text-base font-semibold">EduTeach</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user?.name || "",
            email: user?.email || "",
            avatar: user?.image || "",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
