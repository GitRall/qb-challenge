interface Label {
    left?: string
    right: string
}

export function ToggleView({ labels, callback }: { labels: Label, callback: (isChecked: boolean) => unknown }) {

    const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
        callback(event.target.checked)
    }

    return (
        <div className="flex items-center mb-5">
            <span className="mr-3 text-sm font-medium">{labels.left}</span>
            <label className="relative flex items-center cursor-pointer">
                <input onInput={handleToggle} name='toggle-view' type="checkbox" value="" className="sr-only peer" />
                <div className="w-14 h-7 bg-blurple peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all"></div>
            </label>
            <span className="ml-3 text-sm font-medium">{labels.right}</span>
        </div>
    )
}