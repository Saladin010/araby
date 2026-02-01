import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'
import { motion } from 'framer-motion'

/**
 * WeeklyAttendanceChart Component - Bar chart for weekly attendance
 */
const WeeklyAttendanceChart = ({ data, loading = false }) => {
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-surface border border-border rounded-lg shadow-lg p-3">
                    <p className="text-sm text-text-muted mb-2">{payload[0].payload.day}</p>
                    <div className="space-y-1">
                        <p className="text-sm">
                            <span className="text-success">● حاضر:</span>{' '}
                            <span className="font-bold">{payload[0].value}</span>
                        </p>
                        <p className="text-sm">
                            <span className="text-error">● غائب:</span>{' '}
                            <span className="font-bold">{payload[1].value}</span>
                        </p>
                    </div>
                </div>
            )
        }
        return null
    }

    if (loading) {
        return (
            <div className="card">
                <div className="h-8 w-48 bg-background rounded mb-4 animate-pulse" />
                <div className="h-64 bg-background rounded animate-pulse" />
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="card"
        >
            <h3 className="text-xl font-bold text-text-primary mb-6">الحضور الأسبوعي</h3>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />

                    <XAxis
                        dataKey="day"
                        stroke="#6b7280"
                        style={{ fontSize: '12px', fontFamily: 'Cairo' }}
                    />

                    <YAxis
                        stroke="#6b7280"
                        style={{ fontSize: '12px', fontFamily: 'Cairo' }}
                    />

                    <Tooltip content={<CustomTooltip />} />

                    <Bar dataKey="present" fill="#10b981" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="absent" fill="#ef4444" radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </motion.div>
    )
}

export default WeeklyAttendanceChart
