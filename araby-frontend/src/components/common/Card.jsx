import { motion } from 'framer-motion'
import PropTypes from 'prop-types'

const Card = ({
    shadow = 'md',
    hover = false,
    padding = 'md',
    bordered = true,
    glass = false,
    children,
    className = '',
    ...props
}) => {
    const shadows = {
        sm: 'shadow-sm',
        md: 'shadow-card',
        lg: 'shadow-soft',
        xl: 'shadow-xl',
        none: 'shadow-none',
    }

    const paddings = {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
        xl: 'p-10',
    }

    const baseStyles = 'rounded-xl bg-surface'
    const borderStyles = bordered ? 'border border-border' : ''
    const hoverStyles = hover ? 'transition-all duration-300 hover:shadow-soft hover:-translate-y-1 cursor-pointer' : ''
    const glassStyles = glass ? 'bg-white/80 backdrop-blur-custom border-white/20' : ''

    return (
        <motion.div
            className={`${baseStyles} ${shadows[shadow]} ${paddings[padding]} ${borderStyles} ${hoverStyles} ${glassStyles} ${className}`}
            initial={hover ? { y: 0 } : {}}
            whileHover={hover ? { y: -4 } : {}}
            {...props}
        >
            {children}
        </motion.div>
    )
}

Card.propTypes = {
    shadow: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl']),
    hover: PropTypes.bool,
    padding: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl']),
    bordered: PropTypes.bool,
    glass: PropTypes.bool,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
}

export default Card
