// @/services/import-export-service
import { FileExportService, FileFormat } from "@/types/services";

import { useMutation } from "@tanstack/react-query";
import Papa from "papaparse";
import { toast } from "sonner";
import * as XLSX from "xlsx";

export const fileExportService: FileExportService = {
  toCsv<T>(data: T[], fields: (keyof T)[]): string {
    const csv = Papa.unparse(data, {
      columns: fields as string[]
    });
    return csv;
  },

  toExcel<T>(data: T[], sheetName = "Sheet1"): Blob {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    return new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
  },

  async fromCsv<T>(file: File): Promise<T[]> {
    return new Promise<T[]>((resolve, reject) => {
      Papa.parse<T>(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => resolve(result.data),
        error: (error) => reject(error)
      });
    });
  },

  async fromExcel<T>(file: File): Promise<T[]> {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData: T[] = XLSX.utils.sheet_to_json(worksheet);
    return jsonData;
  }
};


type ExportArgs<T> = {
    format: FileFormat;
    data: T[];
  };
  
  type ImportArgs = {
    format: FileFormat;
    file: File;
  };
  
  export function useFileExport<T>() {
    
    const exportMutation = useMutation<Blob | string, Error, ExportArgs<T>>({
      mutationFn: async ({ format, data }) => {
        if (format === "csv") {
          return fileExportService.toCsv(data);
        } else if (format === "excel") {
          return fileExportService.toExcel(data);
        }
        throw new Error("Unsupported export format");
      },
      onSuccess: () => toast.success("File exported successfully"),
      onError: (error: Error) => toast.error(error.message),
    });
  
    const importMutation = useMutation<T[], Error, ImportArgs>({
      mutationFn: async ({ format, file }) => {
        if (format === "csv") {
          return await fileExportService.fromCsv<T>(file);
        } else if (format === "excel") {
          return await fileExportService.fromExcel<T>(file);
        }
        throw new Error("Unsupported import format");
      },
      onSuccess: () => toast.success("File imported successfully"),
      onError: (error: Error) => toast.error(error.message),
    });
  
    return {
      exportMutation,
      importMutation
    };
  }