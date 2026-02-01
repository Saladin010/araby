import { useState } from 'react'
import { X, DollarSign } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import PropTypes from 'prop-types'

/**
 * RecordPaymentModal Component
 * Modal for recording a payment against an assigned fee
 */
const RecordPaymentModal = ({ isOpen, onClose, payment, onSubmit, isLoading }) => {
    const [amountPaid, setAmountPaid] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        const amount = parseFloat(amountPaid)

        if (isNaN(amount) || amount <= 0) {
            alert('الرجاء إدخال مبلغ صحيح')
            return
        }

        onSubmit(payment.id, amount)
    }

    const handleClose = () => {
        setAmountPaid('')
        onClose()
    }

    if (!isOpen || !payment) return null

    const remainingAmount = (payment.feeTypeAmount || 0) - (payment.amountPaid || 0)

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
                        className="fixed inset-0 bg-black/50 z-40"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                            {/* Header */}
                            <div className="bg-gradient-to-l from-primary to-primary-dark p-6 text-white rounded-t-xl">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white/20 p-2 rounded-lg">
                                            <DollarSign className="w-6 h-6" />
                                        </div>
                                        <h2 className="text-xl font-bold">تسجيل دفعة</h2>
                                    </div>
                                    <button
                                        onClick={handleClose}
                                        className="text-white/80 hover:text-white transition-colors"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            {/* Body */}
                            <form onSubmit={handleSubmit} className="p-6">
                                {/* Payment Info */}
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">الطالب:</span>
                                            <span className="font-medium text-gray-900">{payment.studentName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">نوع الرسوم:</span>
                                            <span className="font-medium text-gray-900">{payment.feeTypeName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">المبلغ الكلي:</span>
                                            <span className="font-medium text-gray-900">{payment.feeTypeAmount?.toFixed(2)} جنيه</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">المدفوع سابقاً:</span>
                                            <span className="font-medium text-gray-900">{payment.amountPaid?.toFixed(2)} جنيه</span>
                                        </div>
                                        <div className="flex justify-between pt-2 border-t border-gray-200">
                                            <span className="text-gray-900 font-semibold">المتبقي:</span>
                                            <span className="font-bold text-primary">{remainingAmount.toFixed(2)} جنيه</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Amount Input */}
                                <div className="mb-6">
                                    <label htmlFor="amountPaid" className="block text-sm font-medium text-gray-700 mb-2">
                                        المبلغ المدفوع <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            id="amountPaid"
                                            value={amountPaid}
                                            onChange={(e) => setAmountPaid(e.target.value)}
                                            step="0.01"
                                            min="0.01"
                                            max={remainingAmount}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                            placeholder="أدخل المبلغ المدفوع"
                                            disabled={isLoading}
                                        />
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                            جنيه
                                        </span>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">
                                        الحد الأقصى: {remainingAmount.toFixed(2)} جنيه
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                        disabled={isLoading}
                                    >
                                        إلغاء
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'جاري التسجيل...' : 'تسجيل الدفعة'}
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

RecordPaymentModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    payment: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    isLoading: PropTypes.bool
}

export default RecordPaymentModal
