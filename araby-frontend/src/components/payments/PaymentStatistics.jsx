import { DollarSign, TrendingUp, CheckCircle, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { usePaymentStatistics } from '../../hooks/usePayments'
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'

/**
 * PaymentStatistics Component
 * Displays payment statistics and charts
 */
const PaymentStatistics = () => {
    const { data: statsData, isLoading } = usePaymentStatistics()

    // Extract data from API response - backend returns simple stats, not chart data
    const stats = statsData || {}

    // Calculate average payment
    const averagePayment = stats.totalPayments > 0
        ? stats.totalRevenue / stats.totalPayments
        : 0

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    // Show message if no data available
    if (!stats || Object.keys(stats).length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <p className="text-gray-500 text-lg font-medium">لا توجد إحصائيات متاحة</p>
                <p className="text-gray-400 text-sm mt-2">قم بتسجيل بعض المدفوعات أولاً</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm font-medium">إجمالي الإيرادات</p>
                            <p className="text-3xl font-bold mt-2">
                                {(stats.totalRevenue || 0).toLocaleString()}
                            </p>
                            <p className="text-green-100 text-xs mt-1">جنيه</p>
                        </div>
                        <div className="p-3 bg-white/20 rounded-lg">
                            <DollarSign className="w-8 h-8" />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium">إجمالي المدفوعات</p>
                            <p className="text-3xl font-bold mt-2">{stats.totalPayments || 0}</p>
                        </div>
                        <div className="p-3 bg-white/20 rounded-lg">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-yellow-100 text-sm font-medium">المعلقة</p>
                            <p className="text-3xl font-bold mt-2">{stats.pendingPayments || 0}</p>
                            <p className="text-yellow-100 text-xs mt-1">
                                {(stats.pendingAmount || 0).toLocaleString()} جنيه
                            </p>
                        </div>
                        <div className="p-3 bg-white/20 rounded-lg">
                            <Clock className="w-8 h-8" />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm font-medium">متوسط الدفعة</p>
                            <p className="text-3xl font-bold mt-2">
                                {averagePayment.toLocaleString()}
                            </p>
                            <p className="text-purple-100 text-xs mt-1">جنيه</p>
                        </div>
                        <div className="p-3 bg-white/20 rounded-lg">
                            <TrendingUp className="w-8 h-8" />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Summary Statistics Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl shadow-lg p-6"
            >
                <h3 className="text-lg font-bold text-gray-900 mb-4">ملخص الإحصائيات</h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <span className="text-gray-600">إجمالي الإيرادات:</span>
                        <span className="font-bold text-green-600">
                            {(stats.totalRevenue || 0).toLocaleString()} جنيه
                        </span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <span className="text-gray-600">إيرادات الشهر الحالي:</span>
                        <span className="font-bold text-blue-600">
                            {(stats.monthlyRevenue || 0).toLocaleString()} جنيه
                        </span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <span className="text-gray-600">إجمالي المدفوعات:</span>
                        <span className="font-bold text-blue-600">{stats.totalPayments || 0}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <span className="text-gray-600">المدفوعات المعلقة:</span>
                        <span className="font-bold text-yellow-600">{stats.pendingPayments || 0}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <span className="text-gray-600">المبلغ المعلق:</span>
                        <span className="font-bold text-yellow-600">
                            {(stats.pendingAmount || 0).toLocaleString()} جنيه
                        </span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <span className="text-gray-600">المدفوعات المتأخرة:</span>
                        <span className="font-bold text-red-600">{stats.overduePayments || 0}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <span className="text-gray-600">المبلغ المتأخر:</span>
                        <span className="font-bold text-red-600">
                            {(stats.overdueAmount || 0).toLocaleString()} جنيه
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">متوسط قيمة الدفعة:</span>
                        <span className="font-bold text-purple-600">
                            {averagePayment.toLocaleString()} جنيه
                        </span>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default PaymentStatistics
