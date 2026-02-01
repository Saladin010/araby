import { Calendar, Users, Award, DollarSign } from 'lucide-react'
import PropTypes from 'prop-types'
import { motion } from 'framer-motion'
import { useStudentStatistics } from '../../hooks/useProfile'

/**
 * StudentStatistics Component
 * Display student statistics and performance metrics
 */
const StudentStatistics = () => {
    const { data: stats, isLoading } = useStudentStatistics()

    // Overview cards data
    const overviewCards = [
        {
            icon: Calendar,
            title: 'حصصي',
            value: stats?.totalSessions || 0,
            subtitle: `${stats?.upcomingSessions || 0} حصة قادمة`,
            color: 'blue'
        },
        {
            icon: Users,
            title: 'حضوري',
            value: `${stats?.attendancePercentage || 0}%`,
            subtitle: 'نسبة الحضور',
            color: 'green'
        },
        {
            icon: Award,
            title: 'درجاتي',
            value: `${stats?.averageGrade || 0}%`,
            subtitle: `${stats?.totalExams || 0} امتحان`,
            color: 'purple'
        },
        {
            icon: DollarSign,
            title: 'مدفوعاتي',
            value: stats?.paymentStatus?.totalPaid || 0,
            subtitle: `${stats?.paymentStatus?.totalPending || 0} معلق`,
            color: 'orange'
        }
    ]

    // Chart colors
    const colorClasses = {
        blue: 'from-blue-500 to-blue-600',
        green: 'from-green-500 to-green-600',
        purple: 'from-purple-500 to-purple-600',
        orange: 'from-orange-500 to-orange-600'
    }

    // Show empty state if no stats
    if (!stats || (stats.totalSessions === 0 && stats.totalExams === 0)) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
            >
                <Award className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                    لا توجد إحصائيات بعد
                </h3>
                <p className="text-gray-600">
                    ابدأ بحضور الحصص والامتحانات لرؤية إحصائياتك هنا
                </p>
            </motion.div>
        )
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {overviewCards.map((card, index) => {
                    const Icon = card.icon
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl border border-gray-200 p-6"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses[card.color]} flex items-center justify-center`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <h3 className="text-sm font-medium text-gray-600 mb-1">{card.title}</h3>
                            <p className="text-3xl font-bold text-gray-900 mb-1">{card.value}</p>
                            <p className="text-sm text-gray-500">{card.subtitle}</p>
                        </motion.div>
                    )
                })}
            </div>

            {/* Info Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                    📊 <strong>ملاحظة:</strong> الإحصائيات يتم تحديثها تلقائياً بناءً على نشاطك في النظام. سيتم إضافة المزيد من التفاصيل قريباً.
                </p>
            </div>
        </motion.div>
    )
}

StudentStatistics.propTypes = {}

export default StudentStatistics
