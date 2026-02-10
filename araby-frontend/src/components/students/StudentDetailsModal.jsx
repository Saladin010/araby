import { X, User, Phone, GraduationCap, Calendar, CheckCircle, XCircle, Hash } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDate } from '../../utils/dateUtils'
import { useStudentReport } from '../../hooks/useReport'
import StudentReport from './StudentReport'

/**
 * StudentDetailsModal Component
 * Displays comprehensive student report
 */
const StudentDetailsModal = ({ isOpen, onClose, student }) => {
    // We only fetch if open and student exists
    const { data: report, isLoading, isError } = useStudentReport(isOpen ? student?.id : null)

    if (!student) return null

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
                        className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-6xl my-8 flex flex-col max-h-[90vh]"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 bg-white border-b border-gray-200 rounded-t-2xl sticky top-0 z-10">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        تقرير الطالب الشامل
                                    </h3>
                                    <p className="text-gray-500 text-sm">
                                        {student.fullName} - {student.academicLevel}
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors border border-gray-200"
                                >
                                    <X className="w-6 h-6 text-gray-600" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                                {isLoading ? (
                                    <div className="flex flex-col items-center justify-center py-20">
                                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
                                        <p className="text-gray-500 animate-pulse">جاري تحميل بيانات الطالب...</p>
                                    </div>
                                ) : isError ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-red-500">
                                        <AlertCircle className="w-16 h-16 mb-4" />
                                        <p className="text-lg font-bold">حدث خطأ أثناء تحميل البيانات</p>
                                        <button onClick={onClose} className="mt-4 btn btn-outline">إغلاق</button>
                                    </div>
                                ) : (
                                    <StudentReport report={report} />
                                )}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    )
}

export default StudentDetailsModal
