import { motion } from 'framer-motion'
import PropTypes from 'prop-types'

const Button = ({
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    icon = null,
    iconPosition = 'right',
    fullWidth = false,
    onClick,
    children,
    className = '',
    type = 'button',
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden'

    const variants = {
        primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary shadow-md hover:shadow-lg active:scale-95',
        secondary: 'bg-secondary text-white hover:bg-amber-600 focus:ring-secondary shadow-md hover:shadow-lg active:scale-95',
        outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary active:scale-95',
        ghost: 'text-text-primary hover:bg-background focus:ring-primary active:scale-95',
        danger: 'bg-error text-white hover:bg-red-600 focus:ring-error shadow-md hover:shadow-lg active:scale-95',
    }

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    }

    const widthClass = fullWidth ? 'w-full' : ''

    return (
        <motion.button
            type={type}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
            onClick={onClick}
            disabled={disabled || loading}
            whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
            {...props}
        >
            {/* Ripple Effect */}
            <motion.span
                className="absolute inset-0 bg-white/20"
                initial={{ scale: 0, opacity: 0 }}
                whileTap={{ scale: 2, opacity: [0, 0.3, 0] }}
                transition={{ duration: 0.5 }}
            />

            {/* Content */}
            {loading ? (
                <>
                    <span className="spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                    <span>جاري التحميل...</span>
                </>
            ) : (
                <>
                    {icon && iconPosition === 'right' && <span>{icon}</span>}
                    <span>{children}</span>
                    {icon && iconPosition === 'left' && <span>{icon}</span>}
                </>
            )}
        </motion.button>
    )
}

Button.propTypes = {
    variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost', 'danger']),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    icon: PropTypes.node,
    iconPosition: PropTypes.oneOf(['left', 'right']),
    fullWidth: PropTypes.bool,
    onClick: PropTypes.func,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    type: PropTypes.string,
}

export default Button
