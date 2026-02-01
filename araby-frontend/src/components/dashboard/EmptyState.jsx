import { motion } from 'framer-motion'

/**
 * EmptyState Component - Displays when no data is available
 */
const EmptyState = ({ icon: Icon, title, description, action }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-12 px-4 text-center"
        >
            {Icon && (
                <div className="p-4 bg-background rounded-full mb-4">
                    <Icon className="w-12 h-12 text-text-muted" />
                </div>
            )}

            <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>

            {description && (
                <p className="text-sm text-text-muted mb-6 max-w-md">{description}</p>
            )}

            {action && <div>{action}</div>}
        </motion.div>
    )
}

export default EmptyState
