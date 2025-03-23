import { WritingCard } from "@/components/writing-card"
import { getTagWritings } from "@/lib/supabase/writings"

interface TagGridProps {
  tag: string
  limit?: number
}

export async function TagGrid({ tag, limit = 6 }: TagGridProps) {
  const { data: writings } = await getTagWritings(tag, limit)

  if (!writings?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No writings found with this tag.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {writings.map((writing) => (
        <WritingCard key={writing.id} writing={writing} />
      ))}
    </div>
  )
}

