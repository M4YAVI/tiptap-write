import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { calculateReadingTime } from "@/lib/utils"

interface WritingCardProps {
  writing: {
    id: string
    title: string
    content: string
    cover_image: string
    category: string
    tags: string[]
    created_at: string
  }
}

export function WritingCard({ writing }: WritingCardProps) {
  const readingTime = calculateReadingTime(writing.content)

  return (
    <Link href={`/writing/${writing.id}`}>
      <Card className="overflow-hidden h-full transition-all hover:shadow-md">
        <div className="relative aspect-video">
          {writing.cover_image ? (
            <Image src={writing.cover_image || "/placeholder.svg"} alt={writing.title} fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No cover image</span>
            </div>
          )}
          <div className="absolute top-2 right-2">
            <Badge className="capitalize">{writing.category}</Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="text-xl font-semibold line-clamp-2 mb-2">{writing.title}</h3>
          <div
            className="text-sm text-muted-foreground line-clamp-3"
            dangerouslySetInnerHTML={{
              __html: writing.content.replace(/<[^>]*>/g, " ").substring(0, 150) + "...",
            }}
          />
        </CardContent>
        <CardFooter className="p-4 pt-0 text-xs text-muted-foreground">
          <div className="flex justify-between w-full">
            <time dateTime={writing.created_at}>{format(new Date(writing.created_at), "MMM d, yyyy")}</time>
            <span>{readingTime} min read</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}

