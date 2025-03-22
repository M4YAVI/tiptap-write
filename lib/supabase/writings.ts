import { supabase } from "./client"

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

export async function getUserStats() {
  // This would typically be a server-side function or a stored procedure
  // For simplicity, we're mocking the response
  return {
    data: {
      totalWritings: 12,
      totalWords: 24680,
      totalReadingTime: 123,
    },
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

