import PropTypes from 'prop-types'

const Badge = ({
    variant = 'neutral',
    size = 'md',
    dot = false,
    children,
    className = '',
}) => {
    const variants = {
        success: 'bg-success/10 text-success',
        warning: 'bg-warning/10 text-warning',
        error: 'bg-error/10 text-error',
        info: 'bg-info/10 text-info',
        neutral: 'bg-text-muted/10 text-text-primary',
    }

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-1.5 text-base',
    }

    const dotColors = {
        success: 'bg-success',
        warning: 'bg-warning',
        error: 'bg-error',
        info: 'bg-info',
        neutral: 'bg-text-muted',
    }

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`}
        >
            {dot && (
                <span className={`w-2 h-2 rounded-full ${dotColors[variant]}`} />
            )}
            {children}
        </span>
    )
}

Badge.propTypes = {
    variant: PropTypes.oneOf(['success', 'warning', 'error', 'info', 'neutral']),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    dot: PropTypes.bool,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
}

export default Badge
