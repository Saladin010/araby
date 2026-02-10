import { X, Download } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import PropTypes from 'prop-types'
import { QRCodeDisplay, QRDownloadCard } from '../qr-code'

/**
 * Modal to display student QR code with download functionality
 * Used in Students list page for teachers/assistants
 */
const StudentQRModal = ({ isOpen, onClose, student }) => {
    if (!student) return null

    const studentData = {
        studentId: student.id,
        studentNumber: student.studentNumber,
        fullName: student.fullName,
        academicLevel: student.academicLevel,
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
                        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                    >
                        {/* Modal Content */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-surface rounded-lg shadow-xl max-w-md w-full p-6 relative"
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 left-4 p-2 hover:bg-background rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>

                            {/* Header */}
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold mb-2">رمز QR للطالب</h2>
                                <div className="space-y-1">
                                    <p className="text-lg font-semibold text-primary">
                                        {student.fullName}
                                    </p>
                                    <p className="text-text-secondary">
                                        رقم الطالب: {student.studentNumber}
                                    </p>
                                    {student.academicLevel && (
                                        <p className="text-text-secondary">
                                            المستوى: {student.academicLevel}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* QR Code Display */}
                            <div className="flex justify-center mb-6">
                                <QRCodeDisplay studentData={studentData} size={280} />
                            </div>

                            {/* Download Section */}
                            <div className="space-y-3">
                                <QRDownloadCard studentData={studentData} />

                                <div className="text-center">
                                    <button
                                        onClick={onClose}
                                        className="btn btn-outline w-full"
                                    >
                                        إغلاق
                                    </button>
                                </div>
                            </div>

                            {/* Instructions */}
                            <div className="mt-6 p-4 bg-background rounded-lg">
                                <p className="text-sm text-text-secondary text-center">
                                    💡 يمكن استخدام هذا الرمز لتسجيل حضور الطالب في الحصص
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

StudentQRModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    student: PropTypes.shape({
        id: PropTypes.string.isRequired,
        studentNumber: PropTypes.number.isRequired,
        fullName: PropTypes.string.isRequired,
        academicLevel: PropTypes.string,
    }),
}

export default StudentQRModal
