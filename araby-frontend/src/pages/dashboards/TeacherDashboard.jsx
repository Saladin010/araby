import { Users, Calendar, DollarSign, TrendingUp, UserPlus, CalendarPlus, CreditCard, FileText, GraduationCap } from 'lucide-react'
import { motion } from 'framer-motion'
import {
    StatCard,
    QuickAction,
    UpcomingSessions,
    RecentPayments,
} from '../../components/dashboard'
import { useTeacherDashboard } from '../../hooks/useDashboardData'
import { formatDate, formatTime, getGreeting } from '../../utils/dateUtils'
import authService from '../../services/authService'
import { DashboardLayout } from '../../components/layout'

/**
 * Teacher Dashboard Component
 */
const TeacherDashboard = () => {
    const user = authService.getCurrentUser()
    const { data, isLoading, error } = useTeacherDashboard()

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                <StatCard
                    title="إجمالي الطلاب"
                    value={data?.stats.totalStudents || 0}
                    icon={Users}
                    trend={data?.stats.totalStudentsTrend}
                    trendLabel="عن الشهر الماضي"
                    link="/students"
                    linkText="عرض الكل"
                    color="primary"
                    delay={0}
                />

                <StatCard
                    title="الحصص اليوم"
                    value={data?.stats.todaySessions || 0}
                    icon={Calendar}
                    subtitle="حصص"
                    link="/sessions"
                    linkText="عرض الجدول"
                    color="info"
                    delay={0.1}
                />

                <StatCard
                    title="الدرجات المسجلة"
                    value={data?.stats.totalGrades || 0}
                    icon={GraduationCap}
                    subtitle="درجة"
                    link="/grades"
                    linkText="عرض الدرجات"
                    color="secondary"
                    delay={0.2}
                />

                <StatCard
                    title="المدفوعات المعلقة"
                    value={data?.stats.pendingPayments || 0}
                    icon={DollarSign}
                    subtitle={`${data?.stats.pendingPaymentsAmount?.toLocaleString('ar-EG') || 0} ج.م`}
                    link="/payments/pending"
                    linkText="عرض التفاصيل"
                    color="warning"
                    delay={0.3}
                />

                <StatCard
                    title="إجمالي الإيرادات"
                    value={data?.stats.monthlyRevenue || 0}
                    icon={TrendingUp}
                    subtitle="ج.م"
                    trend={data?.stats.monthlyRevenueTrend}
                    trendLabel="عن الشهر الماضي"
                    link="/reports/financial"
                    linkText="عرض التقرير"
                    color="success"
                    delay={0.4}
                />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Upcoming Sessions */}
                <div>
                    <h3 className="text-xl font-bold text-text-primary mb-4">الحصص القادمة</h3>
                    <UpcomingSessions sessions={data?.upcomingSessions} loading={isLoading} />
                </div>

                {/* Recent Payments */}
                <div>
                    <h3 className="text-xl font-bold text-text-primary mb-4">آخر المدفوعات</h3>
                    <RecentPayments payments={data?.recentPayments} loading={isLoading} />
                </div>
            </div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <h3 className="text-xl font-bold text-text-primary mb-4">إجراءات سريعة</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <QuickAction
                        icon={UserPlus}
                        label="إضافة طالب جديد"
                        to="/students/add"
                        color="primary"
                        delay={0}
                    />
                    <QuickAction
                        icon={CalendarPlus}
                        label="جدولة حصة"
                        to="/sessions/add"
                        color="info"
                        delay={0.1}
                    />
                    <QuickAction
                        icon={CreditCard}
                        label="تسجيل دفعة"
                        to="/payments/add"
                        color="success"
                        delay={0.2}
                    />
                    <QuickAction
                        icon={GraduationCap}
                        label="إضافة درجة"
                        to="/grades"
                        color="secondary"
                        delay={0.3}
                    />
                    <QuickAction
                        icon={FileText}
                        label="عرض التقارير"
                        to="/reports"
                        color="warning"
                        delay={0.4}
                    />
                </div>
            </motion.div>
        </DashboardLayout>
    )
}

export default TeacherDashboard
