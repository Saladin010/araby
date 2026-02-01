import { motion } from 'framer-motion'
import { DollarSign } from 'lucide-react'
import { formatCurrency, formatDate } from '../../utils/dateUtils'
import EmptyState from './EmptyState'

/**
 * RecentPayments Component - Displays recent payment transactions
 */
const RecentPayments = ({ payments, loading = false }) => {
    const getStatusBadge = (status) => {
        const badges = {
            Paid: <span className="badge badge-success">مدفوع</span>,
            Pending: <span className="badge badge-warning">معلق</span>,
            Overdue: <span className="badge badge-error">متأخر</span>,
        }
        return badges[status] || <span className="badge">{status}</span>
    }

    if (loading) {
        return (
            <div className="card">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-right py-3 px-4">
                                    <div className="h-4 w-20 bg-background rounded animate-pulse" />
                                </th>
                                <th className="text-right py-3 px-4">
                                    <div className="h-4 w-16 bg-background rounded animate-pulse" />
                                </th>
                                <th className="text-right py-3 px-4">
                                    <div className="h-4 w-16 bg-background rounded animate-pulse" />
                                </th>
                                <th className="text-right py-3 px-4">
                                    <div className="h-4 w-16 bg-background rounded animate-pulse" />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <tr key={i} className="border-b border-border">
                                    <td className="py-3 px-4">
                                        <div className="h-4 w-32 bg-background rounded animate-pulse" />
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="h-4 w-20 bg-background rounded animate-pulse" />
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="h-4 w-24 bg-background rounded animate-pulse" />
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="h-6 w-16 bg-background rounded-full animate-pulse" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    if (!payments || payments.length === 0) {
        return (
            <div className="card">
                <EmptyState
                    icon={DollarSign}
                    title="لا توجد مدفوعات حديثة"
                    description="لم يتم تسجيل أي مدفوعات مؤخراً"
                />
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="card overflow-hidden"
        >
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border bg-background/50">
                            <th className="text-right py-3 px-4 text-sm font-semibold text-text-primary">
                                الطالب
                            </th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-text-primary">
                                المبلغ
                            </th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-text-primary">
                                التاريخ
                            </th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-text-primary">
                                الحالة
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((payment, index) => (
                            <motion.tr
                                key={payment.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="border-b border-border hover:bg-background/30 transition-colors"
                            >
                                <td className="py-3 px-4">
                                    <div className="font-medium text-text-primary">
                                        {payment.studentName}
                                    </div>
                                    <div className="text-xs text-text-muted">{payment.feeTypeName}</div>
                                </td>
                                <td className="py-3 px-4 font-semibold text-primary">
                                    {formatCurrency(payment.amount)}
                                </td>
                                <td className="py-3 px-4 text-sm text-text-muted">
                                    {formatDate(payment.paymentDate)}
                                </td>
                                <td className="py-3 px-4">{getStatusBadge(payment.status)}</td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    )
}

export default RecentPayments
