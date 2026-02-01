import { Users, TrendingUp, Award, DollarSign, Calendar, BarChart3 } from 'lucide-react'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'

/**
 * GroupStatistics Component
 * Displays statistics and analytics for a group
 */
const GroupStatistics = ({ group, stats, isLoading }) => {
    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    const statsData = stats || {
        totalStudents: group?.membersCount || 0,
        averageAttendance: 0,
        averageGrade: 0,
        totalPaid: 0,
        pendingPayments: 0
    }

    const statCards = [
        {
            title: 'إجمالي الطلاب',
            value: statsData.totalStudents,
            icon: Users,
            color: 'blue',
            suffix: 'طالب'
        },
        {
            title: 'معدل الحضور',
            value: `${statsData.averageAttendance}%`,
            icon: Calendar,
            color: 'green',
            suffix: ''
        },
        {
            title: 'متوسط الدرجات',
            value: `${statsData.averageGrade}%`,
            icon: Award,
            color: 'purple',
            suffix: ''
        },
        {
            title: 'إجمالي المدفوعات',
            value: statsData.totalPaid?.toLocaleString('ar-EG') || 0,
            icon: DollarSign,
            color: 'orange',
            suffix: 'جنيه'
        }
    ]

    const colorClasses = {
        blue: { bg: 'bg-blue-100', text: 'text-blue-600', ring: 'ring-blue-500' },
        green: { bg: 'bg-green-100', text: 'text-green-600', ring: 'ring-green-500' },
        purple: { bg: 'bg-purple-100', text: 'text-purple-600', ring: 'ring-purple-500' },
        orange: { bg: 'bg-orange-100', text: 'text-orange-600', ring: 'ring-orange-500' }
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, index) => {
                    const colors = colorClasses[stat.color]
                    const Icon = stat.icon

                    return (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-6"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 ${colors.bg} rounded-lg ${colors.ring} ring-2`}>
                                    <Icon className={`w-6 h-6 ${colors.text}`} />
                                </div>
                            </div>
                            <h3 className="text-sm font-medium text-gray-600 mb-1">
                                {stat.title}
                            </h3>
                            <div className="flex items-baseline gap-2">
                                <p className="text-3xl font-bold text-gray-900">
                                    {stat.value}
                                </p>
                                {stat.suffix && (
                                    <span className="text-sm text-gray-500">
                                        {stat.suffix}
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            {/* Additional Info */}
            {statsData.pendingPayments > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
                >
                    <div className="flex items-start gap-3">
                        <TrendingUp className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-yellow-900 mb-1">
                                مدفوعات معلقة
                            </h4>
                            <p className="text-sm text-yellow-800">
                                يوجد {statsData.pendingPayments} مدفوعات معلقة أو متأخرة في هذه المجموعة
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Performance Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-4">
                    <BarChart3 className="w-6 h-6 text-primary" />
                    <h3 className="text-lg font-bold text-gray-900">
                        ملخص الأداء
                    </h3>
                </div>

                <div className="space-y-4">
                    {/* Attendance Bar */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">الحضور</span>
                            <span className="text-sm font-bold text-gray-900">
                                {statsData.averageAttendance}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${statsData.averageAttendance}%` }}
                            />
                        </div>
                    </div>

                    {/* Grades Bar */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">الدرجات</span>
                            <span className="text-sm font-bold text-gray-900">
                                {statsData.averageGrade}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${statsData.averageGrade}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

GroupStatistics.propTypes = {
    group: PropTypes.object,
    stats: PropTypes.object,
    isLoading: PropTypes.bool
}

export default GroupStatistics
