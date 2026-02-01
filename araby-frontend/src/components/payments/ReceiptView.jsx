import { X, Printer, Download, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatDate } from '../../utils/dateUtils'

/**
 * ReceiptView Component
 * Displays and prints payment receipt
 */
const ReceiptView = ({ payment, onClose, onNewPayment }) => {
    const handlePrint = () => {
        window.print()
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

    return (
        <div className="max-w-4xl mx-auto">
            {/* Action Buttons - Hidden in print */}
            <div className="flex gap-3 mb-6 print:hidden">
                <button
                    onClick={onClose}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
                >
                    <X className="w-5 h-5" />
                    إغلاق
                </button>
                <button
                    onClick={handlePrint}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                    <Printer className="w-5 h-5" />
                    طباعة
                </button>
                <button
                    onClick={onNewPayment}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                    دفعة جديدة
                </button>
            </div>

            {/* Receipt */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-lg p-8 md:p-12 print:shadow-none"
            >
                {/* Success Icon */}
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-green-100 rounded-full">
                        <CheckCircle className="w-16 h-16 text-green-600" />
                    </div>
                </div>

                {/* Header */}
                <div className="text-center mb-8 pb-6 border-b-2 border-gray-200">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">إيصال دفع</h1>
                    <p className="text-lg text-gray-600">مركز عربي التعليمي</p>
                    <p className="text-sm text-gray-500 mt-2">
                        رقم الإيصال: #{payment.id?.toString().padStart(6, '0')}
                    </p>
                </div>

                {/* Payment Details */}
                <div className="space-y-6 mb-8">
                    {/* Student Info */}
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-sm font-semibold text-gray-500 mb-3">معلومات الطالب</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">الاسم:</span>
                                <span className="font-semibold text-gray-900">
                                    {payment.student?.fullName || 'غير متوفر'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">رقم الهاتف:</span>
                                <span className="font-semibold text-gray-900">
                                    {payment.student?.phoneNumber || 'غير متوفر'}
                                </span>
                            </div>
                            {payment.student?.email && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">البريد الإلكتروني:</span>
                                    <span className="font-semibold text-gray-900">
                                        {payment.student.email}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-sm font-semibold text-gray-500 mb-3">تفاصيل الدفع</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">نوع الرسوم:</span>
                                <span className="font-semibold text-gray-900">
                                    {payment.feeType?.name || 'غير متوفر'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">التكرار:</span>
                                <span className="font-semibold text-gray-900">
                                    {payment.feeType ? getFrequencyLabel(payment.feeType.frequency) : 'غير متوفر'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">تاريخ الدفع:</span>
                                <span className="font-semibold text-gray-900">
                                    {formatDate(payment.paymentDate)}
                                </span>
                            </div>
                            {payment.notes && (
                                <div className="pt-2 border-t border-gray-200">
                                    <span className="text-gray-600 block mb-1">ملاحظات:</span>
                                    <p className="text-gray-900">{payment.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Amount - Highlighted */}
                    <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-green-900">المبلغ المدفوع:</span>
                            <span className="text-3xl font-bold text-green-600">
                                {(payment.amountPaid || payment.amount || 0).toFixed(2)} جنيه
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center pt-6 border-t-2 border-gray-200">
                    <p className="text-sm text-gray-500 mb-2">
                        تم الإصدار في: {formatDate(new Date())}
                    </p>
                    <p className="text-xs text-gray-400">
                        شكراً لثقتكم بنا
                    </p>
                </div>

                {/* Print-only footer */}
                <div className="hidden print:block mt-8 pt-6 border-t border-gray-300">
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>مركز عربي التعليمي</span>
                        <span>www.araby-center.com</span>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default ReceiptView
