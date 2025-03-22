import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PenLine } from "lucide-react"
import WritingGrid from "@/components/writing-grid"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-4">Where words come to life</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Craft your novels, thoughts, and reviews with our elegant writing platform. Share your ideas with the world.
        </p>
        <Link href="/write">
          <Button size="lg" className="gap-2">
            <PenLine className="h-4 w-4" />
            Start Writing
          </Button>
        </Link>
      </section>

      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Recent Writings</h2>
          <Link href="/explore">
            <Button variant="ghost">View all</Button>
          </Link>
        </div>

        <Suspense fallback={<WritingGridSkeleton />}>
          <WritingGrid />
        </Suspense>
      </section>
    </div>
  )
}

function WritingGridSkeleton() {
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

