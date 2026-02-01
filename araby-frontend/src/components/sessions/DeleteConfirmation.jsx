import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * DeleteConfirmation Component
 * Confirmation modal for deleting sessions
 */
const DeleteConfirmation = ({ isOpen, onClose, onConfirm, sessionTitle, loading }) => {
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
                                <h3 className="text-xl font-bold text-text-primary">
                                    تأكيد الحذف
                                </h3>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-background rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="mb-6">
                                <p className="text-text-muted mb-2">
                                    هل أنت متأكد من حذف هذه الحصة؟
                                </p>
                                {sessionTitle && (
                                    <p className="text-text-primary font-semibold bg-background px-4 py-2 rounded-lg">
                                        {sessionTitle}
                                    </p>
                                )}
                                <p className="text-error text-sm mt-4">
                                    ⚠️ هذا الإجراء لا يمكن التراجع عنه
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
                                    className="btn btn-error flex-1"
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
