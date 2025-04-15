"use client";

import type React from "react";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useFileExport } from "@/services/import-export-service";
import { format } from "path";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";

const exportSchema = z.object({
  format: z.enum(["csv", "excel"]),
});

interface ExportDialogProps {
  title: string;
  description: string;
  trigger: React.ReactNode;
  data: any[];
}

export function ExportDialog({
  title,
  description,
  trigger,
  data,
}: ExportDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof exportSchema>>({
    resolver: zodResolver(exportSchema),
    defaultValues: { format: "csv" },
  });
  const { exportMutation } = useFileExport<(typeof data)[0]>();

  const handleExport = (values: z.infer<typeof exportSchema>) => {
    exportMutation.mutate(
      { format: values.format, data },
      {
        onSuccess: (result) => {
          const mime =
            values.format === "csv"
              ? "text/csv"
              : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

          const blob =
            typeof result === "string"
              ? new Blob([result], { type: mime })
              : result;

          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = `students.${values.format === "csv" ? "csv" : "xlsx"}`;
          link.click();
          URL.revokeObjectURL(link.href);

          setOpen(false);
        },
      }
    );
  };

  return (
    <>
      <div onClick={() => setOpen(true)}>{trigger}</div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleExport)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{title}</AlertDialogTitle>
                <AlertDialogDescription>{description}</AlertDialogDescription>
              </AlertDialogHeader>

              <FormField
                name="format"
                control={form.control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    defaultValue="csv"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button type="submit" disabled={exportMutation.isPending}>
                    {exportMutation.isPending ? "Exporting..." : "Export"}
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </form>
        </Form>
      </AlertDialog>
    </>
  );
}

interface ImportDialogProps {
  title: string;
  description: string;
  trigger: React.ReactNode;
}

const importSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      (file) =>
        file.type === "text/csv" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ),
  format: z.enum(["csv", "excel"]),
});

export function ImportDialog({
  title,
  description,
  trigger,
}: ImportDialogProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const form = useForm({
    resolver: zodResolver(importSchema),
  });
  const { importMutation } = useFileExport<any>();

  const handleImport = (data: z.infer<typeof importSchema>) => {
    if (!form.getValues("file")) return;
    importMutation.mutate(data, {
      onSuccess: (data) => {
        console.log("Imported students:", data);
        setOpen(false);
      },
    });
  };

  return (
    <>
      <div onClick={() => setOpen(true)}>{trigger}</div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleImport)}>
            <FormField
              name="format"
              control={form.control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="xlsx">XLSX</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{title}</AlertDialogTitle>
                <AlertDialogDescription>{description}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button
                    variant="default"
                    type="submit"
                    disabled={importMutation.isPending || !form.watch("file")}
                  >
                    {importMutation.isPending ? "Importing..." : "Import"}
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </form>
        </Form>
      </AlertDialog>
    </>
  );
}
