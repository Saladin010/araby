import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Clock } from 'lucide-react'
import PropTypes from 'prop-types'
import { Avatar } from '../common'

/**
 * Scan Result Modal
 * Shows the result of QR code scan with animation
 */
const ScanResultModal = ({ result, isOpen, onClose }) => {
    if (!isOpen || !result) return null

    const isSuccess = result.success

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
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="card max-w-md w-full">
                            <div className="text-center">
                                {/* Icon Animation */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                                    className="mb-4"
                                >
                                    {isSuccess ? (
                                        <CheckCircle size={80} className="mx-auto text-success" />
                                    ) : (
                                        <XCircle size={80} className="mx-auto text-error" />
                                    )}
                                </motion.div>

                                {/* Student Info (Success) */}
                                {isSuccess && result.studentName && (
                                    <div className="mb-4">
                                        <Avatar name={result.studentName} size="xl" className="mx-auto mb-3" />
                                        <h3 className="text-2xl font-bold text-text-primary mb-2">
                                            {result.studentName}
                                        </h3>
                                    </div>
                                )}

                                {/* Message */}
                                <p className={`text-lg font-medium mb-4 ${isSuccess ? 'text-success' : 'text-error'}`}>
                                    {result.message}
                                </p>

                                {/* Details (Success) */}
                                {isSuccess && (
                                    <div className="bg-background rounded-lg p-4 space-y-2 text-right mb-4">
                                        {result.sessionTitle && (
                                            <div className="flex justify-between">
                                                <span className="text-text-secondary">الحصة:</span>
                                                <span className="font-medium">{result.sessionTitle}</span>
                                            </div>
                                        )}
                                        {result.status !== undefined && (
                                            <div className="flex justify-between">
                                                <span className="text-text-secondary">الحالة:</span>
                                                <span className={`font-medium ${result.status === 0 ? 'text-success' : 'text-warning'}`}>
                                                    {result.status === 0 ? (
                                                        <><Clock size={16} className="inline mr-1" />حاضر</>
                                                    ) : (
                                                        <><Clock size={16} className="inline mr-1" />متأخر</>
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <span className="text-text-secondary">الوقت:</span>
                                            <span className="font-medium">{new Date().toLocaleTimeString('ar-EG')}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Close Button */}
                                <button
                                    onClick={onClose}
                                    className="btn btn-primary w-full"
                                >
                                    إغلاق
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

ScanResultModal.propTypes = {
    result: PropTypes.shape({
        success: PropTypes.bool.isRequired,
        message: PropTypes.string.isRequired,
        studentName: PropTypes.string,
        sessionTitle: PropTypes.string,
        status: PropTypes.number,
    }),
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
}

export default ScanResultModal
