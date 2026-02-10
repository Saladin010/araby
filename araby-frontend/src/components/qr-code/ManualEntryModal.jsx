import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Hash, X } from 'lucide-react'
import PropTypes from 'prop-types'

/**
 * Manual Entry Modal
 * Allows manual entry of student number
 */
const ManualEntryModal = ({ isOpen, onClose, onSubmit }) => {
    const [studentNumber, setStudentNumber] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')

        const number = parseInt(studentNumber)
        if (isNaN(number) || number <= 0) {
            setError('يرجى إدخال رقم طالب صحيح')
            return
        }

        onSubmit({
            studentNumber: number,
            scanTime: new Date().toISOString(),
        })

        // Reset form
        setStudentNumber('')
        onClose()
    }

    const handleClose = () => {
        setStudentNumber('')
        setError('')
        onClose()
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
                        onClick={handleClose}
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
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold">إدخال رقم الطالب يدوياً</h3>
                                <button
                                    onClick={handleClose}
                                    className="p-2 rounded-lg hover:bg-background transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-6">
                                    <label htmlFor="studentNumber" className="label">
                                        رقم الطالب
                                    </label>
                                    <div className="relative">
                                        <Hash size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted" />
                                        <input
                                            id="studentNumber"
                                            type="number"
                                            value={studentNumber}
                                            onChange={(e) => setStudentNumber(e.target.value)}
                                            placeholder="أدخل رقم الطالب"
                                            className="input pr-10"
                                            autoFocus
                                            min="1"
                                        />
                                    </div>
                                    {error && (
                                        <p className="text-error text-sm mt-2">{error}</p>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="btn btn-outline flex-1"
                                    >
                                        إلغاء
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary flex-1"
                                    >
                                        تسجيل الحضور
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

ManualEntryModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
}

export default ManualEntryModal
