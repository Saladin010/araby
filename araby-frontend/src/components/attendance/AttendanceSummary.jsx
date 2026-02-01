import { CheckCircle, XCircle, Clock, FileText, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

/**
 * AttendanceSummary Component
 * Shows live summary of attendance marking progress
 */
const AttendanceSummary = ({ attendanceData, totalStudents }) => {
    // Count each status
    const counts = {
        present: attendanceData.filter(a => a.status === 1).length,
        absent: attendanceData.filter(a => a.status === 2).length,
        late: attendanceData.filter(a => a.status === 3).length,
        excused: attendanceData.filter(a => a.status === 4).length,
    }

    const markedCount = attendanceData.filter(a => a.status).length
    const progress = totalStudents > 0 ? (markedCount / totalStudents) * 100 : 0

    const stats = [
        {
            label: 'حاضر',
            count: counts.present,
            icon: CheckCircle,
            color: 'text-success',
            bgColor: 'bg-success/10'
        },
        {
            label: 'غائب',
            count: counts.absent,
            icon: XCircle,
            color: 'text-error',
            bgColor: 'bg-error/10'
        },
        {
            label: 'متأخر',
            count: counts.late,
            icon: Clock,
            color: 'text-warning',
            bgColor: 'bg-warning/10'
        },
        {
            label: 'معذور',
            count: counts.excused,
            icon: FileText,
            color: 'text-info',
            bgColor: 'bg-info/10'
        },
    ]

    return (
        <div className="card bg-gradient-to-br from-background to-surface">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    ملخص الحضور
                </h3>
                <div className="text-sm text-text-muted">
                    {markedCount} من {totalStudents} تم تسجيلهم
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
                <div className="h-3 bg-background rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-primary to-primary/70"
                    />
                </div>
                <p className="text-xs text-text-muted mt-1 text-center">
                    {progress.toFixed(0)}% مكتمل
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`${stat.bgColor} rounded-lg p-3 text-center`}
                    >
                        <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-1`} />
                        <p className="text-2xl font-bold text-text-primary">
                            {stat.count}
                        </p>
                        <p className="text-xs text-text-muted">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Completion Message */}
            {markedCount === totalStudents && totalStudents > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-success/10 border border-success/30 rounded-lg text-center"
                >
                    <p className="text-success font-semibold">
                        ✅ تم تسجيل حضور جميع الطلاب
                    </p>
                </motion.div>
            )}
        </div>
    )
}

export default AttendanceSummary
