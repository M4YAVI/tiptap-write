"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import { common, createLowlight } from "lowlight"
import Placeholder from "@tiptap/extension-placeholder"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Code,
  LinkIcon,
  ImageIcon,
  Undo,
  Redo,
} from "lucide-react"
import { uploadImage, validateImage } from "@/lib/supabase/storage"
import { toast } from "@/components/ui/use-toast"
import { CodeBlockExtension } from "./editor/code-block-extension"

const lowlight = createLowlight(common)

interface EditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export function Editor({ content, onChange, placeholder = "Start writing..." }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable the built-in code block
        codeBlock: false,
      }),
      CodeBlockExtension.configure({
        HTMLAttributes: {
          class: "code-block",
        },
      }),
      Image.configure({
        allowBase64: true,
        inline: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    // Add a paste handler directly to the editor
    editorProps: {
      handlePaste: (view, event) => {
        const items = Array.from(event.clipboardData?.items || [])
        const imageItems = items.filter((item) => item.type.startsWith("image"))

        if (imageItems.length === 0) {
          return false
        }

        event.preventDefault()

        imageItems.forEach((item) => {
          const file = item.getAsFile()
          if (!file) return

          const validation = validateImage(file)
          if (!validation.valid) {
            toast({
              title: "Invalid file",
              description: validation.error,
              variant: "destructive",
            })
            return
          }

          toast({
            title: "Uploading image...",
            description: "Please wait while we upload your pasted image.",
          })

          uploadImage(file).then(({ data, error }) => {
            if (error || !data) {
              toast({
                title: "Upload failed",
                description: error?.message || "There was an error uploading your image.",
                variant: "destructive",
              })
              return
            }

            editor?.chain().focus().setImage({ src: data.url }).run()

            toast({
              title: "Image uploaded",
              description: "Your pasted image has been uploaded successfully.",
            })
          })
        })

        return true
      },
    },
  })

  if (!editor) {
    return null
  }

  const addImage = async () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"

    input.onchange = async () => {
      if (!input.files?.length) return

      const file = input.files[0]

      const validation = validateImage(file)
      if (!validation.valid) {
        toast({
          title: "Invalid file",
          description: validation.error,
          variant: "destructive",
        })
        return
      }

      try {
        toast({
          title: "Uploading image...",
          description: "Please wait while we upload your image.",
        })

        const { data, error } = await uploadImage(file)

        if (error) throw error
        if (!data) throw new Error("No data returned from upload")

        editor.chain().focus().setImage({ src: data.url }).run()

        toast({
          title: "Image uploaded",
          description: "Your image has been uploaded successfully.",
        })
      } catch (error) {
        console.error("Image upload error:", error)
        toast({
          title: "Upload failed",
          description: error instanceof Error ? error.message : "There was an error uploading your image.",
          variant: "destructive",
        })
      }
    }

    input.click()
  }

  const addLink = () => {
    const url = window.prompt("URL")

    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    } else {
      editor.chain().focus().unsetLink().run()
    }
  }

  const addCodeBlock = () => {
    editor.chain().focus().toggleCodeBlock().run()
  }

  return (
    <div className="border rounded-md">
      <div className="flex flex-wrap gap-1 p-2 border-b">
        <Toggle
          size="sm"
          pressed={editor.isActive("bold")}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          aria-label="Bold"
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("italic")}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          aria-label="Italic"
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 1 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          aria-label="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 2 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          aria-label="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 3 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          aria-label="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("bulletList")}
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
          aria-label="Bullet List"
        >
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("orderedList")}
          onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
          aria-label="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("blockquote")}
          onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
          aria-label="Quote"
        >
          <Quote className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive("codeBlock")} onPressedChange={addCodeBlock} aria-label="Code Block">
          <Code className="h-4 w-4" />
        </Toggle>
        <Button size="sm" variant="ghost" onClick={addLink}>
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost" onClick={addImage}>
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
      <EditorContent editor={editor} className="prose prose-sm sm:prose-base dark:prose-invert max-w-none p-4" />
    </div>
  )
}

