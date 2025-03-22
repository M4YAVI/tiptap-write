"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/image-upload"
import { Editor } from "@/components/editor"
import { saveWriting } from "@/lib/supabase/writings"
import { toast } from "@/components/ui/use-toast"
import { generateSlug } from "@/lib/utils"

export default function WritePage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [coverImage, setCoverImage] = useState("")
  const [category, setCategory] = useState("thought")
  const [tags, setTags] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [autoSaveStatus, setAutoSaveStatus] = useState("")
  const [activeTab, setActiveTab] = useState("write")

  // Auto-save functionality
  useEffect(() => {
    const autoSaveTimer = setTimeout(async () => {
      if (title && content) {
        setAutoSaveStatus("Saving...")
        try {
          const draftData = {
            title,
            content,
            cover_image: coverImage,
            category,
            tags: tags.split(",").map((tag) => tag.trim()),
            is_draft: true,
          }

          // Save to local storage as backup
          localStorage.setItem("writing_draft", JSON.stringify(draftData))
          setAutoSaveStatus("Draft saved")
        } catch (error) {
          console.error("Auto-save error:", error)
          setAutoSaveStatus("Auto-save failed")
        }
      }
    }, 5000)

    return () => clearTimeout(autoSaveTimer)
  }, [title, content, coverImage, category, tags])

  // Load draft from local storage
  useEffect(() => {
    const savedDraft = localStorage.getItem("writing_draft")
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft)
        setTitle(draftData.title || "")
        setContent(draftData.content || "")
        setCoverImage(draftData.cover_image || "")
        setCategory(draftData.category || "thought")
        setTags(draftData.tags?.join(", ") || "")
      } catch (error) {
        console.error("Error loading draft:", error)
      }
    }
  }, [])

  const handlePublish = async () => {
    if (!title) {
      toast({
        title: "Title required",
        description: "Please add a title to your writing",
        variant: "destructive",
      })
      return
    }

    if (!content) {
      toast({
        title: "Content required",
        description: "Please add some content to your writing",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      const slug = generateSlug(title)
      const writingData = {
        title,
        content,
        cover_image: coverImage,
        category,
        tags: tags.split(",").map((tag) => tag.trim()),
        slug,
        is_draft: false,
      }

      const { data, error } = await saveWriting(writingData)

      if (error) throw error

      // Clear draft from local storage
      localStorage.removeItem("writing_draft")

      toast({
        title: "Published successfully!",
        description: "Your writing has been published",
      })

      // Redirect to the published writing
      router.push(`/writing/${data.id}`)
    } catch (error) {
      console.error("Publish error:", error)
      toast({
        title: "Publication failed",
        description: "There was an error publishing your writing",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <Input
          type="text"
          placeholder="Enter title..."
          className="text-4xl font-bold border-none p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="mb-8">
        <Label htmlFor="cover-image">Cover Image</Label>
        <ImageUpload value={coverImage} onChange={setCoverImage} className="mt-2 h-[300px]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="novel">Novel</SelectItem>
              <SelectItem value="thought">Thought</SelectItem>
              <SelectItem value="review">Review</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input
            id="tags"
            placeholder="writing, fiction, technology..."
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="write">Write</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="write" className="mt-4">
          <Editor content={content} onChange={setContent} placeholder="Start writing your masterpiece..." />
        </TabsContent>
        <TabsContent value="preview" className="mt-4">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {/* Content preview would be rendered here */}
            {content ? (
              <div dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
              <p className="text-muted-foreground">Nothing to preview yet...</p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Separator className="my-8" />

      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">{autoSaveStatus}</span>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Save as Draft
          </Button>
          <Button onClick={handlePublish} disabled={isSaving}>
            {isSaving ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </div>
    </div>
  )
}

