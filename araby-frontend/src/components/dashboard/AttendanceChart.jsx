import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { motion } from 'framer-motion'

/**
 * AttendanceChart Component - Displays attendance distribution as pie chart
 */
const AttendanceChart = ({ data, loading = false }) => {
    const COLORS = {
        present: '#10b981', // success
        absent: '#ef4444', // error
        late: '#f59e0b', // warning
        excused: '#3b82f6', // info
    }

    const LABELS = {
        present: 'حاضر',
        absent: 'غائب',
        late: 'متأخر',
        excused: 'معذور',
    }

    // Transform data for pie chart
    const chartData = data
        ? Object.entries(data).map(([key, value]) => ({
            name: LABELS[key] || key,
            value: value,
            color: COLORS[key] || '#6b7280',
        }))
        : []

    // Custom label
    const renderLabel = (entry) => {
        const percent = ((entry.value / entry.payload.total) * 100).toFixed(1)
        return `${percent}٪`
    }

    // Custom tooltip
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-surface border border-border rounded-lg shadow-lg p-3">
                    <p className="text-sm font-medium text-text-primary mb-1">
                        {payload[0].name}
                    </p>
                    <p className="text-lg font-bold" style={{ color: payload[0].payload.color }}>
                        {payload[0].value} طالب
                    </p>
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
            transition={{ duration: 0.5, delay: 0.3 }}
            className="card"
        >
            <h3 className="text-xl font-bold text-text-primary mb-6">توزيع الحضور</h3>

            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderLabel}
                        outerRadius={100}
                        innerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        animationDuration={1500}
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>

                    <Tooltip content={<CustomTooltip />} />

                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        wrapperStyle={{ fontFamily: 'Cairo', fontSize: '14px' }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </motion.div>
    )
}

export default AttendanceChart
