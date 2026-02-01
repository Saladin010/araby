import { X, User, Phone, GraduationCap, Calendar, CheckCircle, XCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDate } from '../../utils/dateUtils'

/**
 * StudentDetailsModal Component
 * Displays detailed information about a student
 */
const StudentDetailsModal = ({ isOpen, onClose, student }) => {
    if (!student) return null

    const getStatusBadge = (isActive) => {
        return isActive ? (
            <span className="flex items-center gap-1 px-3 py-1 bg-success/10 text-success rounded-full text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                نشط
            </span>
        ) : (
            <span className="flex items-center gap-1 px-3 py-1 bg-error/10 text-error rounded-full text-sm font-medium">
                <XCircle className="w-4 h-4" />
                غير نشط
            </span>
        )
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-surface rounded-xl shadow-xl max-w-2xl w-full p-6"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-text-primary">
                                    تفاصيل الطالب
                                </h3>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-background rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Student Info */}
                            <div className="space-y-6">
                                {/* Profile Section */}
                                <div className="flex items-center gap-4 p-4 bg-background rounded-lg">
                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                        <User className="w-8 h-8 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-xl font-bold text-text-primary mb-1">
                                            {student.fullName}
                                        </h4>
                                        <p className="text-text-muted">@{student.userName}</p>
                                    </div>
                                    {getStatusBadge(student.isActive)}
                                </div>

                                {/* Details Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Phone Number */}
                                    <div className="p-4 bg-background rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Phone className="w-5 h-5 text-primary" />
                                            <span className="text-sm text-text-muted">رقم الهاتف</span>
                                        </div>
                                        <p className="text-lg font-semibold text-text-primary">
                                            {student.phoneNumber || '-'}
                                        </p>
                                    </div>

                                    {/* Academic Level */}
                                    <div className="p-4 bg-background rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <GraduationCap className="w-5 h-5 text-primary" />
                                            <span className="text-sm text-text-muted">المستوى الدراسي</span>
                                        </div>
                                        <p className="text-lg font-semibold text-text-primary">
                                            {student.academicLevel || '-'}
                                        </p>
                                    </div>

                                    {/* Created Date */}
                                    <div className="p-4 bg-background rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Calendar className="w-5 h-5 text-primary" />
                                            <span className="text-sm text-text-muted">تاريخ التسجيل</span>
                                        </div>
                                        <p className="text-lg font-semibold text-text-primary">
                                            {student.createdAt ? formatDate(student.createdAt) : '-'}
                                        </p>
                                    </div>

                                    {/* Last Updated */}
                                    {student.updatedAt && (
                                        <div className="p-4 bg-background rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Calendar className="w-5 h-5 text-primary" />
                                                <span className="text-sm text-text-muted">آخر تحديث</span>
                                            </div>
                                            <p className="text-lg font-semibold text-text-primary">
                                                {formatDate(student.updatedAt)}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Additional Info */}
                                {student.notes && (
                                    <div className="p-4 bg-background rounded-lg">
                                        <h5 className="text-sm text-text-muted mb-2">ملاحظات</h5>
                                        <p className="text-text-primary">{student.notes}</p>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={onClose}
                                    className="btn btn-secondary"
                                >
                                    إغلاق
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    )
}

export default StudentDetailsModal
