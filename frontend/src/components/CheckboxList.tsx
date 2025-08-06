'use client'

interface CheckboxState {
    label: string
    checked: boolean
}

export function CheckboxList({ values, title, onCheckboxChange }: { values: CheckboxState[], title?: string, onCheckboxChange: (label: string, checked: boolean) => unknown }) {
    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        onCheckboxChange(event.target.value, event.target.checked)
    }

    return (
        <div className="flex flex-col items-start mb-4 w-full text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            { title ? <h3 className="m-3">{title}</h3> : null }
            <ul className="flex flex-wrap">
                {values.map((value) => (
                    <li key={value.label}>
                        <div className="flex items-center px-3">
                            <input onInput={handleInput} id={`${value.label}-checkbox`} type="checkbox" value={value.label} className="w-4 h-4 text-blurple accent-blurple bg-gray-100 border-gray-300 rounded-sm focus:ring-blurple dark:focus:ring-blurple dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                            <label htmlFor={`${value.label}-checkbox`} className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{value.label}</label>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}