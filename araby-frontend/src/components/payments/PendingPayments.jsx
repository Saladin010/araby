import { Clock, DollarSign, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { usePendingPayments, useUpdatePaymentStatus, useRecordPaymentAgainstFee } from '../../hooks/usePayments'
import PaymentCard from './PaymentCard'
import PaymentDetailsModal from './PaymentDetailsModal'
import RecordPaymentModal from './RecordPaymentModal'
import { useState } from 'react'

/**
 * PendingPayments Component
 * Displays pending payments with summary
 */
const PendingPayments = () => {
    const { data: paymentsData, isLoading } = usePendingPayments()
    const updateStatus = useUpdatePaymentStatus()
    const recordPayment = useRecordPaymentAgainstFee()
    const [selectedPayment, setSelectedPayment] = useState(null)
    const [showDetailsModal, setShowDetailsModal] = useState(false)
    const [showRecordModal, setShowRecordModal] = useState(false)

    const payments = paymentsData || []
    const totalAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0)

    const handleViewDetails = (payment) => {
        setSelectedPayment(payment)
        setShowDetailsModal(true)
    }

    const handleUpdateStatus = async (paymentId, status) => {
        await updateStatus.mutateAsync({ id: paymentId, status })
    }

    const handleRecordPayment = (payment) => {
        setSelectedPayment(payment)
        setShowRecordModal(true)
    }

    const handleSubmitPayment = async (paymentId, amountPaid) => {
        await recordPayment.mutateAsync({ paymentId, amountPaid })
        setShowRecordModal(false)
        setSelectedPayment(null)
    }

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-lg p-6 text-white"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-yellow-100 text-sm font-medium">المدفوعات المعلقة</p>
                            <p className="text-3xl font-bold mt-2">{payments.length}</p>
                        </div>
                        <div className="p-3 bg-white/20 rounded-lg">
                            <Clock className="w-8 h-8" />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg p-6 text-white"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-sm font-medium">إجمالي المبلغ</p>
                            <p className="text-3xl font-bold mt-2">{totalAmount.toFixed(2)}</p>
                            <p className="text-orange-100 text-xs mt-1">جنيه</p>
                        </div>
                        <div className="p-3 bg-white/20 rounded-lg">
                            <DollarSign className="w-8 h-8" />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl shadow-lg p-6 text-white"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-yellow-100 text-sm font-medium">متوسط المبلغ</p>
                            <p className="text-3xl font-bold mt-2">
                                {payments.length > 0 ? (totalAmount / payments.length).toFixed(2) : '0.00'}
                            </p>
                            <p className="text-yellow-100 text-xs mt-1">جنيه</p>
                        </div>
                        <div className="p-3 bg-white/20 rounded-lg">
                            <AlertCircle className="w-8 h-8" />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">المدفوعات المعلقة</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        المدفوعات التي في انتظار التأكيد
                    </p>
                </div>
            </div>

            {/* Payments List */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
                </div>
            ) : payments.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                    <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-medium">لا توجد مدفوعات معلقة</p>
                    <p className="text-gray-400 text-sm mt-2">جميع المدفوعات تم تأكيدها</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {payments.map((payment) => (
                        <PaymentCard
                            key={payment.id}
                            payment={payment}
                            onView={handleViewDetails}
                            onUpdateStatus={handleUpdateStatus}
                            onRecordPayment={handleRecordPayment}
                        />
                    ))}
                </div>
            )}

            {/* Details Modal */}
            {showDetailsModal && selectedPayment && (
                <PaymentDetailsModal
                    isOpen={showDetailsModal}
                    onClose={() => {
                        setShowDetailsModal(false)
                        setSelectedPayment(null)
                    }}
                    payment={selectedPayment}
                    onUpdateStatus={handleUpdateStatus}
                />
            )}

            {/* Record Payment Modal */}
            {showRecordModal && selectedPayment && (
                <RecordPaymentModal
                    isOpen={showRecordModal}
                    onClose={() => {
                        setShowRecordModal(false)
                        setSelectedPayment(null)
                    }}
                    payment={selectedPayment}
                    onSubmit={handleSubmitPayment}
                    isLoading={recordPayment.isPending}
                />
            )}
        </div>
    )
}

export default PendingPayments
