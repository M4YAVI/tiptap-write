import { supabase } from "./client"
import { v4 as uuidv4 } from "uuid"

export async function uploadImage(file: File) {
  const fileExt = file.name.split(".").pop()
  const fileName = `${uuidv4()}.${fileExt}`
  const filePath = `images/${fileName}`

  const { data, error } = await supabase.storage.from("writing-assets").upload(filePath, file)

  if (error) {
    return { data: null, error }
  }

  const { data: urlData } = supabase.storage.from("writing-assets").getPublicUrl(filePath)

  return {
    data: {
      path: filePath,
      url: urlData.publicUrl,
    },
    error: null,
  }
}

