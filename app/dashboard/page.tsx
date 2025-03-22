import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import { WritingList } from "@/components/writing-list"
import { WritingStats } from "@/components/writing-stats"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Writings</h1>
        <Link href="/write">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Writing
          </Button>
        </Link>
      </div>

      <Suspense fallback={<WritingStatsSkeleton />}>
        <WritingStats />
      </Suspense>

      <Tabs defaultValue="published" className="mt-8">
        <TabsList>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
        </TabsList>
        <TabsContent value="published" className="mt-4">
          <Suspense fallback={<WritingListSkeleton />}>
            <WritingList type="published" />
          </Suspense>
        </TabsContent>
        <TabsContent value="drafts" className="mt-4">
          <Suspense fallback={<WritingListSkeleton />}>
            <WritingList type="drafts" />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function WritingStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
    </div>
  )
}

function WritingListSkeleton() {
  return (
    <div className="space-y-4">
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
    </div>
  )
}

