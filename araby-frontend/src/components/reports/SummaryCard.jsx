import { useEffect, useRef } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'

/**
 * SummaryCard Component
 * Stat card with animated counter and trend indicator
 */
const SummaryCard = ({ icon: Icon, title, value, trend, trendLabel, color = 'blue', format = 'number' }) => {
    const valueRef = useRef(null)

    // Animate counter
    useEffect(() => {
        if (!valueRef.current || format !== 'number') return

        const target = typeof value === 'number' ? value : parseFloat(value) || 0
        const duration = 1000
        const steps = 60
        const increment = target / steps
        let current = 0
        let step = 0

        const timer = setInterval(() => {
            current += increment
            step++

            if (step >= steps) {
                current = target
                clearInterval(timer)
            }

            if (valueRef.current) {
                valueRef.current.textContent = Math.floor(current).toLocaleString('ar-EG')
            }
        }, duration / steps)

        return () => clearInterval(timer)
    }, [value, format])

    const colorClasses = {
        blue: 'from-blue-500 to-cyan-600',
        green: 'from-green-500 to-emerald-600',
        purple: 'from-purple-500 to-pink-600',
        orange: 'from-orange-500 to-red-600',
        indigo: 'from-indigo-500 to-blue-600'
    }

    const iconBgClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
        orange: 'bg-orange-50 text-orange-600',
        indigo: 'bg-indigo-50 text-indigo-600'
    }

    const formatValue = (val) => {
        if (format === 'currency') {
            return `${val.toLocaleString('ar-EG')} جنيه`
        }
        if (format === 'percentage') {
            return `${val}%`
        }
        if (format === 'text') {
            return val
        }
        return val.toLocaleString('ar-EG')
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
        >
            {/* Icon */}
            <div className={`inline-flex p-3 rounded-lg ${iconBgClasses[color]} mb-4`}>
                <Icon className="w-6 h-6" />
            </div>

            {/* Title */}
            <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>

            {/* Value */}
            <div className="flex items-baseline gap-2 mb-2">
                <span
                    ref={format === 'number' ? valueRef : null}
                    className={`text-3xl font-bold bg-gradient-to-r ${colorClasses[color]} bg-clip-text text-transparent`}
                >
                    {format === 'number' ? '0' : formatValue(value)}
                </span>
            </div>

            {/* Trend */}
            {trend !== undefined && trend !== null && (
                <div className="flex items-center gap-2">
                    {trend > 0 ? (
                        <div className="flex items-center gap-1 text-green-600">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-sm font-medium">+{trend.toFixed(1)}%</span>
                        </div>
                    ) : trend < 0 ? (
                        <div className="flex items-center gap-1 text-red-600">
                            <TrendingDown className="w-4 h-4" />
                            <span className="text-sm font-medium">{trend.toFixed(1)}%</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 text-gray-500">
                            <span className="text-sm font-medium">0%</span>
                        </div>
                    )}
                    {trendLabel && (
                        <span className="text-xs text-gray-500">{trendLabel}</span>
                    )}
                </div>
            )}
        </motion.div>
    )
}

SummaryCard.propTypes = {
    icon: PropTypes.elementType.isRequired,
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    trend: PropTypes.number,
    trendLabel: PropTypes.string,
    color: PropTypes.oneOf(['blue', 'green', 'purple', 'orange', 'indigo']),
    format: PropTypes.oneOf(['number', 'currency', 'percentage', 'text'])
}

export default SummaryCard
