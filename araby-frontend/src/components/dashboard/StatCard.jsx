import { motion } from 'framer-motion'
import { ArrowUp, ArrowDown, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCountUp } from '../../hooks/useAnimations'

/**
 * StatCard Component - Displays statistics with icon, value, and trend
 */
const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    trendLabel,
    link,
    linkText = 'عرض التفاصيل',
    color = 'primary',
    subtitle,
    delay = 0,
}) => {
    const countRef = useCountUp(typeof value === 'number' ? value : 0, 1500)

    const colorClasses = {
        primary: 'from-primary/10 to-primary/5 text-primary',
        secondary: 'from-secondary/10 to-secondary/5 text-secondary',
        success: 'from-success/10 to-success/5 text-success',
        warning: 'from-warning/10 to-warning/5 text-warning',
        error: 'from-error/10 to-error/5 text-error',
        info: 'from-info/10 to-info/5 text-info',
    }

    const getTrendIcon = () => {
        if (!trend) return null
        if (trend > 0) return <ArrowUp className="w-4 h-4" />
        if (trend < 0) return <ArrowDown className="w-4 h-4" />
        return <TrendingUp className="w-4 h-4" />
    }

    const getTrendColor = () => {
        if (!trend) return ''
        return trend > 0 ? 'text-success' : trend < 0 ? 'text-error' : 'text-text-muted'
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            className="card card-hover"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <p className="text-sm text-text-muted mb-1">{title}</p>
                    <div className="flex items-baseline gap-2">
                        {typeof value === 'number' ? (
                            <h3 className="text-3xl font-bold text-text-primary" ref={countRef}>
                                0
                            </h3>
                        ) : (
                            <h3 className="text-3xl font-bold text-text-primary">{value}</h3>
                        )}
                        {subtitle && <span className="text-sm text-text-muted">{subtitle}</span>}
                    </div>
                </div>

                {/* Icon */}
                <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color] || colorClasses.primary
                        }`}
                >
                    <Icon className="w-6 h-6" />
                </div>
            </div>

            {/* Trend */}
            {trend !== undefined && (
                <div className={`flex items-center gap-1 text-sm ${getTrendColor()} mb-3`}>
                    {getTrendIcon()}
                    <span className="font-medium">{Math.abs(trend)}٪</span>
                    {trendLabel && <span className="text-text-muted mr-1">{trendLabel}</span>}
                </div>
            )}

            {/* Link */}
            {link && (
                <Link
                    to={link}
                    className="text-sm text-primary hover:text-primary-dark font-medium inline-flex items-center gap-1 transition-colors"
                >
                    {linkText}
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                </Link>
            )}
        </motion.div>
    )
}

export default StatCard
