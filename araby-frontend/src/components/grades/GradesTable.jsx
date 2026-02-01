import { useState } from 'react'
import { Table, Grid, ChevronUp, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'
import GradeCard from './GradeCard'
import { formatDate } from '../../utils/dateUtils'
import { formatGradeDisplay, sortGrades } from '../../utils/gradeHelpers'

/**
 * GradesTable Component
 * Displays grades in table or card view with sorting and pagination
 */
const GradesTable = ({ grades, onView, onEdit, onDelete }) => {
    const [viewMode, setViewMode] = useState('table') // 'table' or 'card'
    const [sortBy, setSortBy] = useState('date')
    const [sortOrder, setSortOrder] = useState('desc')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    // Sort grades
    const sortedGrades = sortGrades(grades || [], sortBy, sortOrder)

    // Pagination
    const totalPages = Math.ceil(sortedGrades.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedGrades = sortedGrades.slice(startIndex, startIndex + itemsPerPage)

    // Handle sort
    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
        } else {
            setSortBy(field)
            setSortOrder('desc')
        }
    }

    // Sort icon
    const SortIcon = ({ field }) => {
        if (sortBy !== field) return null
        return sortOrder === 'asc' ?
            <ChevronUp className="w-4 h-4" /> :
            <ChevronDown className="w-4 h-4" />
    }

    if (!grades || grades.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <p className="text-gray-500 text-lg font-medium">لا توجد درجات مسجلة</p>
                <p className="text-gray-400 text-sm mt-2">ابدأ بإضافة درجات جديدة</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* View Toggle */}
            <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                    عرض {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedGrades.length)} من {sortedGrades.length}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setViewMode('table')}
                        className={`p-2 rounded-lg transition-colors ${viewMode === 'table'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        <Table className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setViewMode('card')}
                        className={`p-2 rounded-lg transition-colors ${viewMode === 'card'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        <Grid className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Table View */}
            {viewMode === 'table' && (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        #
                                    </th>
                                    <th
                                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('student')}
                                    >
                                        <div className="flex items-center gap-1">
                                            الطالب
                                            <SortIcon field="student" />
                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('exam')}
                                    >
                                        <div className="flex items-center gap-1">
                                            اسم الامتحان
                                            <SortIcon field="exam" />
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        الدرجة
                                    </th>
                                    <th
                                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('score')}
                                    >
                                        <div className="flex items-center gap-1">
                                            النسبة المئوية
                                            <SortIcon field="score" />
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        التقدير
                                    </th>
                                    <th
                                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('date')}
                                    >
                                        <div className="flex items-center gap-1">
                                            التاريخ
                                            <SortIcon field="date" />
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        الإجراءات
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {paginatedGrades.map((grade, index) => {
                                    const formatted = formatGradeDisplay(grade)
                                    return (
                                        <motion.tr
                                            key={grade.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {startIndex + index + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {grade.studentName}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">{grade.examName}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                                {formatted.scoreDisplay}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 bg-gray-200 rounded-full h-2 w-20">
                                                        <div
                                                            className={`h-full rounded-full ${formatted.colors.progress}`}
                                                            style={{ width: `${formatted.percentage}%` }}
                                                        />
                                                    </div>
                                                    <span className={`text-sm font-bold ${formatted.colors.text}`}>
                                                        {formatted.percentageDisplay}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${formatted.colors.bg} ${formatted.colors.text}`}>
                                                    {formatted.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {formatDate(grade.examDate)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => onView(grade)}
                                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                                    >
                                                        عرض
                                                    </button>
                                                    {onEdit && (
                                                        <button
                                                            onClick={() => onEdit(grade)}
                                                            className="text-green-600 hover:text-green-800 font-medium"
                                                        >
                                                            تعديل
                                                        </button>
                                                    )}
                                                    {onDelete && (
                                                        <button
                                                            onClick={() => onDelete(grade)}
                                                            className="text-red-600 hover:text-red-800 font-medium"
                                                        >
                                                            حذف
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Card View */}
            {viewMode === 'card' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedGrades.map((grade, index) => (
                        <GradeCard
                            key={grade.id}
                            grade={grade}
                            onView={onView}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            index={index}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        السابق
                    </button>

                    <div className="flex gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-10 h-10 rounded-lg transition-colors ${currentPage === page
                                        ? 'bg-blue-600 text-white'
                                        : 'border border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        التالي
                    </button>
                </div>
            )}
        </div>
    )
}

export default GradesTable
