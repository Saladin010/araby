import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Avatar, Dropdown } from '../common'
import PropTypes from 'prop-types'

const Navbar = ({ user, onLogout }) => {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const dropdownItems = [
        {
            label: 'الملف الشخصي',
            onClick: () => console.log('Profile'),
        },
        {
            label: 'الإعدادات',
            onClick: () => console.log('Settings'),
        },
        { divider: true },
        {
            label: 'تسجيل الخروج',
            onClick: onLogout,
            danger: true,
        },
    ]

    const navLinks = [
        { label: 'الرئيسية', path: '/', type: 'link' },
        { label: 'المميزات', path: '#features', type: 'scroll' },
        { label: 'كيف يعمل', path: '#how-it-works', type: 'scroll' },
        // { label: 'آراء الطلاب', path: '#testimonials', type: 'scroll' },
    ]

    const handleNavClick = (e, link) => {
        if (link.type === 'scroll') {
            e.preventDefault()
            const elementId = link.path.replace('#', '')
            const element = document.getElementById(elementId)
            if (element) {
                const offset = 80 // Navbar height
                const elementPosition = element.getBoundingClientRect().top
                const offsetPosition = elementPosition + window.pageYOffset - offset

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth',
                })
            }
            setIsMobileMenuOpen(false)
        }
    }

    return (
        <motion.nav
            className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-surface/80 backdrop-blur-custom shadow-md'
                : 'bg-transparent'
                }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="container-custom">
                <div className="flex items-center justify-between h-16">
                    {/* Logo/Brand - Right side (RTL) */}
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-xl font-heading font-bold gradient-text"
                    >
                        <span>Mr. Ahmed Amr</span>
                    </Link>

                    {/* Desktop Navigation - Center */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((link, index) =>
                            link.type === 'scroll' ? (
                                <a
                                    key={index}
                                    href={link.path}
                                    onClick={(e) => handleNavClick(e, link)}
                                    className="text-text-primary hover:text-primary transition-colors font-medium cursor-pointer"
                                >
                                    {link.label}
                                </a>
                            ) : (
                                <Link
                                    key={index}
                                    to={link.path}
                                    className="text-text-primary hover:text-primary transition-colors font-medium"
                                >
                                    {link.label}
                                </Link>
                            )
                        )}
                    </div>

                    {/* User Section - Left side (RTL) */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <Dropdown
                                trigger={
                                    <div className="flex items-center gap-2 cursor-pointer">
                                        <Avatar name={user.name} size="sm" status="online" />
                                        <span className="hidden md:block text-sm font-medium">
                                            {user.name}
                                        </span>
                                    </div>
                                }
                                items={dropdownItems}
                            />
                        ) : (
                            <Link to="/login" className="btn btn-primary btn-sm">
                                تسجيل الدخول
                            </Link>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-background transition-colors"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden py-4 border-t border-border"
                    >
                        <div className="flex flex-col gap-3">
                            {navLinks.map((link, index) =>
                                link.type === 'scroll' ? (
                                    <a
                                        key={index}
                                        href={link.path}
                                        onClick={(e) => handleNavClick(e, link)}
                                        className="text-text-primary hover:text-primary transition-colors font-medium py-2 cursor-pointer"
                                    >
                                        {link.label}
                                    </a>
                                ) : (
                                    <Link
                                        key={index}
                                        to={link.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-text-primary hover:text-primary transition-colors font-medium py-2"
                                    >
                                        {link.label}
                                    </Link>
                                )
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.nav>
    )
}

Navbar.propTypes = {
    user: PropTypes.shape({
        name: PropTypes.string,
        avatar: PropTypes.string,
    }),
    onLogout: PropTypes.func,
}

export default Navbar
