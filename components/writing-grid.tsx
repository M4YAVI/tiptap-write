import { WritingCard } from "@/components/writing-card"
import { getRecentWritings } from "@/lib/supabase/writings"

export default async function WritingGrid() {
  const { data: writings } = await getRecentWritings()

  if (!writings?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No writings found.</p>
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

