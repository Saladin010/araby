import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'

/**
 * SearchBar Component - Debounced search input
 */
const SearchBar = ({ value, onChange, placeholder = 'ابحث...', delay = 300 }) => {
    const [searchTerm, setSearchTerm] = useState(value || '')

    useEffect(() => {
        const timer = setTimeout(() => {
            onChange(searchTerm)
        }, delay)

        return () => clearTimeout(timer)
    }, [searchTerm, delay, onChange])

    return (
        <div className="relative flex-1 max-w-md">
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
                <Search className="w-5 h-5" />
            </div>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={placeholder}
                className="input pr-10"
            />
        </div>
    )
}

export default SearchBar
