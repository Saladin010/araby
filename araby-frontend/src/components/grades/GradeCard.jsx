import { FileText, Calendar, User, Edit, Trash2, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatDate } from '../../utils/dateUtils'
import { formatGradeDisplay } from '../../utils/gradeHelpers'

/**
 * GradeCard Component
 * Displays grade information in a card format
 */
const GradeCard = ({ grade, onView, onEdit, onDelete, index = 0 }) => {
    const formattedGrade = formatGradeDisplay(grade)
    const { colors, label, scoreDisplay, percentageDisplay } = formattedGrade

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 border border-gray-200"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">
                            {grade.examName}
                        </h3>
                        <p className="text-sm text-gray-500">
                            #{grade.id?.toString().padStart(4, '0')}
                        </p>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text}`}>
                    {label}
                </span>
            </div>

            {/* Student Info */}
            <div className="mb-4 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2 text-gray-700">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{grade.studentName || 'غير متوفر'}</span>
                </div>
            </div>

            {/* Score Display */}
            <div className="mb-4">
                <div className="flex items-baseline justify-between mb-2">
                    <span className="text-sm text-gray-600">الدرجة:</span>
                    <span className="text-2xl font-bold text-gray-900">{scoreDisplay}</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${formattedGrade.percentage}%` }}
                        className={`h-full ${colors.progress}`}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                    />
                </div>

                <div className="mt-1 text-right">
                    <span className={`text-lg font-bold ${colors.text}`}>
                        {percentageDisplay}
                    </span>
                </div>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>{formatDate(grade.examDate)}</span>
            </div>

            {/* Notes (if any) */}
            {grade.notes && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 line-clamp-2">{grade.notes}</p>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-gray-100">
                <button
                    onClick={() => onView(grade)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                    <Eye className="w-4 h-4" />
                    عرض
                </button>
                {onEdit && (
                    <button
                        onClick={() => onEdit(grade)}
                        className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                )}
                {onDelete && (
                    <button
                        onClick={() => onDelete(grade)}
                        className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Recorded By Info */}
            {grade.recordedByName && (
                <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500 text-center">
                    سجلت بواسطة: {grade.recordedByName}
                </div>
            )}
        </motion.div>
    )
}

export default GradeCard
