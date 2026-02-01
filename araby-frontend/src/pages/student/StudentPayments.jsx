import { DollarSign, Calendar, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import api from '../../services/api'
import authService from '../../services/authService'
import { DashboardLayout } from '../../components/layout'
import { formatDate } from '../../utils/dateUtils'

/**
 * Student Payments Page
 * Displays all payments for the logged-in student
 */
const StudentPayments = () => {
    const user = authService.getCurrentUser()

    // Fetch student payments
    const { data: payments, isLoading, error } = useQuery({
        queryKey: ['studentPayments', user?.userId],
        queryFn: async () => {
            const response = await api.get(`/payments/student/${user?.userId}`)
            return response.data || []
        },
        enabled: !!user?.userId,
    })

    // Calculate summary
    const totalPaid = payments?.filter(p => p.status === 'Paid')
        .reduce((sum, p) => sum + (p.amountPaid || 0), 0) || 0
    const totalPending = payments?.filter(p => p.status === 'Pending' || p.status === 'Overdue')
        .reduce((sum, p) => sum + (p.amountDue || 0), 0) || 0

    const getStatusColor = (status) => {
        switch (status) {
            case 'Paid': return 'bg-success/10 text-success'
            case 'Pending': return 'bg-warning/10 text-warning'
            case 'Overdue': return 'bg-error/10 text-error'
            default: return 'bg-background text-text-muted'
        }
    }

    const getStatusText = (status) => {
        switch (status) {
            case 'Paid': return 'مدفوع'
            case 'Pending': return 'معلق'
            case 'Overdue': return 'متأخر'
            default: return status
        }
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="card bg-error/10 border-error">
                    <p className="text-error">حدث خطأ أثناء تحميل المدفوعات</p>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary mb-2">مدفوعاتي</h1>
                <p className="text-text-muted">سجل المدفوعات والمستحقات</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card bg-gradient-to-br from-success/10 to-success/5"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-success/20 flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-success" />
                        </div>
                        <div>
                            <p className="text-sm text-text-muted mb-1">إجمالي المدفوع</p>
                            <p className="text-2xl font-bold text-success">
                                {totalPaid.toLocaleString('ar-EG')} ج.م
                            </p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card bg-gradient-to-br from-warning/10 to-warning/5"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-warning/20 flex items-center justify-center">
                            <Clock className="w-6 h-6 text-warning" />
                        </div>
                        <div>
                            <p className="text-sm text-text-muted mb-1">المستحقات المعلقة</p>
                            <p className="text-2xl font-bold text-warning">
                                {totalPending.toLocaleString('ar-EG')} ج.م
                            </p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card bg-gradient-to-br from-primary/10 to-primary/5"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-text-muted mb-1">عدد المدفوعات</p>
                            <p className="text-2xl font-bold text-primary">
                                {payments?.length || 0}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Payments Table */}
            {isLoading ? (
                <div className="card">
                    <div className="animate-pulse space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-16 bg-background rounded" />
                        ))}
                    </div>
                </div>
            ) : payments?.length === 0 ? (
                <div className="card text-center py-12">
                    <DollarSign className="w-16 h-16 mx-auto mb-4 text-text-muted" />
                    <h3 className="text-lg font-bold text-text-primary mb-2">
                        لا توجد مدفوعات
                    </h3>
                    <p className="text-text-muted">لم يتم تسجيل أي مدفوعات بعد</p>
                </div>
            ) : (
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border bg-background/50">
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-text-primary">
                                        التاريخ
                                    </th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-text-primary">
                                        المبلغ المستحق
                                    </th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-text-primary">
                                        المبلغ المدفوع
                                    </th>
                                    <th className="text-center py-3 px-4 text-sm font-semibold text-text-primary">
                                        الحالة
                                    </th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-text-primary">
                                        ملاحظات
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((payment, index) => (
                                    <motion.tr
                                        key={payment.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b border-border hover:bg-background/30 transition-colors"
                                    >
                                        <td className="py-3 px-4 text-text-primary">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-text-muted" />
                                                {formatDate(payment.paymentDate || payment.dueDate)}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 font-semibold text-text-primary">
                                            {payment.amountDue?.toLocaleString('ar-EG')} ج.م
                                        </td>
                                        <td className="py-3 px-4 font-semibold text-success">
                                            {payment.amountPaid?.toLocaleString('ar-EG') || 0} ج.م
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                                                {getStatusText(payment.status)}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-text-muted">
                                            {payment.notes || '-'}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </DashboardLayout>
    )
}

export default StudentPayments
