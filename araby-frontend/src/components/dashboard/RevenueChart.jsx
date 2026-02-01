import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'
import { motion } from 'framer-motion'
import { formatCurrency } from '../../utils/dateUtils'

/**
 * RevenueChart Component - Displays monthly revenue as area chart
 */
const RevenueChart = ({ data, loading = false }) => {
    // Custom tooltip
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-surface border border-border rounded-lg shadow-lg p-3">
                    <p className="text-sm text-text-muted mb-1">{payload[0].payload.month}</p>
                    <p className="text-lg font-bold text-primary">
                        {formatCurrency(payload[0].value)}
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
            transition={{ duration: 0.5, delay: 0.2 }}
            className="card"
        >
            <h3 className="text-xl font-bold text-text-primary mb-6">الإيرادات الشهرية</h3>

            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />

                    <XAxis
                        dataKey="month"
                        stroke="#6b7280"
                        style={{ fontSize: '12px', fontFamily: 'Cairo' }}
                    />

                    <YAxis
                        stroke="#6b7280"
                        style={{ fontSize: '12px', fontFamily: 'Cairo' }}
                        tickFormatter={(value) => `${value.toLocaleString('ar-EG')} ج.م`}
                    />

                    <Tooltip content={<CustomTooltip />} />

                    <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#10b981"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                        animationDuration={1500}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </motion.div>
    )
}

export default RevenueChart
