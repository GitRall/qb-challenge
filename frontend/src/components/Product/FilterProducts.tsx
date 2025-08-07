'use client'

import { useEffect, useState } from 'react'
import { Product } from '@/types/Product'
import { Category } from '@/types/Category'
import { CheckboxList } from '@/components/CheckboxList'

interface FilterProductsProps {
    categories: Category[],
    onSearchChange: React.FormEventHandler<HTMLInputElement>
    onCategoryChange: React.FormEventHandler<HTMLInputElement>
}

export function FilterProducts({ categories, onSearchChange, onCategoryChange }: FilterProductsProps) {
    return (
        <div>
            <input onInput={onSearchChange} type="text" name="search-input" className="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blurple focus:border-blurple block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blurple dark:focus:border-blurple" placeholder="Search" />
            <CheckboxList
                values={categories.map((c) => {
                    return { label: c.name, checked: false }
                })}
                title='Filter categories'
                onCheckboxChange={onCategoryChange}
            />
        </div>
    )
}