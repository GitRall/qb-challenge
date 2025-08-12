import { fetchCategories } from "@/lib/categories"

export async function GET() {
  try {
    const data = fetchCategories()

    return Response.json(data)
  } catch (error) {
    console.error('Error fetching categories from backend:', error)
    // Fallback to empty categories if backend is unavailable
    return Response.json({
      categories: [],
      error: true
    })
  }
}
