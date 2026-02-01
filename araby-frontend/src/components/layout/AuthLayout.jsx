import { motion } from 'framer-motion'
import PropTypes from 'prop-types'

const AuthLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-bl from-primary/10 via-background to-secondary/5 p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }} />
            </div>

            {/* Content Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="relative w-full max-w-md"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-heading font-bold gradient-text mb-2">
                        منصة الأستاذ
                    </h1>
                    <p className="text-text-secondary">نظام إدارة الدروس الخصوصية</p>
                </div>

                {/* Card */}
                <div className="card shadow-xl">
                    {children}
                </div>

                {/* Footer */}
                <p className="text-center text-text-muted text-sm mt-6">
                    © 2026 منصة الأستاذ. جميع الحقوق محفوظة.
                </p>
            </motion.div>
        </div>
    )
}

AuthLayout.propTypes = {
    children: PropTypes.node.isRequired,
}

export default AuthLayout
