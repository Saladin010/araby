import { AlertTriangle, DollarSign, Calendar, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import { useOverduePayments, useUpdatePaymentStatus, useRecordPaymentAgainstFee } from '../../hooks/usePayments'
import PaymentCard from './PaymentCard'
import PaymentDetailsModal from './PaymentDetailsModal'
import RecordPaymentModal from './RecordPaymentModal'
import { useState } from 'react'

/**
 * OverduePayments Component
 * Displays overdue payments with urgency indicators
 */
const OverduePayments = () => {
    const { data: paymentsData, isLoading } = useOverduePayments()
    const updateStatus = useUpdatePaymentStatus()
    const recordPayment = useRecordPaymentAgainstFee()
    const [selectedPayment, setSelectedPayment] = useState(null)
    const [showDetailsModal, setShowDetailsModal] = useState(false)
    const [showRecordModal, setShowRecordModal] = useState(false)

    const payments = paymentsData || []
    const totalAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0)

    // Calculate days overdue
    const calculateDaysOverdue = (paymentDate) => {
        const today = new Date()
        const payment = new Date(paymentDate)
        const diffTime = Math.abs(today - payment)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays
    }

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
                    className="bg-gradient-to-br from-red-500 to-red-700 rounded-xl shadow-lg p-6 text-white"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-red-100 text-sm font-medium">المدفوعات المتأخرة</p>
                            <p className="text-3xl font-bold mt-2">{payments.length}</p>
                        </div>
                        <div className="p-3 bg-white/20 rounded-lg">
                            <AlertTriangle className="w-8 h-8" />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-red-600 to-red-800 rounded-xl shadow-lg p-6 text-white"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-red-100 text-sm font-medium">إجمالي المبلغ</p>
                            <p className="text-3xl font-bold mt-2">{totalAmount.toFixed(2)}</p>
                            <p className="text-red-100 text-xs mt-1">جنيه</p>
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
                    className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg p-6 text-white"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-sm font-medium">الأقدم تأخراً</p>
                            <p className="text-3xl font-bold mt-2">
                                {payments.length > 0
                                    ? Math.max(...payments.map(p => calculateDaysOverdue(p.paymentDate)))
                                    : 0}
                            </p>
                            <p className="text-orange-100 text-xs mt-1">يوم</p>
                        </div>
                        <div className="p-3 bg-white/20 rounded-lg">
                            <Calendar className="w-8 h-8" />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">المدفوعات المتأخرة</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        المدفوعات التي تجاوزت موعد الاستحقاق
                    </p>
                </div>
            </div>

            {/* Payments List */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                </div>
            ) : payments.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                    <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-medium">لا توجد مدفوعات متأخرة</p>
                    <p className="text-gray-400 text-sm mt-2">جميع المدفوعات في موعدها</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {payments.map((payment) => {
                        const daysOverdue = calculateDaysOverdue(payment.paymentDate)
                        return (
                            <div key={payment.id} className="relative">
                                {/* Days Overdue Badge */}
                                <div className="absolute -top-2 -right-2 z-10 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                    {daysOverdue} يوم تأخير
                                </div>
                                <PaymentCard
                                    payment={payment}
                                    onView={handleViewDetails}
                                    onUpdateStatus={handleUpdateStatus}
                                    onRecordPayment={handleRecordPayment}
                                />
                            </div>
                        )
                    })}
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

export default OverduePayments
