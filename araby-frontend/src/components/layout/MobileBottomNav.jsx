import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    LayoutDashboard,
    Users,
    Calendar,
    ClipboardCheck,
    DollarSign,
    GraduationCap,
    FileText,
} from 'lucide-react'
import PropTypes from 'prop-types'

const MobileBottomNav = ({ role, activeRoute, onNavigate }) => {
    const getNavItems = (role) => {
        const teacherNav = [
            { label: 'الرئيسية', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
            { label: 'الطلاب', path: '/students', icon: <Users size={20} /> },
            { label: 'الحصص', path: '/sessions', icon: <Calendar size={20} /> },
            { label: 'المدفوعات', path: '/payments', icon: <DollarSign size={20} /> },
            { label: 'التقارير', path: '/reports', icon: <FileText size={20} /> },
        ]

        const assistantNav = [
            { label: 'الرئيسية', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
            { label: 'الطلاب', path: '/students', icon: <Users size={20} /> },
            { label: 'الحصص', path: '/sessions', icon: <Calendar size={20} /> },
            { label: 'المدفوعات', path: '/payments', icon: <DollarSign size={20} /> },
            { label: 'الدرجات', path: '/grades', icon: <GraduationCap size={20} /> },
        ]

        const studentNav = [
            { label: 'الرئيسية', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
            { label: 'حصصي', path: '/my-sessions', icon: <Calendar size={20} /> },
            { label: 'حضوري', path: '/my-attendance', icon: <ClipboardCheck size={20} /> },
            { label: 'درجاتي', path: '/my-grades', icon: <GraduationCap size={20} /> },
            { label: 'مدفوعاتي', path: '/my-payments', icon: <DollarSign size={20} /> },
        ]

        switch (role) {
            case 1:
                return teacherNav
            case 2:
                return assistantNav
            case 3:
                return studentNav
            default:
                return []
        }
    }

    const navItems = getNavItems(role)

    return (
        <motion.nav
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="fixed bottom-0 right-0 left-0 bg-surface border-t border-border z-50 md:hidden"
        >
            <div className="flex items-center justify-around h-16 px-2">
                {navItems.map((item, index) => {
                    const isActive = activeRoute === item.path
                    return (
                        <Link
                            key={index}
                            to={item.path}
                            onClick={() => onNavigate(item.path)}
                            className="flex-1 flex flex-col items-center justify-center gap-1 py-2 relative"
                        >
                            {/* Active Indicator */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute top-0 right-0 left-0 h-0.5 bg-primary"
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                            )}

                            {/* Icon */}
                            <span className={isActive ? 'text-primary' : 'text-text-muted'}>
                                {item.icon}
                            </span>

                            {/* Label */}
                            <span
                                className={`text-xs font-medium ${isActive ? 'text-primary' : 'text-text-muted'
                                    }`}
                            >
                                {item.label}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </motion.nav>
    )
}

MobileBottomNav.propTypes = {
    role: PropTypes.number.isRequired,
    activeRoute: PropTypes.string.isRequired,
    onNavigate: PropTypes.func.isRequired,
}

export default MobileBottomNav
