import { createClient } from "@supabase/supabase-js"
import { v4 as uuidv4 } from "uuid"


const AVATARS_BUCKET = "avatars"
const USER_BUCKET_PREFIX = "user-"
// Create a Supabase client with the service role key for server-side operations

function getUserBucketName(userId: string) {
    return `${USER_BUCKET_PREFIX}${userId}`
  }
const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  return createClient(supabaseUrl, supabaseServiceKey)
}

/**
 * Initialize storage for a new user
 * Creates a user-specific bucket
 */
export async function initializeUserStorage(userId: string): Promise<boolean> {
  try {
    const adminClient = createAdminClient()

    // Create user bucket if it doesn't exist
    const bucketName = getUserBucketName(userId)
    const { error } = await adminClient.storage.createBucket(bucketName, {
      public: false,
      fileSizeLimit: 10485760, // 10MB
    })

    if (error && error.message !== "Bucket already exists") {
      console.error("Error creating user bucket:", error)
      return false
    }

    // Set bucket policies to restrict access to the user
    // await adminClient.storage.from(bucketName).setAccessControl({
    //   allowedOrigins: ["*"],
    //   permissions: [
    //     {
    //       role: "authenticated",
    //       access: "read",
    //       condition: `auth.id = '${userId}'`,
    //     },
    //   ],
    // })

    return true
  } catch (error) {
    console.error("Error initializing user storage:", error)
    return false
  }
}

/**
 * Ensure the avatars bucket exists
 */
export async function ensureAvatarsBucket(): Promise<boolean> {
  try {
    const adminClient = createAdminClient()

    const { error } = await adminClient.storage.createBucket(AVATARS_BUCKET, {
      public: true,
      fileSizeLimit: 5242880, // 5MB
    })

    if (error && error.message !== "Bucket already exists") {
      console.error("Error creating avatars bucket:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error ensuring avatars bucket:", error)
    return false
  }
}

/**
 * Upload a file to a user's bucket (server-side)
 */
export async function uploadUserFile(
  userId: string,
  fileBuffer: Buffer,
  fileName: string,
  contentType: string,
  path?: string,
): Promise<{ url: string; key: string } | null> {
  try {
    const adminClient = createAdminClient()
    const bucketName = getUserBucketName(userId)
    const fileKey = path ? `${path}/${uuidv4()}-${fileName}` : `${uuidv4()}-${fileName}`

    const { data, error } = await adminClient.storage.from(bucketName).upload(fileKey, fileBuffer, {
      contentType,
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Error uploading file:", error)
      return null
    }

    const { data: urlData } = adminClient.storage.from(bucketName).getPublicUrl(data.path)

    return {
      url: urlData.publicUrl,
      key: data.path,
    }
  } catch (error) {
    console.error("Error uploading user file:", error)
    return null
  }
}

/**
 * Upload an avatar to the avatars bucket (server-side)
 */
export async function uploadAvatar(
  userId: string,
  fileBuffer: Buffer,
  fileName: string,
  contentType: string,
): Promise<{ url: string; key: string } | null> {
  try {
    const adminClient = createAdminClient()

    // Ensure file is an image
    if (!contentType.startsWith("image/")) {
      throw new Error("File must be an image")
    }

    // Generate a unique filename with user ID prefix
    const fileExt = fileName.split(".").pop()
    const newFileName = `${userId}-${uuidv4()}.${fileExt}`

    const { data, error } = await adminClient.storage.from(AVATARS_BUCKET).upload(newFileName, fileBuffer, {
      contentType,
      cacheControl: "3600",
      upsert: true, // Overwrite if exists
    })

    if (error) {
      console.error("Error uploading avatar:", error)
      return null
    }

    const { data: urlData } = adminClient.storage.from(AVATARS_BUCKET).getPublicUrl(data.path)

    return {
      url: urlData.publicUrl,
      key: data.path,
    }
  } catch (error) {
    console.error("Error uploading avatar:", error)
    return null
  }
}

/**
 * Delete a file from a user's bucket (server-side)
 */
export async function deleteUserFile(userId: string, fileKey: string): Promise<boolean> {
  try {
    const adminClient = createAdminClient()
    const bucketName = getUserBucketName(userId)
    const { error } = await adminClient.storage.from(bucketName).remove([fileKey])

    if (error) {
      console.error("Error deleting file:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error deleting user file:", error)
    return false
  }
}

/**
 * Delete an avatar from the avatars bucket (server-side)
 */
export async function deleteAvatar(fileKey: string): Promise<boolean> {
  try {
    const adminClient = createAdminClient()
    const { error } = await adminClient.storage.from(AVATARS_BUCKET).remove([fileKey])

    if (error) {
      console.error("Error deleting avatar:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error deleting avatar:", error)
    return false
  }
}

/**
 * List files in a user's bucket (server-side)
 */
export async function listUserFiles(
  userId: string,
  path?: string,
): Promise<{ name: string; url: string; key: string; size: number; createdAt: string }[] | null> {
  try {
    const adminClient = createAdminClient()
    const bucketName = getUserBucketName(userId)
    const { data, error } = await adminClient.storage.from(bucketName).list(path || "")

    if (error) {
      console.error("Error listing files:", error)
      return null
    }

    return data.map((item) => ({
      name: item.name,
      key: path ? `${path}/${item.name}` : item.name,
      url: adminClient.storage.from(bucketName).getPublicUrl(path ? `${path}/${item.name}` : item.name).data.publicUrl,
      size: item.metadata.size,
      createdAt: item.created_at,
    }))
  } catch (error) {
    console.error("Error listing user files:", error)
    return null
  }
}
