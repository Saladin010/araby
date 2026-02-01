import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * DeleteConfirmation Component
 */
const DeleteConfirmation = ({ isOpen, onClose, onConfirm, studentName, loading }) => {
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
                            className="bg-surface rounded-xl shadow-xl max-w-md w-full p-6"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-error">تأكيد الحذف</h3>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-background rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="mb-6">
                                <p className="text-text-primary mb-2">
                                    هل أنت متأكد من حذف الطالب <strong>{studentName}</strong>؟
                                </p>
                                <p className="text-sm text-text-muted">
                                    سيتم حذف جميع البيانات المرتبطة به (الحضور، الدرجات، المدفوعات). هذا الإجراء لا يمكن التراجع عنه.
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={onClose}
                                    disabled={loading}
                                    className="btn btn-outline flex-1"
                                >
                                    إلغاء
                                </button>
                                <button
                                    onClick={onConfirm}
                                    disabled={loading}
                                    className="btn bg-error text-white hover:bg-red-600 flex-1"
                                >
                                    {loading ? 'جاري الحذف...' : 'تأكيد الحذف'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    )
}

export default DeleteConfirmation
