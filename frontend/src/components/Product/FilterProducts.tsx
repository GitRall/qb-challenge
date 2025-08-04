'use client'

import { useEffect, useState } from 'react'
import { Product } from '@/types/Product'
import { Category } from '@/types/Category'
import { CheckboxList } from '@/components/CheckboxList'

export function FilterProducts({ products, categories, callback }: { products: Product[], categories: Category[], callback: (arr: Product[], isFiltering: boolean) => unknown }) {
    const [search, setSearch] = useState<string>('')
    const [checkedCategories, setCheckedCategories] = useState<string[]>([])

    const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value)
    }

    useEffect(() => {
        const isFiltering = !!search || !!checkedCategories.length
        // Filter products on input value
        const filtered = products.filter((product) => {
            if (!!search && !!checkedCategories.length) {
                return (
                    product.name.toLowerCase().includes(search.toLowerCase()) &&
                    checkedCategories.includes(product.category.name.toLowerCase())
                )
            } else {
                return (
                    !!search ? product.name.toLowerCase().includes(search.toLowerCase()) : false ||
                        checkedCategories.includes(product.category.name.toLowerCase())
                )
            }
        })
        callback(filtered, isFiltering)
    }, [search, checkedCategories])


    return (
        <div>
            <input onInput={handleSearchInput} type="text" name="search-input" className="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blurple focus:border-blurple block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blurple dark:focus:border-blurple" placeholder="Search" />
            <CheckboxList
                values={categories.map((c) => {
                    return { label: c.name, checked: false }
                })}
                title='Filter categories'
                callback={(label, checked) => {
                    label = label.toLowerCase()
                    let rv: string[] = []
                    if (checked) {
                        rv = [...checkedCategories, label]

                    } else {
                        const index = checkedCategories.findIndex((c) => c === label)
                        if (index > -1) {
                            checkedCategories.splice(index, 1)
                            rv = [...checkedCategories]
                        }
                    }
                    setCheckedCategories(rv)
                }}
            />
        </div>
    )
}