import { supabase } from "./client"
import { deleteImage, getPathFromUrl } from "./storage"

export async function getRecentWritings(limit = 6) {
  return supabase
    .from("writings")
    .select("*")
    .eq("is_draft", false)
    .order("created_at", { ascending: false })
    .limit(limit)
}

export async function getWritingById(id: string) {
  return supabase.from("writings").select("*").eq("id", id).single()
}

export async function getUserWritings(isDraft = false) {
  return supabase.from("writings").select("*").eq("is_draft", isDraft).order("created_at", { ascending: false })
}

export async function saveWriting(writingData: any) {
  if (writingData.id) {
    return supabase.from("writings").update(writingData).eq("id", writingData.id).select().single()
  } else {
    return supabase.from("writings").insert([writingData]).select().single()
  }
}

export async function deleteWriting(id: string) {
  return supabase.from("writings").delete().eq("id", id)
}

// Add this function to get writings by category
export async function getCategoryWritings(category: string, limit = 6) {
  return supabase
    .from("writings")
    .select("*")
    .eq("is_draft", false)
    .eq("category", category)
    .order("created_at", { ascending: false })
    .limit(limit)
}

// Add this function to get writings by tag
export async function getTagWritings(tag: string, limit = 6) {
  return supabase
    .from("writings")
    .select("*")
    .eq("is_draft", false)
    .contains("tags", [tag])
    .order("created_at", { ascending: false })
    .limit(limit)
}

// Add this function to get real user stats
export async function getUserStats() {
  try {
    // Get all published writings
    const { data: publishedWritings, error: publishedError } = await supabase
      .from("writings")
      .select("content, created_at")
      .eq("is_draft", false)

    if (publishedError) throw publishedError

    // Get all draft writings
    const { data: draftWritings, error: draftError } = await supabase.from("writings").select("id").eq("is_draft", true)

    if (draftError) throw draftError

    // Calculate total words
    const totalWords = publishedWritings.reduce((acc, writing) => {
      // Strip HTML tags and count words
      const text = writing.content.replace(/<[^>]*>/g, "")
      const words = text.trim().split(/\s+/).length
      return acc + words
    }, 0)

    // Calculate total reading time (average 200 words per minute)
    const totalReadingTime = Math.ceil(totalWords / 200)

    return {
      data: {
        totalWritings: publishedWritings.length,
        totalDrafts: draftWritings.length,
        totalWords,
        totalReadingTime,
      },
      error: null,
    }
  } catch (error) {
    console.error("Error getting user stats:", error)
    return {
      data: {
        totalWritings: 0,
        totalDrafts: 0,
        totalWords: 0,
        totalReadingTime: 0,
      },
      error,
    }
  }
}

export async function searchWritings({
  query,
  category,
  tags,
}: {
  query?: string
  category?: string
  tags?: string[]
}) {
  let queryBuilder = supabase.from("writings").select("*").eq("is_draft", false)

  if (query) {
    queryBuilder = queryBuilder.or(`title.ilike.%${query}%,content.ilike.%${query}%`)
  }

  if (category) {
    queryBuilder = queryBuilder.eq("category", category)
  }

  if (tags && tags.length > 0) {
    // This assumes tags are stored as an array in Supabase
    queryBuilder = queryBuilder.contains("tags", tags)
  }

  return queryBuilder.order("created_at", { ascending: false })
}

/**
 * Deletes a writing and its associated cover image
 */
export async function deleteWritingWithCleanup(id: string) {
  try {
    // First, get the writing to access its cover image
    const { data: writing, error: fetchError } = await getWritingById(id)

    if (fetchError) throw fetchError

    // Delete the writing
    const { error: deleteError } = await supabase.from("writings").delete().eq("id", id)

    if (deleteError) throw deleteError

    // If there was a cover image, delete it from storage
    if (writing?.cover_image) {
      const imagePath = getPathFromUrl(writing.cover_image)
      if (imagePath) {
        await deleteImage(imagePath)
      }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error("Error deleting writing:", error)
    return {
      success: false,
      error: error instanceof Error ? error : new Error("Unknown error occurred"),
    }
  }
}

