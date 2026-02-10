import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
    LayoutDashboard,
    Users,
    Calendar,
    ClipboardCheck,
    DollarSign,
    GraduationCap,
    UsersRound,
    FileText,
    ChevronRight,
    ChevronLeft,
    LogOut,
    User,
    X,
    QrCode,
} from 'lucide-react'
import { Avatar } from '../common'
import LanguageToggle from '../common/LanguageToggle'
import PropTypes from 'prop-types'
import { useEffect } from 'react'

const Sidebar = ({ role, activeRoute, onNavigate, collapsed, onToggle, user, onLogout, mobileOpen, onMobileClose }) => {
    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [mobileOpen])

    const getMenuItems = (role) => {
        const teacherMenu = [
            { label: 'لوحة التحكم', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
            { label: 'الطلاب', path: '/students', icon: <Users size={20} /> },
            { label: 'الحصص', path: '/sessions', icon: <Calendar size={20} /> },
            { label: 'الحضور', path: '/attendance', icon: <ClipboardCheck size={20} /> },
            { label: 'مسح الحضور', path: '/qr-scanner', icon: <QrCode size={20} /> },
            { label: 'المدفوعات', path: '/payments', icon: <DollarSign size={20} /> },
            { label: 'أنواع المصروفات', path: '/fee-types', icon: <DollarSign size={20} /> },
            { label: 'الدرجات', path: '/grades', icon: <GraduationCap size={20} /> },
            { label: 'المجموعات', path: '/groups', icon: <UsersRound size={20} /> },
            { label: 'التقارير', path: '/reports', icon: <FileText size={20} /> },
            { label: 'الملف الشخصي', path: '/profile', icon: <User size={20} /> },
        ]

        const assistantMenu = [
            { label: 'لوحة التحكم', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
            { label: 'الطلاب', path: '/students', icon: <Users size={20} /> },
            { label: 'الحصص', path: '/sessions', icon: <Calendar size={20} /> },
            { label: 'الحضور', path: '/attendance', icon: <ClipboardCheck size={20} /> },
            { label: 'مسح الحضور', path: '/qr-scanner', icon: <QrCode size={20} /> },
            { label: 'المدفوعات', path: '/payments', icon: <DollarSign size={20} /> },
            { label: 'الدرجات', path: '/grades', icon: <GraduationCap size={20} /> },
            { label: 'المجموعات', path: '/groups', icon: <UsersRound size={20} /> },
            { label: 'الملف الشخصي', path: '/profile', icon: <User size={20} /> },
        ]

        const studentMenu = [
            { label: 'لوحة التحكم', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
            { label: 'رمز الحضور', path: '/my-qr-code', icon: <QrCode size={20} /> },
            { label: 'حصصي', path: '/student/sessions', icon: <Calendar size={20} /> },
            { label: 'درجاتي', path: '/student/grades', icon: <GraduationCap size={20} /> },
            { label: 'مدفوعاتي', path: '/student/payments', icon: <DollarSign size={20} /> },
            { label: 'الملف الشخصي', path: '/profile', icon: <User size={20} /> },
        ]

        switch (role) {
            case 1: // Teacher
                return teacherMenu
            case 2: // Assistant
                return assistantMenu
            case 3: // Student
                return studentMenu
            default:
                return []
        }
    }

    const menuItems = getMenuItems(role)

    // Configuration for animations
    const config = {
        desktop: {
            width: collapsed ? '80px' : '280px',
            x: 0,
        },
        mobile: {
            width: '280px',
            x: mobileOpen ? 0 : '100%', // Hidden off-screen right
        }
    }

    // Checking if we are on mobile (less than md breakpoint)
    // Note: JS media query check would be better, but for now relying on CSS classes + Prop logic
    // The issue is Framer Motion needs values. 
    // We will use a CSS-first approach for the base position and Framer Motion for the states.

    return (
        <>
            {/* Mobile Backdrop */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onMobileClose}
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    />
                )}
            </AnimatePresence>

            <motion.aside
                initial={false}
                animate={{
                    width: window.innerWidth >= 768 ? (collapsed ? '80px' : '280px') : '280px',
                    x: window.innerWidth >= 768 ? 0 : (mobileOpen ? 0 : '100%'),
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={`
                    fixed right-0 top-0 h-screen bg-surface border-l border-border z-50 flex flex-col shadow-xl
                    md:shadow-none
                `}
            >
                {/* Logo & Toggle */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-border">
                    {/* Show title if not collapsed OR if on mobile */}
                    {(!collapsed || typeof window !== 'undefined' && window.innerWidth < 768) && (
                        <h2 className="text-lg font-heading font-bold gradient-text">
                            Mr. Ahmed Amr
                        </h2>
                    )}

                    {/* Desktop Toggle Button */}
                    <button
                        onClick={onToggle}
                        className="hidden md:flex p-2 rounded-lg hover:bg-background transition-colors"
                    >
                        {collapsed ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                    </button>

                    {/* Mobile Close Button */}
                    <button
                        onClick={onMobileClose}
                        className="md:hidden p-2 rounded-lg hover:bg-background transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-1 px-2">
                        {menuItems.map((item, index) => {
                            const isActive = activeRoute === item.path

                            // Check for collapsed mode (Desktop Only)
                            // We can approximate this by checking if width is 80px or collapsed prop is true AND we are desktop
                            const isDesktopCollapsed = collapsed && window.innerWidth >= 768

                            return (
                                <li key={index}>
                                    <Link
                                        to={item.path}
                                        onClick={() => onNavigate(item.path)}
                                        className={`
                                            flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                                            ${isActive
                                                ? 'bg-primary text-white shadow-md'
                                                : 'text-text-primary hover:bg-background'
                                            }
                                            ${isDesktopCollapsed ? 'justify-center' : ''}
                                        `}
                                    >
                                        <span className={isActive ? 'text-white' : 'text-primary'}>
                                            {item.icon}
                                        </span>
                                        {!isDesktopCollapsed && (
                                            <span className="font-medium">{item.label}</span>
                                        )}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav>

                {/* User Info & Logout */}
                <div className="border-t border-border p-4">
                    {(!collapsed || (typeof window !== 'undefined' && window.innerWidth < 768)) ? (
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Avatar name={user?.name} size="sm" status="online" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{user?.name}</p>
                                    <p className="text-xs text-text-muted">
                                        {role === 1 ? 'معلم' : role === 2 ? 'مساعد' : 'طالب'}
                                    </p>
                                </div>
                            </div>
                            <LanguageToggle className="w-full justify-center" />
                            <button
                                onClick={onLogout}
                                className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-error hover:bg-error/10 transition-colors"
                            >
                                <LogOut size={18} />
                                <span className="text-sm font-medium">تسجيل الخروج</span>
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={onLogout}
                            className="w-full p-2 rounded-lg text-error hover:bg-error/10 transition-colors flex justify-center"
                        >
                            <LogOut size={20} />
                        </button>
                    )}
                </div>
            </motion.aside>
        </>
    )
}

Sidebar.propTypes = {
    role: PropTypes.number.isRequired,
    activeRoute: PropTypes.string.isRequired,
    onNavigate: PropTypes.func.isRequired,
    collapsed: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    user: PropTypes.object,
    onLogout: PropTypes.func.isRequired,
    mobileOpen: PropTypes.bool,
    onMobileClose: PropTypes.func
}

export default Sidebar
