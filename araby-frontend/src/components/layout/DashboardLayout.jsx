import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './Sidebar'
import Breadcrumb from './Breadcrumb'
import { useAuth } from '../../hooks/useAuth'
import { useLocation, useNavigate } from 'react-router-dom'
import { Menu } from 'lucide-react'
import PropTypes from 'prop-types'

const DashboardLayout = ({ children, title, breadcrumbs }) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { user, logout } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()

    const handleNavigate = (path) => {
        navigate(path)
        setMobileMenuOpen(false)
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Sidebar (Desktop & Mobile) */}
            <Sidebar
                role={user?.role || 3}
                activeRoute={location.pathname}
                onNavigate={handleNavigate}
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                user={user}
                onLogout={logout}
                mobileOpen={mobileMenuOpen}
                onMobileClose={() => setMobileMenuOpen(false)}
            />

            {/* Main Content */}
            <main
                className={`
          transition-all duration-300
          md:mr-[280px] ${sidebarCollapsed ? 'md:mr-[80px]' : ''}
        `}
            >
                {/* Header with Breadcrumbs */}
                <div className="bg-surface border-b border-border sticky top-0 z-30">
                    <div className="container-custom py-4 flex items-center gap-4">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="md:hidden p-2 -mr-2 text-text-primary hover:bg-background rounded-lg transition-colors"
                        >
                            <Menu size={24} />
                        </button>

                        <div className="flex-1">
                            {breadcrumbs && <Breadcrumb items={breadcrumbs} />}
                            {title && (
                                <h1 className="text-2xl md:text-3xl font-heading font-bold text-text-primary mt-2">
                                    {title}
                                </h1>
                            )}
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="container-custom py-6"
                >
                    {children}
                </motion.div>
            </main>
        </div>
    )
}

DashboardLayout.propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string,
    breadcrumbs: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            path: PropTypes.string,
        })
    ),
}

export default DashboardLayout
