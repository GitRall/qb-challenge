'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { Product, PaginationData, ProductsResponseData } from '@/types/Product'
import { Category, CategoriesResponseData } from '@/types/Category'
import { ProductCard } from '@/components/ProductGrid/ProductCard'
import { ToggleInput } from '@/components/ToggleInput'
import { FilterProducts } from '@/components/Product/FilterProducts'

type View = 'list' | 'grid'

interface ProductGridProps { productsData: ProductsResponseData, categoriesData: CategoriesResponseData }

export function ProductGridSimple({ productsData, categoriesData }: ProductGridProps) {
    const [error, setError] = useState<boolean>(false)
    const [view, setView] = useState<View>('list')
    const [products, setProducts] = useState<Product[]>(productsData.products)
    const [pagination, setPagination] = useState<PaginationData>(productsData.pagination)
    const [categories] = useState<Category[]>(categoriesData.categories)
    const [loading, setLoading] = useState<boolean>(false)
    const [search, setSearch] = useState<string>('')
    const [checkedCategories, setCheckedCategories] = useState<string[]>([])
    const observer = useRef<IntersectionObserver | null>(null)

    const handleFetchProducts = async (page: number = 1, limit: number = 10) => {
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

    const cleanupObserver = () => {
        if (observer.current) observer.current.disconnect()
    }

    useEffect(() => {
        return () => {
            cleanupObserver()
        }
    }, [])

    const handleSearchFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value)
    }

    const handleCategoryFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
        const label = event.target.value.toLowerCase()
        if (event.target.checked) {
            // if checkbox is being checked we add it to the checkedCategories array
            setCheckedCategories((prevCheckedCategories) => [...prevCheckedCategories, label])
        } else {
            // if unchecked, remove item from checkedCategories
            setCheckedCategories((prevCheckedCategories) => prevCheckedCategories.filter((c) => label !== c))
        }
    }

    const filterProducts = (products: Product[]) => {
        // Check if any filtering is active
        const isFiltering = !!search || !!checkedCategories.length
        if (!isFiltering) return products

        return products.filter((product) => {
            if (!!search && !!checkedCategories.length) {
                // if both filter options are active we should check for items matching both
                return (
                    product.name.toLowerCase().includes(search.toLowerCase()) &&
                    checkedCategories.includes(product.category.name.toLowerCase())
                )
            } else {
                // check if either of the options match
                return (
                    // needs to check if search is truthy else it will match due to it being empty string
                    !!search ? product.name.toLowerCase().includes(search.toLowerCase()) : false ||
                        checkedCategories.includes(product.category.name.toLowerCase())
                )
            }
        })
    }

    const observedElement = useCallback((node: HTMLDivElement) => {
        if (loading) return
        if (observer.current) observer.current.disconnect()
        const options = {
            root: null,
            rootMargin: '0px',
            scrollMargin: '0px',
            threshold: 1.0,
        };

        observer.current = new IntersectionObserver((entries) => {
            const [entry] = entries
            if (entry.isIntersecting && pagination.hasNextPage) {
                handleFetchProducts(pagination.page + 1)
            }
        }, options);
        if (node) observer.current.observe(node)
    }, [loading, pagination])

    if (error) {
        return (
            <div className='w-4/5 mx-auto text-center px-3 py-4 bg-red-900 rounded-lg'>Can&apos;t show products at this time, try again later.</div>
        )
    }

    return (
        <>
            <ToggleInput
                labels={{
                    left: 'List',
                    right: 'Grid'
                }}
                onToggleChange={(isChecked) => {
                    setView(isChecked ? 'grid' : 'list')
                }}
            />

            <div className='mb-4'>
                <FilterProducts
                    categories={categories}
                    onSearchChange={handleSearchFilter}
                    onCategoryChange={handleCategoryFilter}
                />
            </div>

            {/* ProductCards */}
            <div className={`grid gap-4 ${view === 'grid' ? ' grid-cols-3' : ''}`}>
                {
                    filterProducts(products).map((product) => (
                        <ProductCard product={product} key={product.id} />
                    ))
                }
            </div>

            {/* Bottom element being observed for infinite scrolling */}
            <div ref={!search && !checkedCategories.length ? observedElement : null} className='py-10'>
                {loading ?
                    <div className='flex justify-center'>
                        <div className='m-4' role="status">
                            <svg aria-hidden="true" className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-sky-600 dark:fill-cyan-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                        </div>
                    </div> :
                    !pagination.hasNextPage ? <div className='text-center'>Nothing more to show</div> : null}
            </div>
        </>
    )
}