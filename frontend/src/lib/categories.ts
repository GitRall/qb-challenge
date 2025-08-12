'use server'

export async function fetchCategories() {
  const response = await fetch(`${process.env.BACKEND_URL}/api/v1/categories`)

  if (!response.ok) {
    throw new Error(`Backend request failed: ${response.status}`)
  }

  const data = await response.json()
  return data
}
