import { Users, Calendar, DollarSign, TrendingUp, UserPlus, CheckSquare, CreditCard, Award, GraduationCap } from 'lucide-react'
import { motion } from 'framer-motion'
import {
    StatCard,
    QuickAction,
    UpcomingSessions,
} from '../../components/dashboard'
import { useAssistantDashboard } from '../../hooks/useDashboardData'
import { formatDate, formatTime, getGreeting } from '../../utils/dateUtils'
import authService from '../../services/authService'
import { DashboardLayout } from '../../components/layout'

/**
 * Assistant Dashboard Component
 */
const AssistantDashboard = () => {
    const user = authService.getCurrentUser()
    const { data, isLoading, error } = useAssistantDashboard()

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard
                    title="إجمالي الطلاب"
                    value={data?.stats.totalStudents || 0}
                    icon={Users}
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
                    title="المدفوعات المعلقة"
                    value={data?.stats.pendingPayments || 0}
                    icon={DollarSign}
                    subtitle={`${data?.stats.pendingPaymentsAmount?.toLocaleString('ar-EG') || 0} ج.م`}
                    link="/payments/pending"
                    linkText="عرض التفاصيل"
                    color="warning"
                    delay={0.3}
                />
            </div>

            {/* Upcoming Sessions */}
            <div className="mb-8">
                <h3 className="text-xl font-bold text-text-primary mb-4">الحصص القادمة</h3>
                <UpcomingSessions sessions={data?.upcomingSessions} loading={isLoading} />
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
                        icon={CheckSquare}
                        label="تسجيل حضور"
                        to="/attendance/add"
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
                        icon={Award}
                        label="إضافة درجة"
                        to="/grades/add"
                        color="secondary"
                        delay={0.3}
                    />
                </div>
            </motion.div>
        </DashboardLayout>
    )
}

export default AssistantDashboard
