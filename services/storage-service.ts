// @/services/storage-service
import { useMutation, useQuery } from "@tanstack/react-query"
import { createClient } from "@supabase/supabase-js"
import { v4 as uuidv4 } from "uuid"
import { toast } from "sonner"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

console.log({supabaseUrl, supabaseServiceKey, supabaseAnonKey})


const adminClient = createClient(supabaseUrl, supabaseServiceKey)
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)

const AVATARS_BUCKET = "avatars"
const USER_BUCKET_PREFIX = "user-"

function getUserBucketName(userId: string) {
  return `${USER_BUCKET_PREFIX}${userId}`
}

export interface StorageService {
  initializeUserStorage: (userId: string) => Promise<boolean>
  ensureAvatarsBucket: () => Promise<boolean>
  uploadUserFile: (
    userId: string,
    file: File,
    path?: string
  ) => Promise<{ url: string; key: string } | null>
  deleteUserFile: (userId: string, fileKey: string) => Promise<boolean>
  listUserFiles: (userId: string, path: string) => ReturnType<typeof getUserFiles>

}

const getUserFiles = async (userId: string, path: string) => {
    
        const bucketName = getUserBucketName(userId)
        if (!path) {
          path = ""
        }
        console.log({bucketName, path})
        const { data, error } = await supabaseClient.storage.from(bucketName).list(path)
        const { data: info, error: infoError } = await supabaseClient.storage.from(bucketName).info(path)
        if (error || !data) {
          throw error
        }

        console.log({data, info, infoError})
        return data.map((file) => ({
          ...file,
          url: supabaseClient.storage.from(bucketName).getPublicUrl(file.name).data.publicUrl
        }))
      
}

export const storageClientService: StorageService = {
  initializeUserStorage: async (userId: string) => {
    
      const bucketName = getUserBucketName(userId)
      const { error } = await adminClient.storage.createBucket(bucketName, {
        public: false,
        fileSizeLimit: 10485760,
      })
      if (error) {
        throw error
      }
      return true
    
  },

  ensureAvatarsBucket: async () => {
    try {
      const { error } = await adminClient.storage.createBucket(AVATARS_BUCKET, {
        public: true,
        fileSizeLimit: 5242880,
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
  },

  uploadUserFile: async (userId, file, path) => {
    
      const bucketName = getUserBucketName(userId)
      console.log("Bucket name:", bucketName)
      const fileKey = path ? `${path}/${uuidv4()}-${file.name}` : `${uuidv4()}-${file.name}`
      const { data, error } = await supabaseClient.storage
        .from(bucketName)
        .upload(fileKey, file, {
          cacheControl: "3600",
          upsert: false,
        })
      if (error) {
        throw error
      }
      const { data: urlData } = supabaseClient.storage.from(bucketName).getPublicUrl(data.path)
      return {
        url: urlData.publicUrl,
        key: data.path,
      }
  },

  deleteUserFile: async (userId, fileKey) => {
    try {
      const bucketName = getUserBucketName(userId)
      const { error } = await supabaseClient.storage.from(bucketName).remove([fileKey])
      if (error) {
        console.error("Error deleting file:", error)
        return false
      }
      return true
    } catch (error) {
      console.error("Error deleting user file:", error)
      return false
    }
  },
  listUserFiles: getUserFiles
}

// React Query Hooks
export function useInitializeUserStorage() {
  return useMutation({
    mutationFn: storageClientService.initializeUserStorage,
    onSuccess: () => toast.success("User storage initialized"),
    onError: (error: Error) => toast.error(error.message),
  })
}

export function useUploadUserFile() {
  return useMutation({
    mutationFn: async (params: {
      userId: string
      file: File
      path?: string
    }) => storageClientService.uploadUserFile(params.userId, params.file, params.path),
    onSuccess: () => toast.success("File uploaded successfully"),
    onError: (error: Error) => toast.error(error.message),
  })
}

export function useDeleteUserFile() {
  return useMutation({
    mutationFn: async (params: { userId: string; fileKey: string }) =>
      storageClientService.deleteUserFile(params.userId, params.fileKey),
    onSuccess: () => toast.success("File deleted successfully"),
    onError: (error: Error) => toast.error(error.message),
  })
}


export function useListUserFiles() {
  return useMutation({
    mutationFn: async ({userId, path}: {userId: string, path: string}) => 
        storageClientService.listUserFiles(userId, path),
    onSuccess: () => toast.success("Files listed successfully"),
    onError: (error: Error) => toast.error(error.message),
  })
  }
