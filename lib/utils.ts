import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export function calculateReadingTime(content: string) {
  // Strip HTML tags
  const text = content.replace(/<[^>]*>/g, "")

  // Average reading speed: 200 words per minute
  const words = text.trim().split(/\s+/).length
  const minutes = Math.ceil(words / 200)

  return minutes || 1 // Minimum 1 minute
}

