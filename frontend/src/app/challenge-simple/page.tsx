import { fetchCategories } from '@/lib/categories'
import { fetchProducts } from '@/lib/products'
import { Suspense } from 'react'
import { Spinner } from '@/components/utils/Spinner'
import { ProductGridSimple } from '@/components/ProductGrid/ProductGridSimple'

async function ProductGridComponent() {
  // Initial fetching data required for the ProductGrid component on the server-side.
  const [productsData, categoriesData] = await Promise.all([fetchProducts(), fetchCategories()])

  return <ProductGridSimple productsData={productsData} categoriesData={categoriesData} />
}

export default async function Challenge() {
  return (
    <>
      <Suspense fallback={<Spinner />}>
        <ProductGridComponent />
      </Suspense>
    </>
  )
}
