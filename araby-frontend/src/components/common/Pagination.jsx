import { ChevronRight, ChevronLeft, ChevronsRight, ChevronsLeft } from 'lucide-react'
import PropTypes from 'prop-types'

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    showFirstLast = true,
    className = '',
}) => {
    const getPageNumbers = () => {
        const pages = []
        const maxVisible = 5

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i)
                }
                pages.push('...')
                pages.push(totalPages)
            } else if (currentPage >= totalPages - 2) {
                pages.push(1)
                pages.push('...')
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i)
                }
            } else {
                pages.push(1)
                pages.push('...')
                pages.push(currentPage - 1)
                pages.push(currentPage)
                pages.push(currentPage + 1)
                pages.push('...')
                pages.push(totalPages)
            }
        }

        return pages
    }

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            onPageChange(page)
        }
    }

    return (
        <div className={`flex items-center justify-center gap-1 sm:gap-2 ${className}`}>
            {/* First Page - Hidden on mobile */}
            {showFirstLast && (
                <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="hidden sm:flex p-2 rounded-lg border border-border hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="الصفحة الأولى"
                >
                    <ChevronsRight size={20} />
                </button>
            )}

            {/* Previous Page */}
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-border hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="السابق"
            >
                <ChevronRight size={18} className="sm:w-5 sm:h-5" />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
                {getPageNumbers().map((page, index) => (
                    <button
                        key={index}
                        onClick={() => typeof page === 'number' && handlePageChange(page)}
                        disabled={page === '...'}
                        className={`
              min-w-[36px] sm:min-w-[40px] h-9 sm:h-10 px-2 sm:px-3 rounded-lg font-medium transition-colors text-sm sm:text-base
              ${page === currentPage
                                ? 'bg-primary text-white'
                                : page === '...'
                                    ? 'cursor-default'
                                    : 'border border-border hover:bg-background'
                            }
            `}
                    >
                        {page}
                    </button>
                ))}
            </div>

            {/* Next Page */}
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-border hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="التالي"
            >
                <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
            </button>

            {/* Last Page - Hidden on mobile */}
            {showFirstLast && (
                <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="hidden sm:flex p-2 rounded-lg border border-border hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="الصفحة الأخيرة"
                >
                    <ChevronsLeft size={20} />
                </button>
            )}
        </div>
    )
}

Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    showFirstLast: PropTypes.bool,
    className: PropTypes.string,
}

export default Pagination
