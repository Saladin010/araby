import PropTypes from 'prop-types'

const Spinner = ({
    size = 'md',
    color = 'primary',
    center = false,
    className = '',
}) => {
    const sizes = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4',
    }

    const colors = {
        primary: 'border-primary border-t-transparent',
        secondary: 'border-secondary border-t-transparent',
        white: 'border-white border-t-transparent',
        success: 'border-success border-t-transparent',
        error: 'border-error border-t-transparent',
    }

    const spinnerClasses = `spinner rounded-full ${sizes[size]} ${colors[color]} ${className}`

    if (center) {
        return (
            <div className="flex items-center justify-center w-full h-full min-h-[200px]">
                <div className={spinnerClasses} />
            </div>
        )
    }

    return <div className={spinnerClasses} />
}

Spinner.propTypes = {
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    color: PropTypes.oneOf(['primary', 'secondary', 'white', 'success', 'error']),
    center: PropTypes.bool,
    className: PropTypes.string,
}

export default Spinner
