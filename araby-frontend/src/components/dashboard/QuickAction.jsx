import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

/**
 * QuickAction Component - Button for quick actions on dashboard
 */
const QuickAction = ({ icon: Icon, label, to, onClick, color = 'primary', delay = 0 }) => {
    const colorClasses = {
        primary: 'from-primary to-primary-dark hover:shadow-primary/20',
        secondary: 'from-secondary to-amber-600 hover:shadow-secondary/20',
        success: 'from-success to-green-600 hover:shadow-success/20',
        warning: 'from-warning to-orange-600 hover:shadow-warning/20',
        error: 'from-error to-red-600 hover:shadow-error/20',
        info: 'from-info to-blue-600 hover:shadow-info/20',
    }

    const content = (
        <>
            <div className="p-4 bg-white/10 rounded-xl mb-3 group-hover:scale-110 transition-transform duration-300">
                <Icon className="w-8 h-8" />
            </div>
            <span className="text-sm font-medium">{label}</span>
        </>
    )

    const className = `group flex flex-col items-center justify-center p-6 rounded-xl bg-gradient-to-br ${colorClasses[color] || colorClasses.primary
        } text-white shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 active:scale-95`

    if (to) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay }}
            >
                <Link to={to} className={className}>
                    {content}
                </Link>
            </motion.div>
        )
    }

    return (
        <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay }}
            onClick={onClick}
            className={className}
        >
            {content}
        </motion.button>
    )
}

export default QuickAction
