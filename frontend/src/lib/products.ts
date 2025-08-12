'use server'

import { ProductsResponseData } from '@/types/Product'

export async function fetchProducts(page: number = 1, limit: number = 10) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/v1/products?page=${page}&limit=${limit}`,
  )

  if (!response.ok) {
    throw new Error(`Backend request failed: ${response.status}`)
  }

  const data: ProductsResponseData = await response.json()
  return data
}
