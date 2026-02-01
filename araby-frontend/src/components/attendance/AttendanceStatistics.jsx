import { TrendingUp, Users, Calendar, CheckCircle, PieChart } from 'lucide-react'
import { motion } from 'framer-motion'
import { useOverallStatistics } from '../../hooks/useAttendance'

/**
 * AttendanceStatistics Component
 * Display attendance statistics and charts
 */
const AttendanceStatistics = () => {
    const { data: stats, isLoading } = useOverallStatistics()

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!stats) {
        return (
            <div className="card p-12 text-center">
                <p className="text-text-muted">لا توجد إحصائيات متاحة</p>
            </div>
        )
    }

    const totalRecords = stats.presentCount + stats.absentCount + stats.lateCount + stats.excusedCount

    const statCards = [
        {
            label: 'إجمالي الحصص',
            value: stats.totalSessions,
            icon: Calendar,
            color: 'primary',
            bgColor: 'bg-primary/10'
        },
        {
            label: 'إجمالي السجلات',
            value: totalRecords,
            icon: Users,
            color: 'info',
            bgColor: 'bg-info/10'
        },
        {
            label: 'نسبة الحضور',
            value: `${stats.attendancePercentage.toFixed(1)}%`,
            icon: TrendingUp,
            color: 'success',
            bgColor: 'bg-success/10'
        },
        {
            label: 'الطلاب الحاضرون',
            value: stats.presentCount,
            icon: CheckCircle,
            color: 'success',
            bgColor: 'bg-success/10'
        },
    ]

    const statusDistribution = [
        { label: 'حاضر', count: stats.presentCount, color: 'success', percentage: totalRecords > 0 ? (stats.presentCount / totalRecords * 100).toFixed(1) : 0 },
        { label: 'غائب', count: stats.absentCount, color: 'error', percentage: totalRecords > 0 ? (stats.absentCount / totalRecords * 100).toFixed(1) : 0 },
        { label: 'متأخر', count: stats.lateCount, color: 'warning', percentage: totalRecords > 0 ? (stats.lateCount / totalRecords * 100).toFixed(1) : 0 },
        { label: 'معذور', count: stats.excusedCount, color: 'info', percentage: totalRecords > 0 ? (stats.excusedCount / totalRecords * 100).toFixed(1) : 0 },
    ]

    return (
        <div className="space-y-6">
            {/* Overall Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`card ${stat.bgColor}`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <stat.icon className={`w-8 h-8 text-${stat.color}`} />
                        </div>
                        <p className="text-3xl font-bold text-text-primary mb-1">
                            {stat.value}
                        </p>
                        <p className="text-sm text-text-muted">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Status Distribution */}
            <div className="card">
                <h3 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-primary" />
                    توزيع حالات الحضور
                </h3>

                <div className="space-y-4">
                    {statusDistribution.map((item, index) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <span className={`badge badge-${item.color}`}>
                                        {item.label}
                                    </span>
                                    <span className="text-text-muted text-sm">
                                        {item.count} سجل
                                    </span>
                                </div>
                                <span className="text-text-primary font-bold">
                                    {item.percentage}%
                                </span>
                            </div>
                            <div className="h-3 bg-background rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${item.percentage}%` }}
                                    transition={{ duration: 0.8, delay: index * 0.1 }}
                                    className={`h-full bg-${item.color}`}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Summary Card */}
            <div className="card bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <h3 className="text-xl font-bold text-text-primary mb-4">
                    ملخص الإحصائيات
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-success">{stats.presentCount}</p>
                        <p className="text-sm text-text-muted">حاضر</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-error">{stats.absentCount}</p>
                        <p className="text-sm text-text-muted">غائب</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-warning">{stats.lateCount}</p>
                        <p className="text-sm text-text-muted">متأخر</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-info">{stats.excusedCount}</p>
                        <p className="text-sm text-text-muted">معذور</p>
                    </div>
                </div>
            </div>

            {/* Note */}
            <div className="card bg-info/10 border-info/30">
                <p className="text-info text-sm">
                    💡 <strong>ملاحظة:</strong> الإحصائيات تشمل جميع سجلات الحضور المسجلة في النظام.
                    يمكنك استخدام تبويب "سجل الحضور" لعرض تفاصيل أكثر.
                </p>
            </div>
        </div>
    )
}

export default AttendanceStatistics
