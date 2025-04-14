"use client"

import { useState, useEffect } from "react"
import { FileUploader } from "@/components/file-uploader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Folder, File as FileIcon, Trash2, Download, Eye, ArrowLeft, Plus } from "lucide-react"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { useDeleteUserFile, useListUserFiles, useUploadUserFile } from "@/services/storage-service"

export default function StoragePage() {
  const { data: session } = useSession()
  const { mutate: deleteFile, status: deleteStatus } = useDeleteUserFile()
  const [currentPath, setCurrentPath] = useState<string>("/")
  const [pathHistory, setPathHistory] = useState<string[]>([])
  const [newFolderName, setNewFolderName] = useState("")
  const [showNewFolderInput, setShowNewFolderInput] = useState(false)
  const { data: files, isPending: isLoading ,mutate: listFiles , status  } = useListUserFiles()
  const { mutate: uploadFile, isPending: isUploading , status: uploadStatus } = useUploadUserFile()
  
  useEffect(() => {
    if (!session?.user.id) {
      toast.error("user Id not in session")
      return
    }
    loadFiles(session?.user.id)
  }, [currentPath, session?.user.id])

  const loadFiles = async (userId: string) => {
    await listFiles({path: currentPath, userId})
    
  }

  const handleFileUploadComplete = () => {
    loadFiles(session?.user.id!)
  }

  const handleDeleteFile = async (fileKey: string) => {
    if (confirm("Are you sure you want to delete this file?")) {
      await deleteFile({fileKey, userId: session?.user?.id!})
      if (deleteStatus == "success") {
        loadFiles(session?.user?.id!)
      }
    }
  }

  const navigateToFolder = (folderName: string) => {
    setPathHistory([...pathHistory, currentPath])
    setCurrentPath(currentPath ? `${currentPath}/${folderName}` : folderName)
  }

  const navigateBack = () => {
    const previousPath = pathHistory.pop() || ""
    setPathHistory([...pathHistory])
    setCurrentPath(previousPath)
  }

  const createNewFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error("Please enter a folder name")
      return
    }

    // Create an empty file with a .folder extension to simulate a folder
  const folderMarker = new File([""], ".folder", { type: "text/plain" })
const userId = session?.user.id
console.log({userId})
if (!userId) {
    toast.error("user Id not in session")
    return
}
await uploadFile({
  file: folderMarker,
  path: `${currentPath}/${newFolderName}`,
  userId 
  })
  if (uploadStatus == "success") {
      toast.success("Folder created successfully")
      setNewFolderName("")
      setShowNewFolderInput(false)
      loadFiles(userId)
  }
  if (uploadStatus == "error") {
    toast.error("Error creating folder")
  }
}
    

  const isFolder = (file: any) => {
    return file.name.endsWith(".folder") || !file.name.includes(".")
  }

  const getFileIcon = (file: any) => {
    if (isFolder(file)) {
      return <Folder className="h-6 w-6 text-blue-500" />
    }
    return <FileIcon className="h-6 w-6 text-gray-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">My Files</h1>

      <Tabs defaultValue="files" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="files">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Files and Folders</CardTitle>
                  <CardDescription>{currentPath ? `Current path: ${currentPath}` : "Root directory"}</CardDescription>
                </div>
                <div className="flex gap-2">
                  {currentPath && (
                    <Button variant="outline" size="sm" onClick={navigateBack}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => setShowNewFolderInput(!showNewFolderInput)}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Folder
                  </Button>
                </div>
              </div>

              {showNewFolderInput && (
                <div className="flex gap-2 mt-4">
                  <Input
                    placeholder="Folder name"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                  />
                  <Button onClick={createNewFolder}>Create</Button>
                  <Button variant="ghost" onClick={() => setShowNewFolderInput(false)}>
                    Cancel
                  </Button>
                </div>
              )}
            </CardHeader>

            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <p>Loading files...</p>
                </div>
              ) : files?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No files found in this directory</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {files?.map((file) => (
                    <Card key={file.id} className="overflow-hidden">
                      <div
                        className="p-4 cursor-pointer hover:bg-muted/50 flex items-center gap-3"
                        onClick={() => (isFolder(file) ? navigateToFolder(file.name) : null)}
                      >
                        {getFileIcon(file)}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(file.metadata.contentLength)}</p>
                        </div>

                        <div className="flex gap-1">
                          {!isFolder(file) && (
                            <>
                              <Button variant="ghost" size="icon" asChild>
                                <a href={file?.url} target="_blank" rel="noopener noreferrer">
                                  <Eye className="h-4 w-4" />
                                </a>
                              </Button>
                              <Button variant="ghost" size="icon" asChild>
                                <a href={file?.url} download>
                                  <Download className="h-4 w-4" />
                                </a>
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteFile(file?.name)
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Upload Files</CardTitle>
              <CardDescription>
                Upload files to {currentPath ? `path: ${currentPath}` : "root directory"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <FileUploader
                path={currentPath}
                onUploadComplete={handleFileUploadComplete}
                maxSizeMB={10}
                buttonText="Select File to Upload"
              />
            </CardContent>

            <CardFooter className="text-sm text-muted-foreground">Maximum file size: 10MB</CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
