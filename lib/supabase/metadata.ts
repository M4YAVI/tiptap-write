export async function getAllTags() {
  // In a real app, this would fetch from a tags table
  // For simplicity, we're returning mock data
  return {
    data: [
      "fiction",
      "non-fiction",
      "technology",
      "science",
      "philosophy",
      "history",
      "art",
      "music",
      "travel",
      "food",
      "health",
      "business",
      "politics",
      "education",
    ],
  }
}

export async function getAllCategories() {
  // In a real app, this would fetch from a categories table
  // For simplicity, we're returning the fixed categories
  return {
    data: ["novel", "thought", "review"],
  }
}

