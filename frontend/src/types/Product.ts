export interface Product {
  id: string
  name: string
  price: number
  description: string
  image_url: string
  category_id: number
  category: {
    id: number
    name: string
  }
  stock_quantity: number
  rating: number
}

export interface ProductsResponseData {
  products: Product[]
  pagination: PaginationData
  error?: boolean
}

export interface PaginationData {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}