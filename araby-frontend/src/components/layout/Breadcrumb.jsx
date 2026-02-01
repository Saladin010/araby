import { Link } from 'react-router-dom'
import { ChevronLeft, Home } from 'lucide-react'
import PropTypes from 'prop-types'

const Breadcrumb = ({ items }) => {
    if (!items || items.length === 0) return null

    return (
        <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
            {/* Home Icon */}
            <Link
                to="/dashboard"
                className="text-text-muted hover:text-primary transition-colors"
            >
                <Home size={16} />
            </Link>

            {/* Breadcrumb Items */}
            {items.map((item, index) => {
                const isLast = index === items.length - 1

                return (
                    <div key={index} className="flex items-center gap-2">
                        {/* Separator */}
                        <ChevronLeft size={16} className="text-text-muted" />

                        {/* Item */}
                        {isLast || !item.path ? (
                            <span className="text-text-primary font-medium">
                                {item.label}
                            </span>
                        ) : (
                            <Link
                                to={item.path}
                                className="text-text-muted hover:text-primary transition-colors"
                            >
                                {item.label}
                            </Link>
                        )}
                    </div>
                )
            })}
        </nav>
    )
}

Breadcrumb.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            path: PropTypes.string,
        })
    ),
}

export default Breadcrumb
