import { Suspense } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import { format } from "date-fns"
import { Clock, Calendar, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { TableOfContents } from "@/components/table-of-contents"
import { getWritingById } from "@/lib/supabase/writings"
import { calculateReadingTime } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface WritingPageProps {
  params: {
    id: string
  }
}

export default async function WritingPage({ params }: WritingPageProps) {
  const { data: writing, error } = await getWritingById(params.id)

  if (error || !writing) {
    notFound()
  }

  const readingTime = calculateReadingTime(writing.content)

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">{writing.title}</h1>

          <div className="flex flex-wrap gap-4 mb-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <time dateTime={writing.created_at}>{format(new Date(writing.created_at), "MMMM d, yyyy")}</time>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{readingTime} min read</span>
            </div>
            <Badge variant="secondary" className="capitalize">
              {writing.category}
            </Badge>
          </div>

          {writing.cover_image && (
            <div className="relative w-full h-[400px] rounded-lg overflow-hidden mb-8">
              <Image
                src={writing.cover_image || "/placeholder.svg"}
                alt={writing.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 shrink-0 hidden lg:block">
            <div className="sticky top-8">
              <h3 className="font-medium mb-4">Table of Contents</h3>
              <Suspense fallback={<TableOfContentsSkeleton />}>
                <TableOfContents content={writing.content} />
              </Suspense>
            </div>
          </aside>

          <div className="flex-1">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: writing.content }} />
            </div>

            <Separator className="my-8" />

            <div className="flex flex-wrap gap-2 mb-8">
              <Tag className="h-4 w-4 mr-1" />
              {writing.tags?.map((tag: string) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}

function TableOfContentsSkeleton() {
  return (
    <div className="space-y-2">
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
    </div>
  )
}

