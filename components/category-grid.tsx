import { WritingCard } from "@/components/writing-card"
import { getCategoryWritings } from "@/lib/supabase/writings"

interface CategoryGridProps {
  category: string
  limit?: number
}

export async function CategoryGrid({ category, limit = 6 }: CategoryGridProps) {
  const { data: writings } = await getCategoryWritings(category, limit)

  if (!writings?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No writings found in this category.</p>
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

