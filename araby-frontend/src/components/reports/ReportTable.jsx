import { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import PropTypes from 'prop-types'
import { motion } from 'framer-motion'

/**
 * ReportTable Component
 * Sortable table with pagination
 */
const ReportTable = ({ columns, data, pageSize = 10, showFooter = false, footerData }) => {
    const [sortColumn, setSortColumn] = useState(null)
    const [sortDirection, setSortDirection] = useState('asc')
    const [currentPage, setCurrentPage] = useState(1)

    // Handle sort
    const handleSort = (columnKey) => {
        if (sortColumn === columnKey) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortColumn(columnKey)
            setSortDirection('asc')
        }
    }

    // Sort data
    const sortedData = [...data].sort((a, b) => {
        if (!sortColumn) return 0

        const aVal = a[sortColumn]
        const bVal = b[sortColumn]

        if (aVal === bVal) return 0

        const comparison = aVal > bVal ? 1 : -1
        return sortDirection === 'asc' ? comparison : -comparison
    })

    // Paginate
    const totalPages = Math.ceil(sortedData.length / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const paginatedData = sortedData.slice(startIndex, startIndex + pageSize)

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    onClick={() => column.sortable && handleSort(column.key)}
                                    className={`px-6 py-4 text-right text-sm font-bold text-gray-700 ${column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                                        }`}
                                >
                                    <div className="flex items-center justify-end gap-2">
                                        {column.label}
                                        {column.sortable && sortColumn === column.key && (
                                            <span>
                                                {sortDirection === 'asc' ? (
                                                    <ChevronUp className="w-4 h-4" />
                                                ) : (
                                                    <ChevronDown className="w-4 h-4" />
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {paginatedData.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                                    لا توجد بيانات
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((row, index) => (
                                <motion.tr
                                    key={index}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    {columns.map((column) => (
                                        <td key={column.key} className="px-6 py-4 text-sm text-gray-900">
                                            {column.render ? column.render(row[column.key], row) : row[column.key]}
                                        </td>
                                    ))}
                                </motion.tr>
                            ))
                        )}
                    </tbody>
                    {showFooter && footerData && (
                        <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                            <tr>
                                {columns.map((column) => (
                                    <td key={column.key} className="px-6 py-4 text-sm font-bold text-gray-900">
                                        {footerData[column.key] || ''}
                                    </td>
                                ))}
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="text-sm text-gray-600">
                        عرض {startIndex + 1} - {Math.min(startIndex + pageSize, sortedData.length)} من {sortedData.length}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            السابق
                        </button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                                            ? 'bg-primary text-white'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            التالي
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

ReportTable.propTypes = {
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            sortable: PropTypes.bool,
            render: PropTypes.func
        })
    ).isRequired,
    data: PropTypes.array.isRequired,
    pageSize: PropTypes.number,
    showFooter: PropTypes.bool,
    footerData: PropTypes.object
}

export default ReportTable
