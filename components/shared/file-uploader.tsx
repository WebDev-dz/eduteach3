"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, X } from "lucide-react"
import { toast } from "sonner"
import { useUploadUserFile } from "@/services/storage-service"
import { useSession } from "next-auth/react"

interface FileUploaderProps {
  onUploadComplete?: (result: { url: string; key: string }) => void
  path?: string
  maxSizeMB?: number
  acceptedFileTypes?: string
  buttonText?: string
  className?: string
}

export function FileUploader({
  onUploadComplete,
  path,
  maxSizeMB = 10,
  acceptedFileTypes,
  buttonText = "Upload File",
  className,
}: FileUploaderProps) {
  const { mutate: uploadFileViaAPI, isPending: isUploading, status, data } = useUploadUserFile()
  const [progress, setProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { data: session } = useSession()
  const maxSizeBytes = maxSizeMB * 1024 * 1024

  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size
    if (file.size > maxSizeBytes) {
      toast.error(`File size exceeds the maximum limit of ${maxSizeMB}MB`)
      return
    }

    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first")
      return
    }

    if (!session?.user?.id) {
      toast.error("User not authenticated")
      return
    }

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return prev
        }
        return prev + 5
      })
    }, 100)

    try {
      await uploadFileViaAPI({ userId: session?.user?.id, file: selectedFile, path })

      if (status === "success") {
        setProgress(100)
        onUploadComplete?.(data!)

        // Reset after a short delay
        setTimeout(() => {
          setSelectedFile(null)
          setProgress(0)
          if (fileInputRef.current) {
            fileInputRef.current.value = ""
          }
        }, 1000)
      }
    } catch (error) {
      console.error("Upload error:", error)
    } finally {
      clearInterval(interval)
    }
  }

  const clearSelectedFile = () => {
    setSelectedFile(null)
    setProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2">
        <input
          type="file"
          onChange={handleFileChange}
          accept={acceptedFileTypes}
          className="hidden"
          ref={fileInputRef}
          disabled={isUploading}
        />
        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
          <Upload className="mr-2 h-4 w-4" />
          {buttonText}
        </Button>
        {selectedFile && (
          <div className="flex items-center gap-2 text-sm">
            <span className="truncate max-w-[200px]">{selectedFile.name}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={clearSelectedFile}
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {selectedFile && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2 w-full" />
          <div className="flex justify-between">
            <span className="text-xs text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
            <span className="text-xs text-muted-foreground">{progress}%</span>
          </div>
          <Button type="button" onClick={handleUpload} disabled={isUploading} className="w-full">
            {isUploading ? "Uploading..." : "Start Upload"}
          </Button>
        </div>
      )}
    </div>
  )
}
