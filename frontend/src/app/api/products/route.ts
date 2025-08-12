import { fetchProducts } from "@/lib/products"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '10'

    const data = await fetchProducts(+page, +limit)

    return Response.json(data)
  } catch (error) {
    console.error('Error fetching products from backend:', error)
    // Fallback to empty products if backend is unavailable
    return Response.json({
      products: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false
      },
      error: true
    })
  }
}
