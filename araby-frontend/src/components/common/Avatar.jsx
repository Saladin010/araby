import PropTypes from 'prop-types'

const Avatar = ({
    src,
    alt,
    name,
    size = 'md',
    status,
    className = '',
}) => {
    const sizes = {
        xs: 'w-8 h-8 text-xs',
        sm: 'w-10 h-10 text-sm',
        md: 'w-12 h-12 text-base',
        lg: 'w-16 h-16 text-lg',
        xl: 'w-20 h-20 text-xl',
    }

    const statusSizes = {
        xs: 'w-2 h-2',
        sm: 'w-2.5 h-2.5',
        md: 'w-3 h-3',
        lg: 'w-4 h-4',
        xl: 'w-5 h-5',
    }

    const statusColors = {
        online: 'bg-success',
        offline: 'bg-text-muted',
        busy: 'bg-error',
        away: 'bg-warning',
    }

    const getInitials = (name) => {
        if (!name) return '؟'
        const words = name.trim().split(' ')
        if (words.length >= 2) {
            return words[0][0] + words[1][0]
        }
        return words[0][0]
    }

    return (
        <div className={`relative inline-block ${className}`}>
            {src ? (
                <img
                    src={src}
                    alt={alt || name}
                    className={`${sizes[size]} rounded-full object-cover border-2 border-border`}
                />
            ) : (
                <div
                    className={`${sizes[size]} rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center border-2 border-border`}
                >
                    {getInitials(name)}
                </div>
            )}

            {/* Status Indicator */}
            {status && (
                <span
                    className={`absolute bottom-0 left-0 ${statusSizes[size]} ${statusColors[status]} rounded-full border-2 border-surface`}
                />
            )}
        </div>
    )
}

Avatar.propTypes = {
    src: PropTypes.string,
    alt: PropTypes.string,
    name: PropTypes.string,
    size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
    status: PropTypes.oneOf(['online', 'offline', 'busy', 'away']),
    className: PropTypes.string,
}

export default Avatar
