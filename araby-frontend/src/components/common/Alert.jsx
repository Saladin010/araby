import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import PropTypes from 'prop-types'

const Alert = ({
    variant = 'info',
    dismissible = false,
    onDismiss,
    children,
    className = '',
}) => {
    const [isVisible, setIsVisible] = useState(true)

    const variants = {
        success: {
            bg: 'bg-success/10',
            border: 'border-success/20',
            text: 'text-success',
            icon: <CheckCircle size={20} />,
        },
        warning: {
            bg: 'bg-warning/10',
            border: 'border-warning/20',
            text: 'text-warning',
            icon: <AlertTriangle size={20} />,
        },
        error: {
            bg: 'bg-error/10',
            border: 'border-error/20',
            text: 'text-error',
            icon: <AlertCircle size={20} />,
        },
        info: {
            bg: 'bg-info/10',
            border: 'border-info/20',
            text: 'text-info',
            icon: <Info size={20} />,
        },
    }

    const handleDismiss = () => {
        setIsVisible(false)
        if (onDismiss) {
            setTimeout(onDismiss, 300)
        }
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`
            ${variants[variant].bg}
            ${variants[variant].border}
            border rounded-lg p-4 flex items-start gap-3
            ${className}
          `}
                >
                    {/* Icon */}
                    <span className={variants[variant].text}>
                        {variants[variant].icon}
                    </span>

                    {/* Content */}
                    <div className="flex-1 text-sm text-text-primary">
                        {children}
                    </div>

                    {/* Dismiss Button */}
                    {dismissible && (
                        <button
                            onClick={handleDismiss}
                            className={`${variants[variant].text} hover:opacity-70 transition-opacity`}
                        >
                            <X size={18} />
                        </button>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    )
}

Alert.propTypes = {
    variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']),
    dismissible: PropTypes.bool,
    onDismiss: PropTypes.func,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
}

export default Alert
