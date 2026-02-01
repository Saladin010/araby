import { X, Edit, Trash2, FileText, User, Calendar, Award, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDate } from '../../utils/dateUtils'
import { formatGradeDisplay } from '../../utils/gradeHelpers'

/**
 * GradeDetailsModal Component
 * Modal for displaying full grade details
 */
const GradeDetailsModal = ({ isOpen, onClose, grade, onEdit, onDelete }) => {
    if (!grade) return null

    const formatted = formatGradeDisplay(grade)
    const { colors, label, scoreDisplay, percentageDisplay } = formatted

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">تفاصيل الدرجة</h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Grade Badge */}
                            <div className={`p-6 rounded-xl border-2 ${colors.border} ${colors.bg} text-center`}>
                                <div className="mb-2">
                                    <span className={`text-5xl font-bold ${colors.text}`}>
                                        {percentageDisplay}
                                    </span>
                                </div>
                                <div className="mb-3">
                                    <span className={`inline-block px-4 py-2 rounded-full text-lg font-semibold ${colors.bg} ${colors.text} border-2 ${colors.border}`}>
                                        {label}
                                    </span>
                                </div>
                                <div className="text-gray-700 font-medium">
                                    {scoreDisplay}
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mt-4">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${formatted.percentage}%` }}
                                        className={`h-full ${colors.progress}`}
                                        transition={{ duration: 0.8 }}
                                    />
                                </div>
                            </div>

                            {/* Student Details */}
                            <div className="bg-gray-50 rounded-xl p-4">
                                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    معلومات الطالب
                                </h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">الاسم:</span>
                                        <span className="font-medium text-gray-900">{grade.studentName || 'غير متوفر'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">رقم الطالب:</span>
                                        <span className="font-medium text-gray-900">{grade.studentId}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Exam Details */}
                            <div className="bg-gray-50 rounded-xl p-4">
                                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    تفاصيل الامتحان
                                </h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">اسم الامتحان:</span>
                                        <span className="font-medium text-gray-900">{grade.examName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">التاريخ:</span>
                                        <span className="font-medium text-gray-900 flex items-center gap-1">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            {formatDate(grade.examDate)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">الدرجة المحرزة:</span>
                                        <span className="font-medium text-gray-900">{grade.score}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">الدرجة النهائية:</span>
                                        <span className="font-medium text-gray-900">{grade.maxScore}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">النسبة المئوية:</span>
                                        <span className={`font-bold ${colors.text}`}>{percentageDisplay}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            {grade.notes && (
                                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                                    <h3 className="text-sm font-semibold text-blue-900 mb-2">ملاحظات:</h3>
                                    <p className="text-gray-700 whitespace-pre-wrap">{grade.notes}</p>
                                </div>
                            )}

                            {/* Recording Info */}
                            <div className="bg-gray-50 rounded-xl p-4">
                                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    معلومات التسجيل
                                </h3>
                                <div className="space-y-2">
                                    {grade.recordedByName && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">سجلت بواسطة:</span>
                                            <span className="font-medium text-gray-900">{grade.recordedByName}</span>
                                        </div>
                                    )}
                                    {grade.recordedAt && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">تاريخ التسجيل:</span>
                                            <span className="font-medium text-gray-900">{formatDate(grade.recordedAt)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">رقم الدرجة:</span>
                                        <span className="font-medium text-gray-900">#{grade.id?.toString().padStart(4, '0')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                إغلاق
                            </button>
                            {onEdit && (
                                <button
                                    onClick={() => {
                                        onEdit(grade)
                                        onClose()
                                    }}
                                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                                >
                                    <Edit className="w-5 h-5" />
                                    تعديل
                                </button>
                            )}
                            {onDelete && (
                                <button
                                    onClick={() => {
                                        onDelete(grade)
                                        onClose()
                                    }}
                                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
                                >
                                    <Trash2 className="w-5 h-5" />
                                    حذف
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

export default GradeDetailsModal
