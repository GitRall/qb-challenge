import { Product } from '@/types/Product'

export function FilterProducts({ products, callback }: { products: Product[], callback: (arr: Product[], value: string) => unknown }) {

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.toLowerCase()

        // Early return empty array if no search value is set
        if (!value) {
            callback([], '')
            return
        }
        // Filter products on input value
        const filtered = products.filter((product) => {
            return (
                product.name.toLowerCase().includes(value)
            )
        })
        // callback function
        callback(filtered, value)
    }

    return (
        <div>
            <input onInput={handleInput} type="text" name="search-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blurple focus:border-blurple block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blurple dark:focus:border-blurple" placeholder="Search" />
        </div>
    )
}