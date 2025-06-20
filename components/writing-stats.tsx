import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserStats } from "@/lib/supabase/writings"
import { BookText, Clock, Hash, FileText } from "lucide-react"

export async function WritingStats() {
  const { data } = await getUserStats()

  const stats = [
    {
      title: "Published",
      value: data?.totalWritings || 0,
      icon: BookText,
    },
    {
      title: "Drafts",
      value: data?.totalDrafts || 0,
      icon: FileText,
    },
    {
      title: "Total Words",
      value: data?.totalWords?.toLocaleString() || 0,
      icon: Hash,
    },
    {
      title: "Reading Time",
      value: `${data?.totalReadingTime || 0} min`,
      icon: Clock,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

