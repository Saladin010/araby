import { X, Printer, Edit, Trash2, CheckCircle, Clock, XCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDate } from '../../utils/dateUtils'

/**
 * PaymentDetailsModal Component
 * Displays full payment details with actions
 */
const PaymentDetailsModal = ({ isOpen, onClose, payment, onUpdateStatus, onDelete }) => {
    if (!isOpen || !payment) return null

    const getStatusConfig = (status) => {
        const configs = {
            1: {
                label: 'مدفوع',
                bgColor: 'bg-green-100',
                textColor: 'text-green-800',
                icon: CheckCircle,
            },
            2: {
                label: 'معلق',
                bgColor: 'bg-yellow-100',
                textColor: 'text-yellow-800',
                icon: Clock,
            },
            3: {
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

    const handlePrint = () => {
        window.print()
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">تفاصيل الدفعة</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                رقم الإيصال: #{payment.id?.toString().padStart(6, '0')}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Status Badge */}
                        <div className="flex justify-center">
                            <span className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                                <StatusIcon className="w-5 h-5" />
                                {statusConfig.label}
                            </span>
                        </div>

                        {/* Student Information */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="text-sm font-semibold text-gray-500 mb-4">معلومات الطالب</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">الاسم:</span>
                                    <span className="font-semibold text-gray-900">
                                        {payment.studentName || 'غير متوفر'}
                                    </span>
                                </div>
                                {payment.studentPhone && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">رقم الهاتف:</span>
                                        <span className="font-semibold text-gray-900">
                                            {payment.studentPhone}
                                        </span>
                                    </div>
                                )}
                                {payment.studentEmail && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">البريد الإلكتروني:</span>
                                        <span className="font-semibold text-gray-900">
                                            {payment.studentEmail}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Payment Information */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="text-sm font-semibold text-gray-500 mb-4">تفاصيل الدفع</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">نوع الرسوم:</span>
                                    <span className="font-semibold text-gray-900">
                                        {payment.feeTypeName || 'غير متوفر'}
                                    </span>
                                </div>
                                {payment.feeTypeFrequency && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">التكرار:</span>
                                        <span className="font-semibold text-gray-900">
                                            {getFrequencyLabel(payment.feeTypeFrequency)}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-gray-600">تاريخ الدفع:</span>
                                    <span className="font-semibold text-gray-900">
                                        {formatDate(payment.paymentDate)}
                                    </span>
                                </div>
                                {payment.createdAt && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">تاريخ التسجيل:</span>
                                        <span className="font-semibold text-gray-900">
                                            {formatDate(payment.createdAt)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Amount */}
                        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold text-green-900">المبلغ المدفوع:</span>
                                <span className="text-3xl font-bold text-green-600">
                                    {(payment.amountPaid || payment.amount || 0).toFixed(2)} جنيه
                                </span>
                            </div>
                        </div>

                        {/* Notes */}
                        {payment.notes && (
                            <div className="bg-gray-50 rounded-lg p-6">
                                <h3 className="text-sm font-semibold text-gray-500 mb-2">ملاحظات:</h3>
                                <p className="text-gray-900">{payment.notes}</p>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6">
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={handlePrint}
                                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                            >
                                <Printer className="w-5 h-5" />
                                طباعة
                            </button>
                            {payment.status !== 1 && onUpdateStatus && (
                                <button
                                    onClick={() => {
                                        onUpdateStatus(payment.id, 1)
                                        onClose()
                                    }}
                                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                                >
                                    <CheckCircle className="w-5 h-5" />
                                    تأكيد الدفع
                                </button>
                            )}
                            {onDelete && (
                                <button
                                    onClick={() => {
                                        if (window.confirm('هل أنت متأكد من حذف هذه الدفعة؟')) {
                                            onDelete(payment.id)
                                            onClose()
                                        }
                                    }}
                                    className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
                                >
                                    <Trash2 className="w-5 h-5" />
                                    حذف
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

export default PaymentDetailsModal
