import { Suspense } from "react"
import Link from "next/link"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { getAllCategories } from "@/lib/supabase/metadata"
import WritingGrid from "@/components/writing-grid"
import { Skeleton } from "@/components/ui/skeleton"
import { CategoryGrid } from "@/components/category-grid"

export const metadata: Metadata = {
  title: "Explore Writings | Pencraft",
  description: "Discover novels, thoughts, and reviews from writers around the world",
}

export default async function ExplorePage() {
  const { data: categories } = await getAllCategories()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Explore Writings</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover novels, thoughts, and reviews from writers around the world
        </p>
      </div>

      <Tabs defaultValue="all" className="mb-12">
        <div className="flex justify-center mb-8">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            {categories?.map((category) => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="all">
          <Suspense fallback={<WritingGridSkeleton />}>
            <WritingGrid limit={12} />
          </Suspense>
        </TabsContent>

        {categories?.map((category) => (
          <TabsContent key={category} value={category}>
            <Suspense fallback={<WritingGridSkeleton />}>
              <CategoryGrid category={category} limit={12} />
            </Suspense>
          </TabsContent>
        ))}
      </Tabs>

      <Separator className="my-12" />

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Looking for something specific?</h2>
        <p className="text-muted-foreground mb-6">Use our search to find writings by title, content, or tags</p>
        <Link href="/search">
          <Button size="lg">Search Writings</Button>
        </Link>
      </div>
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

