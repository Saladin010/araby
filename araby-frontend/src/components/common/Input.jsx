import { forwardRef } from 'react'
import PropTypes from 'prop-types'

const Input = forwardRef(({
    label,
    name,
    type = 'text',
    placeholder,
    value,
    onChange,
    error,
    helperText,
    icon,
    iconPosition = 'right',
    disabled = false,
    className = '',
    required = false,
    ...props
}, ref) => {
    const baseInputStyles = 'w-full px-4 py-3 rounded-lg border bg-surface text-text-primary placeholder:text-text-muted transition-all focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed'

    const borderStyles = error
        ? 'border-error focus:border-error focus:ring-error/20'
        : 'border-border focus:border-primary focus:ring-primary/20'

    const iconPaddingStyles = icon
        ? (iconPosition === 'right' ? 'pr-12' : 'pl-12')
        : ''

    return (
        <div className={`w-full ${className}`}>
            {/* Label */}
            {label && (
                <label htmlFor={name} className="label">
                    {label}
                    {required && <span className="text-error mr-1">*</span>}
                </label>
            )}

            {/* Input Container */}
            <div className="relative">
                {/* Icon */}
                {icon && (
                    <div className={`absolute top-1/2 -translate-y-1/2 ${iconPosition === 'right' ? 'right-4' : 'left-4'} text-text-muted`}>
                        {icon}
                    </div>
                )}

                {/* Input */}
                <input
                    ref={ref}
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`${baseInputStyles} ${borderStyles} ${iconPaddingStyles}`}
                    {...props}
                />
            </div>

            {/* Error Message */}
            {error && (
                <p className="text-error text-sm mt-1 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}

            {/* Helper Text */}
            {helperText && !error && (
                <p className="text-text-muted text-sm mt-1">{helperText}</p>
            )}
        </div>
    )
})

Input.displayName = 'Input'

Input.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['text', 'email', 'password', 'number', 'tel', 'url', 'search']),
    placeholder: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    error: PropTypes.string,
    helperText: PropTypes.string,
    icon: PropTypes.node,
    iconPosition: PropTypes.oneOf(['left', 'right']),
    disabled: PropTypes.bool,
    className: PropTypes.string,
    required: PropTypes.bool,
}

export default Input
