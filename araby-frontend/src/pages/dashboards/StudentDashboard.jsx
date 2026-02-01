import { Calendar, TrendingUp, Award, DollarSign } from 'lucide-react'
import { motion } from 'framer-motion'
import {
    StatCard,
    QuickAction,
    UpcomingSessions,
} from '../../components/dashboard'
import { useStudentDashboard } from '../../hooks/useDashboardData'
import { formatDate, formatTime, getGreeting, formatPercentage } from '../../utils/dateUtils'
import authService from '../../services/authService'
import { DashboardLayout } from '../../components/layout'

/**
 * Student Dashboard Component
 */
const StudentDashboard = () => {
    const user = authService.getCurrentUser()
    const { data, isLoading, error } = useStudentDashboard()

    if (error) {
        return (
            <DashboardLayout>
                <div className="card bg-error/10 border-error">
                    <p className="text-error">حدث خطأ أثناء تحميل البيانات</p>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-3xl font-bold text-text-primary">
                        {getGreeting()}
                    </h1>
                    <div className="text-sm text-text-muted">
                        {formatDate(new Date())} - {formatTime(new Date())}
                    </div>
                </div>
                <p className="text-text-muted">لوحة التحكم الرئيسية</p>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="حصصي القادمة"
                    value={data?.stats.upcomingSessions || 0}
                    icon={Calendar}
                    subtitle="حصص"
                    link="/profile"
                    linkText="عرض الجدول"
                    color="primary"
                    delay={0}
                />

                <StatCard
                    title="نسبة حضوري"
                    value={`${data?.stats.attendanceRate || 0}٪`}
                    icon={TrendingUp}
                    subtitle={`${data?.stats.totalSessionsAttended || 0} حصة`}
                    link="/profile"
                    linkText="عرض السجل"
                    color="success"
                    delay={0.1}
                />

                <StatCard
                    title="متوسط درجاتي"
                    value={`${data?.stats.averageGrade || 0}٪`}
                    icon={Award}
                    link="/profile"
                    linkText="عرض الدرجات"
                    color="info"
                    delay={0.2}
                />

                <StatCard
                    title="حالة المدفوعات"
                    value={
                        data?.stats.paymentStatus === 'Paid'
                            ? 'مدفوع'
                            : `${data?.stats.paymentAmount?.toLocaleString('ar-EG') || 0} ج.م`
                    }
                    icon={DollarSign}
                    link="/profile"
                    linkText="عرض المدفوعات"
                    color={data?.stats.paymentStatus === 'Paid' ? 'success' : 'warning'}
                    delay={0.3}
                />
            </div>

            {/* Upcoming Sessions */}
            <div className="mb-8">
                <h3 className="text-xl font-bold text-text-primary mb-4">حصصي القادمة</h3>
                <UpcomingSessions sessions={data?.upcomingSessions} loading={isLoading} />
            </div>

            {/* Recent Grades */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mb-8"
            >
                <h3 className="text-xl font-bold text-text-primary mb-4">آخر درجاتي</h3>

                {isLoading ? (
                    <div className="card">
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="h-4 w-1/2 bg-background rounded animate-pulse" />
                                    <div className="h-4 w-16 bg-background rounded animate-pulse" />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border bg-background/50">
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-text-primary">
                                            الامتحان
                                        </th>
                                        <th className="text-center py-3 px-4 text-sm font-semibold text-text-primary">
                                            الدرجة
                                        </th>
                                        <th className="text-center py-3 px-4 text-sm font-semibold text-text-primary">
                                            النسبة
                                        </th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-text-primary">
                                            التاريخ
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.recentGrades?.map((grade, index) => (
                                        <motion.tr
                                            key={grade.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                            className="border-b border-border hover:bg-background/30 transition-colors"
                                        >
                                            <td className="py-3 px-4 text-text-primary">{grade.examName}</td>
                                            <td className="py-3 px-4 text-center font-semibold text-primary">
                                                {grade.score} / {grade.maxScore}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <span
                                                    className={`font-bold ${grade.percentage >= 90
                                                        ? 'text-success'
                                                        : grade.percentage >= 75
                                                            ? 'text-info'
                                                            : grade.percentage >= 60
                                                                ? 'text-warning'
                                                                : 'text-error'
                                                        }`}
                                                >
                                                    {formatPercentage(grade.percentage)}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-text-muted">
                                                {formatDate(grade.date)}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Payments Section (Placeholder if not available, or add ID to existing logic if it was there?) */}
            {/* The previous code didn't have a specific payments table in the body, only in quick links/stats. */}
        </DashboardLayout>
    )
}

export default StudentDashboard
