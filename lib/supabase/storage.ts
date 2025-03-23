import { supabase } from "./client"
import { v4 as uuidv4 } from "uuid"

// Maximum file size in bytes (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024

export interface UploadImageResult {
  data: {
    path: string
    url: string
    fileSize: number
    fileType: string
  } | null
  error: Error | null
}

/**
 * Validates an image file before upload
 */
export function validateImage(file: File): { valid: boolean; error?: string } {
  // Check if file is an image
  if (!file.type.startsWith("image/")) {
    return { valid: false, error: "File must be an image" }
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "File size must be less than 5MB" }
  }

  return { valid: true }
}

/**
 * Uploads an image to Supabase Storage
 */
export async function uploadImage(file: File): Promise<UploadImageResult> {
  try {
    // Validate the file
    const validation = validateImage(file)
    if (!validation.valid) {
      throw new Error(validation.error)
    }

    // Generate a unique file name
    const fileExt = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = `images/${fileName}`

    // Upload the file
    const { data, error } = await supabase.storage.from("writing-assets").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) throw error

    // Get the public URL
    const { data: urlData } = supabase.storage.from("writing-assets").getPublicUrl(filePath)

    return {
      data: {
        path: filePath,
        url: urlData.publicUrl,
        fileSize: file.size,
        fileType: file.type,
      },
      error: null,
    }
  } catch (error) {
    console.error("Error uploading image:", error)
    return {
      data: null,
      error: error instanceof Error ? error : new Error("Unknown error occurred"),
    }
  }
}

/**
 * Deletes an image from Supabase Storage
 */
export async function deleteImage(path: string) {
  try {
    const { error } = await supabase.storage.from("writing-assets").remove([path])

    if (error) throw error

    return { success: true, error: null }
  } catch (error) {
    console.error("Error deleting image:", error)
    return {
      success: false,
      error: error instanceof Error ? error : new Error("Unknown error occurred"),
    }
  }
}

/**
 * Extracts the file path from a Supabase Storage URL
 */
export function getPathFromUrl(url: string): string | null {
  try {
    // Extract the path from the URL
    // Example: https://xxxx.supabase.co/storage/v1/object/public/writing-assets/images/uuid.jpg
    const storageUrl = new URL(url)
    const pathMatch = storageUrl.pathname.match(/\/public\/writing-assets\/(.*)/)

    if (pathMatch && pathMatch[1]) {
      return pathMatch[1]
    }
    return null
  } catch (error) {
    console.error("Error extracting path from URL:", error)
    return null
  }
}

