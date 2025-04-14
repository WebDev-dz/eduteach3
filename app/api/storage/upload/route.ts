import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { uploadUserFile } from "@/lib/db/dal/storage"

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
    }

    // Get form data with file
    const formData = await request.formData()
    const file = formData.get("file") as File
    const path = formData.get("path") as string | null

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 })
    }

    const extension = file.name.split(".").at(-1)!;
    const buffer = Buffer.from(await file.arrayBuffer());
    const blobContentType = extensionToContentType(extension);

    // Upload the file
    // const result = await uploadUserFile(session.user.id, buffer, path || "", blobContentType)
    const result = false
    if (!result) {
      return NextResponse.json({ success: false, error: "Failed to upload file" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ success: false, error: "An error occurred while uploading the file" }, { status: 500 })
  }
}
function extensionToContentType(extension: string): string {
  switch (extension.toLowerCase()) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    case "pdf":
      return "application/pdf";
    case "doc":
    case "docx":
      return "application/msword";
    case "xls":
    case "xlsx":
      return "application/vnd.ms-excel";
    case "ppt":
    case "pptx":
      return "application/vnd.ms-powerpoint";
    // Add more cases as needed for other file types
    default:
      return "application/octet-stream"; // Default content type for unknown extensions
  }
}