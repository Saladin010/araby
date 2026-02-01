import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
    const aboutLinks = [
        { label: 'من نحن', path: '/about' },
        // { label: 'رؤيتنا', path: '/vision' },
        // { label: 'فريق العمل', path: '/team' },
    ]

    const quickLinks = [
        { label: 'الرئيسية', path: '/' },
        { label: 'المميزات', path: '/#features' },
        // { label: 'الأسعار', path: '/pricing' },
        // { label: 'تواصل معنا', path: '/contact' },
    ]

    const contactInfo = [
        { icon: <Phone size={18} />, text: '+201104136883' },
        { icon: <Mail size={18} />, text: 'salaheldin.dev@gmail.com' },
        { icon: <MapPin size={18} />, text: 'الشرقية, مصر' },
    ]

    // const socialLinks = [
    //     { icon: <Facebook size={20} />, url: '#', label: 'Facebook' },
    //     { icon: <Twitter size={20} />, url: '#', label: 'Twitter' },
    //     { icon: <Instagram size={20} />, url: '#', label: 'Instagram' },
    // ]

    return (
        <footer className="bg-gradient-to-bl from-text-primary to-text-primary/90 text-white">
            <div className="container-custom py-12">
                {/* Main Footer Content */}
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                    {/* About Section */}
                    <div>
                        <h3 className="text-xl font-heading font-bold mb-4">معلومات عنا</h3>
                        <p className="text-white/80 mb-4 leading-relaxed">
                            نظام متكامل لإدارة الدروس الخصوصية يساعد المعلمين على تنظيم حصصهم
                            ومتابعة طلابهم بكفاءة عالية.
                        </p>
                        <ul className="space-y-2">
                            {aboutLinks.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        to={link.path}
                                        className="text-white/80 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-heading font-bold mb-4">روابط سريعة</h3>
                        <ul className="space-y-2">
                            {quickLinks.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        to={link.path}
                                        className="text-white/80 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-xl font-heading font-bold mb-4">تواصل معنا</h3>
                        <ul className="space-y-3 mb-6">
                            {contactInfo.map((item, index) => (
                                <li key={index} className="flex items-center gap-3 text-white/80">
                                    {item.icon}
                                    <span>{item.text}</span>
                                </li>
                            ))}
                        </ul>

                        {/* Social Media */}
                        {/* <div className="flex gap-3">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                                    aria-label={social.label}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div> */}
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-6 text-center">
                    <p className="text-white/70">
                        © 2026 الأستاذ . جميع الحقوق محفوظة.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
