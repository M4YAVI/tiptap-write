import { Suspense } from "react"
import type { Metadata } from "next"
import { Skeleton } from "@/components/ui/skeleton"
import { TagGrid } from "@/components/ui/tag-grid"

interface TagPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const tag = params.slug

  return {
    title: `#${tag} | Pencraft`,
    description: `Explore writings tagged with #${tag} on Pencraft`,
  }
}

export default async function TagPage({ params }: TagPageProps) {
  const tag = params.slug

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">#{tag}</h1>
        <p className="text-xl text-muted-foreground">Explore writings tagged with #{tag}</p>
      </div>

      <Suspense fallback={<TagGridSkeleton />}>
        <TagGrid tag={tag} limit={24} />
      </Suspense>
    </div>
  )
}

function TagGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="flex flex-col gap-4">
            <Skeleton className="w-full h-48 rounded-lg" />
            <Skeleton className="w-3/4 h-8 rounded-md" />
            <Skeleton className="w-full h-24 rounded-md" />
            <div className="flex gap-2">
              <Skeleton className="w-20 h-6 rounded-full" />
              <Skeleton className="w-20 h-6 rounded-full" />
            </div>
          </div>
        ))}
    </div>
  )
}

