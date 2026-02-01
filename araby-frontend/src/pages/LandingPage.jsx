import { Link } from 'react-router-dom'
import { BookOpen, Users, Calendar, TrendingUp } from 'lucide-react'
import { Navbar, Footer } from '../components/layout'
import LanguageToggle from '../components/common/LanguageToggle'

const LandingPage = () => {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-bl from-primary to-primary-dark text-white">
                <div className="container-custom section">
                    {/* Language Toggle - Top Right */}
                    <div className="flex justify-end mb-6">
                        <LanguageToggle className="bg-white/10 hover:bg-white/20 text-white" />
                    </div>

                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-5xl md:text-6xl font-heading mb-6 text-shadow-lg">
                            منصة الأستاذ
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-white/90">
                            نظام متكامل لإدارة الدروس الخصوصية والطلاب
                        </p>
                        <div className="flex gap-4 justify-center flex-wrap">
                            <Link to="/login" className="btn btn-secondary btn-lg">
                                تسجيل الدخول
                            </Link>
                            <Link to="#features" className="btn bg-white text-primary hover:bg-gray-100 btn-lg">
                                اعرف المزيد
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="section">
                <div className="container-custom">
                    <h2 className="text-center mb-12 gradient-text">المميزات</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <FeatureCard
                            icon={<BookOpen className="w-12 h-12 text-primary" />}
                            title="إدارة الحصص"
                            description="جدولة وإدارة الحصص الدراسية بسهولة"
                        />
                        <FeatureCard
                            icon={<Users className="w-12 h-12 text-primary" />}
                            title="إدارة الطلاب"
                            description="متابعة بيانات الطلاب وأدائهم"
                        />
                        <FeatureCard
                            icon={<Calendar className="w-12 h-12 text-primary" />}
                            title="تتبع الحضور"
                            description="تسجيل ومتابعة حضور الطلاب"
                        />
                        <FeatureCard
                            icon={<TrendingUp className="w-12 h-12 text-primary" />}
                            title="التقارير والإحصائيات"
                            description="تقارير شاملة عن الأداء والمالية"
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-text-primary text-white py-8">
                <div className="container-custom text-center">
                    <p className="text-white/80">
                        © 2026 منصة الأستاذ. جميع الحقوق محفوظة.
                    </p>
                </div>
            </footer>
        </div>
    )
}

const FeatureCard = ({ icon, title, description }) => {
    return (
        <div className="card card-hover text-center">
            <div className="flex justify-center mb-4">{icon}</div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-text-secondary">{description}</p>
        </div>
    )
}

export default LandingPage
