"use client";

import type React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { FieldValues, useForm, UseFormReturn } from "react-hook-form";
import { ArrowLeftIcon, PlusIcon } from "lucide-react";

import { SiteHeader } from "@/components/shared/site-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Form,
} from "@/components/ui";
import { useCreateClass } from "@/services/class-service";
import { defaultValues } from "@/lib/consts";
import { classInsertSchema } from "@/lib/validation/insert";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { NameField, SubjectField, GradeLevelField, AcademicYearField, ScheduleField, RoomField, CapacityField, DescriptionField, IsActiveField } from "@/components/custom/classes/form-fields";



// Helper function to capitalize first letter
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function CreateClassPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const form = useForm({
    resolver: zodResolver(classInsertSchema),
    defaultValues: defaultValues.class.insert,
  });
  const createClassMutation = useCreateClass();

  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId) {
      toast.error("Unauthorized");
      router.push("/login");
      return;
    }
    form.setValue("teacherId", userId);
  }, [session]);
  // Define all form fields using the FormFields type
  

  const handleSubmit = (formData: z.infer<typeof classInsertSchema>) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to create a class");
      return;
    }

    createClassMutation.mutate(
      {
        ...formData,
        capacity: formData.capacity,
      },
      {
        onSuccess: () => {
          toast.success("Class created successfully");
          router.push("/classes");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to create class");
        },
      }
    );
  };

  return (
    <>
      <SiteHeader title="Create New Class" />
      <div className="flex flex-1 flex-col p-4 md:p-6 gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Create New Class</h1>
        </div>

        <Card className="max-w-3xl mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit, (e) => {toast.error(e.root?.message);console.log(e)})}>
              <CardHeader>
                <CardTitle>Class Information</CardTitle>
                <CardDescription>
                  Enter the details for the new class you want to create.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {<NameField {...form} />}
                  {<SubjectField {...form} />}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {<GradeLevelField {...form} />}
                  {<AcademicYearField {...form} />}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {<ScheduleField {...form} />}
                  {<RoomField {...form} />}
                </div>

                {<CapacityField {...form} />}
                {<DescriptionField {...form} />}
                {<IsActiveField {...form} />}
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createClassMutation.isPending}>
                  {createClassMutation.isPending ? (
                    "Creating Class..."
                  ) : (
                    <>
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Create Class
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </>
  );
}
