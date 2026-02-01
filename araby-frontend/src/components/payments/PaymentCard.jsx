import { DollarSign, Calendar, User, CreditCard, CheckCircle, Clock, XCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatDate } from '../../utils/dateUtils'

/**
 * PaymentCard Component
 * Displays payment information in card format
 */
const PaymentCard = ({ payment, onView, onUpdateStatus, onDelete, onRecordPayment }) => {
    const getStatusConfig = (status) => {
        const configs = {
            1: { // Paid
                label: 'مدفوع',
                bgColor: 'bg-green-100',
                textColor: 'text-green-800',
                icon: CheckCircle,
            },
            2: { // Pending
                label: 'معلق',
                bgColor: 'bg-yellow-100',
                textColor: 'text-yellow-800',
                icon: Clock,
            },
            3: { // Overdue
                label: 'متأخر',
                bgColor: 'bg-red-100',
                textColor: 'text-red-800',
                icon: XCircle,
            },
        }
        return configs[status] || configs[2]
    }

    const getFrequencyLabel = (frequency) => {
        const labels = {
            1: 'شهري',
            2: 'أسبوعي',
            3: 'سنوي',
            4: 'مرة واحدة',
        }
        return labels[frequency] || 'غير محدد'
    }

    const statusConfig = getStatusConfig(payment.status)
    const StatusIcon = statusConfig.icon

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 border border-gray-100"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <DollarSign className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">
                            #{payment.id?.toString().padStart(6, '0')}
                        </h3>
                        <p className="text-sm text-gray-500">
                            {formatDate(payment.paymentDate)}
                        </p>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {statusConfig.label}
                </span>
            </div>

            {/* Student Info */}
            <div className="mb-4 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{payment.studentName || 'غير متوفر'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <CreditCard className="w-4 h-4 text-gray-400" />
                    <span>{payment.feeTypeName || 'غير متوفر'}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">
                        {payment.feeTypeFrequency ? getFrequencyLabel(payment.feeTypeFrequency) : ''}
                    </span>
                </div>
            </div>

            {/* Amount */}
            <div className="mb-4">
                <span className="text-2xl font-bold text-gray-900">
                    {(payment.amountPaid > 0 ? payment.amountPaid : (payment.expectedAmount || payment.amount || 0)).toFixed(2)} جنيه
                </span>
            </div>

            {/* Notes */}
            {payment.notes && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 line-clamp-2">{payment.notes}</p>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
                <button
                    onClick={() => onView(payment)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                    عرض التفاصيل
                </button>
                {!payment.isFullyPaid && onRecordPayment && (
                    <button
                        onClick={() => onRecordPayment(payment)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                        تسجيل دفعة
                    </button>
                )}
                {payment.status !== 1 && onUpdateStatus && !payment.isFullyPaid && (
                    <button
                        onClick={() => onUpdateStatus(payment.id, 1)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                        تأكيد الدفع
                    </button>
                )}
            </div>
        </motion.div>
    )
}

export default PaymentCard
