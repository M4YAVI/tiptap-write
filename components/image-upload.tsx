"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { uploadImage } from "@/lib/supabase/storage"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { ImagePlus, Trash, Upload } from "lucide-react"

interface ImageUploadProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return

    const file = e.target.files[0]

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      const { data, error } = await uploadImage(file)

      if (error) throw error

      onChange(data.url)

      toast({
        title: "Image uploaded",
        description: "Your image has been uploaded successfully.",
      })
    } catch (error) {
      console.error("Image upload error:", error)
      toast({
        title: "Upload failed",
        description: "There was an error uploading your image.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    onChange("")
  }

  return (
    <div className={cn("relative rounded-md overflow-hidden border", className)}>
      {value ? (
        <>
          <div className="absolute top-2 right-2 z-10 flex gap-2">
            <Button size="icon" variant="destructive" onClick={handleRemove} className="h-8 w-8">
              <Trash className="h-4 w-4" />
              <span className="sr-only">Remove image</span>
            </Button>
          </div>
          <Image src={value || "/placeholder.svg"} alt="Cover image" fill className="object-cover" />
        </>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer bg-muted/50">
          {isUploading ? (
            <div className="flex flex-col items-center justify-center p-6">
              <Upload className="h-10 w-10 text-muted-foreground animate-pulse" />
              <p className="mt-2 text-sm text-muted-foreground">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6">
              <ImagePlus className="h-10 w-10 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Drag and drop or click to upload</p>
              <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
            </div>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={isUploading} />
        </label>
      )}
    </div>
  )
}

