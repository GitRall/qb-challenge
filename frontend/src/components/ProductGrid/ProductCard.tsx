import { Product } from '@/types/Product'
import Image from 'next/image'
import { AddToCartButton } from '@/components/Product/AddToCartButton'

export function ProductCard({ product }: { product: Product }) {
    return (
        <div className='product-card flex flex-col rounded-lg shadow-md p-3 bg-indigo-50 dark:bg-cyan-900'>
            <div className='flex items-center gap-4 mb-4'>
                <Image className='rounded-md shadow-lg' src={product.image_url} height={80} width={80} alt={product.name}></Image>
                <div>{product.name}</div>
            </div>
            <p className='mb-2'>{product.description}</p>
            <div className='flex items-center mt-auto border-t border-cyan-700 pt-2'>
                <span>
                    <p>In stock: {product.stock_quantity}</p>
                    <p>{product.price} kr</p>
                </span>
                <span className="ml-auto mt-auto"><AddToCartButton productId={product.id} /></span>
            </div>
        </div>
    )
}