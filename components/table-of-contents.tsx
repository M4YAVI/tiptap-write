"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface Heading {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>("")

  // Extract headings from content
  useEffect(() => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, "text/html")
    const headingElements = doc.querySelectorAll("h1, h2, h3")

    const extractedHeadings: Heading[] = Array.from(headingElements).map((el, index) => {
      const id = el.id || `heading-${index}`
      const level = Number.parseInt(el.tagName.substring(1))

      return {
        id,
        text: el.textContent || "",
        level,
      }
    })

    setHeadings(extractedHeadings)
  }, [content])

  // Track active heading on scroll
  useEffect(() => {
    if (!headings.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "0px 0px -80% 0px" },
    )

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element) observer.observe(element)
    })

    return () => {
      headings.forEach((heading) => {
        const element = document.getElementById(heading.id)
        if (element) observer.unobserve(element)
      })
    }
  }, [headings])

  if (!headings.length) {
    return <p className="text-sm text-muted-foreground">No headings found</p>
  }

  return (
    <nav className="space-y-1">
      {headings.map((heading) => (
        <a
          key={heading.id}
          href={`#${heading.id}`}
          className={cn(
            "block text-sm transition-colors hover:text-foreground",
            heading.level === 1 && "pl-0",
            heading.level === 2 && "pl-4",
            heading.level === 3 && "pl-8",
            activeId === heading.id ? "font-medium text-foreground" : "text-muted-foreground",
          )}
        >
          {heading.text}
        </a>
      ))}
    </nav>
  )
}

