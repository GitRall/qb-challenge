// Skeleton for ProductCard.
export function ProductCardSkeleton() {
    return (
        <div className='h-full flex flex-col rounded-lg shadow-md p-3 bg-indigo-50 dark:bg-cyan-900'>
            <div className='flex items-center gap-4 pb-4'>
                <div className='rounded-md bg-white opacity-30 h-[80] w-[80]'></div>
                <div className="w-[100] h-[25] bg-white opacity-30 rounded-md"></div>
            </div>
            <p className='mt-[3] mb-[14] w-[30%] h-[15] bg-white opacity-30 rounded-md'></p>
            <div className='flex items-center mt-auto border-t border-cyan-700 pt-2'>
                <span className="w-[10%] h-[100%]">
                    <p className=" w-[100%] mb-[8] mt-[4] h-[16] bg-white opacity-30 rounded-md"></p>
                    <p className="w-[80%] mb-[4] h-[16] bg-white opacity-30 rounded-md"></p>
                </span>
                <span className="ml-auto mt-auto w-[110] h-[40] bg-white opacity-30 rounded-md"></span>
            </div>
        </div>
    )
}