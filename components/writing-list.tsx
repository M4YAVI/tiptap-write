"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getUserWritings, deleteWriting } from "@/lib/supabase/writings"
import { calculateReadingTime } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { Edit, MoreHorizontal, Trash } from "lucide-react"

interface WritingListProps {
  type: "published" | "drafts"
}

export async function WritingList({ type }: WritingListProps) {
  const router = useRouter()
  const [writings, setWritings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useState(async () => {
    try {
      const { data } = await getUserWritings(type === "drafts")
      setWritings(data || [])
    } catch (error) {
      console.error("Error fetching writings:", error)
    } finally {
      setIsLoading(false)
    }
  })

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      const { error } = await deleteWriting(deleteId)

      if (error) throw error

      setWritings(writings.filter((writing) => writing.id !== deleteId))

      toast({
        title: "Writing deleted",
        description: "Your writing has been deleted successfully.",
      })
    } catch (error) {
      console.error("Delete error:", error)
      toast({
        title: "Delete failed",
        description: "There was an error deleting your writing.",
        variant: "destructive",
      })
    } finally {
      setDeleteId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!writings.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          {type === "published" ? "You haven't published any writings yet." : "You don't have any drafts."}
        </p>
        <Button className="mt-4" onClick={() => router.push("/write")}>
          Start Writing
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {writings.map((writing) => (
        <div
          key={writing.id}
          className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium truncate">{writing.title}</h3>
              <Badge variant="outline" className="capitalize">
                {writing.category}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <time dateTime={writing.created_at}>{format(new Date(writing.created_at), "MMM d, yyyy")}</time>
              <span>{calculateReadingTime(writing.content)} min read</span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/write/${writing.id}`} className="flex items-center">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setDeleteId(writing.id)}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your writing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

