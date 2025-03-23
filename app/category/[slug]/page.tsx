import { Suspense } from "react"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Skeleton } from "@/components/ui/skeleton"
import { getAllCategories } from "@/lib/supabase/metadata"
import { CategoryGrid } from "@/components/category-grid"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = params.slug

  return {
    title: `${category.charAt(0).toUpperCase() + category.slice(1)} | Pencraft`,
    description: `Explore ${category} writings on Pencraft`,
  }
}

export async function generateStaticParams() {
  const { data: categories } = await getAllCategories()

  return (
    categories?.map((category) => ({
      slug: category,
    })) || []
  )
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { data: categories } = await getAllCategories()

  if (!categories?.includes(params.slug)) {
    notFound()
  }

  const categoryName = params.slug.charAt(0).toUpperCase() + params.slug.slice(1)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">{categoryName}</h1>
        <p className="text-xl text-muted-foreground">{getCategoryDescription(params.slug)}</p>
      </div>

      <Suspense fallback={<CategoryGridSkeleton />}>
        <CategoryGrid category={params.slug} limit={24} />
      </Suspense>
    </div>
  )
}

function CategoryGridSkeleton() {
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

function getCategoryDescription(category: string): string {
  switch (category) {
    case "novel":
      return "Immerse yourself in captivating stories and narratives from talented writers."
    case "thought":
      return "Explore ideas, reflections, and philosophical musings on various topics."
    case "review":
      return "Discover critiques and analyses of books, films, products, and more."
    default:
      return "Explore writings in this category."
  }
}

