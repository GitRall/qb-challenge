'use client'

import { useEffect, useState, PropsWithChildren, useCallback } from 'react'
import { Product } from '@/types/Product'
import { Category } from '@/types/Category'
import { ProductCard } from '@/components/ProductGrid/ProductCard'
import { ToggleInput } from '@/components/ToggleInput'
import { FilterProducts } from '@/components/Product/FilterProducts'
import { Virtuoso, VirtuosoGrid, GridItemProps, GridListProps } from 'react-virtuoso'
import { forwardRef, Ref } from 'react'

interface PaginationData {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

interface ProductsResponseData {
  products: Product[]
  pagination: PaginationData
  error?: boolean
}



interface CategoriesResponseData {
  categories: Category[]
}

type View = 'list' | 'grid'

{/* gridComponents and ItemWrapper is used by VirtuosoGrid. 
  These needs to stay outside the component. 
  Otherwise the grid will remount with each render due to new component instances. */ }
const gridComponents = {
  List: forwardRef(({ style, children, ...props }: GridListProps, ref: Ref<HTMLDivElement>) => (
    <div
      ref={ref}
      {...props}
      style={{
        ...style,
      }}
      className='flex flex-wrap'
    >
      {children}
    </div>
  )),
  Item: ({ children, ...props }: GridItemProps) => (
    <div
      {...props}
      className='p-[8] w-[33%]'
    >
      {children}
    </div>
  ),
}

const ItemWrapper = ({ children, ...props }: PropsWithChildren) => (
  <div
    {...props}
    className='h-[300px]'
  >
    {children}
  </div>
);

export function ProductGrid() {
  const [error, setError] = useState<boolean>(false)
  const [view, setView] = useState<View>('list')
  const [products, setProducts] = useState<Product[]>([])
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  })
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [isFiltering, setIsFiltering] = useState<boolean>(false)

  const fetchProducts = async (page: number = 1, limit: number = 10) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/products?page=${page}&limit=${limit}`)
      const data: ProductsResponseData = await response.json()
      setProducts(products => [...products, ...data.products])
      setPagination(() => { return { ...data.pagination } })

      if (data.error) {
        setError(true)
      }

    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data: CategoriesResponseData = await response.json()
      setCategories(data.categories)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  useEffect(() => {
    // initial fetch
    fetchProducts()
    fetchCategories()
  }, [])

  const handleFilter = useCallback((products: Product[], isFiltering: boolean) => {
    setFilteredProducts(products)
    setIsFiltering(isFiltering)
  }, [])

  const Footer = () => {
    if (loading) {
      return (
        <div className='flex justify-center py-10'>
          <div className='m-4' role="status">
            <svg aria-hidden="true" className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-sky-600 dark:fill-cyan-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
          </div>
        </div>
      )
    } else if (!pagination.hasNextPage) {
      return (
        <div className='text-center py-10'>Nothing more to show</div>
      )
    }
  }

  if (error) {
    return (
      <div className='w-4/5 mx-auto text-center px-3 py-4 bg-red-900 rounded-lg'>Can&apos;t show products at this time, try again later.</div>
    )
  }

  return (
    <div>
      <ToggleInput
        labels={{
          left: 'List',
          right: 'Grid'
        }}
        callback={(isChecked) => {
          setView(isChecked ? 'grid' : 'list')
        }}
      />

      <div className='mb-4'>
        <FilterProducts
          products={products}
          callback={handleFilter}
          categories={categories}
        />
      </div>

      {view === 'list' ? <Virtuoso
        useWindowScroll
        totalCount={pagination.total}
        data={isFiltering ? filteredProducts : products}
        endReached={() => pagination.hasNextPage && !isFiltering ? fetchProducts(pagination.page + 1) : null}
        components={{ Footer }}
        itemContent={(_, product) => (
          <div className='grid gap-4 mb-5'>
            <ProductCard product={product} />
          </div>
        )}
      />
        :
        <VirtuosoGrid
          useWindowScroll
          totalCount={pagination.total}
          data={isFiltering ? filteredProducts : products}
          components={{ List: gridComponents.List, Item: gridComponents.Item, Footer }}
          endReached={() => pagination.hasNextPage && !isFiltering ? fetchProducts(pagination.page + 1) : null}
          itemContent={(_, product) => <ItemWrapper>
            <ProductCard product={product} />
          </ItemWrapper>}
        />}
    </div>
  )
}
