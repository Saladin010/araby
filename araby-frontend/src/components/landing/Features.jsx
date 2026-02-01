import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import {
    BookOpen,
    GraduationCap,
    TrendingUp,
    DollarSign,
    Target,
    Smartphone,
} from 'lucide-react'
import { Card } from '../common'

const Features = () => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-100px' })

    const features = [
        {
            icon: <BookOpen size={28} />,
            title: 'منهج شامل ومتكامل',
            description:
                'برنامج تعليمي متكامل يغطي جميع الجوانب التعليمية',
            color: 'from-primary to-primary-dark',
        },
        {
            icon: <GraduationCap size={28} />,
            title: 'خبرة تعليمية طويلة',
            description:
                'أكثر من 15 عاماً من الخبرة في التدريس لمختلف المراحل الدراسية',
            color: 'from-secondary to-amber-600',
        },
        {
            icon: <TrendingUp size={28} />,
            title: 'متابعة دقيقة للأداء',
            description:
                'نظام متطور لتتبع تقدم الطلاب وتقديم تقارير تفصيلية عن الأداء والتحصيل الدراسي',
            color: 'from-accent to-emerald-600',
        },
        {
            icon: <DollarSign size={28} />,
            title: 'أسعار تنافسية',
            description:
                'باقات متنوعة تناسب جميع الميزانيات مع إمكانية الدفع الشهري أو الفصلي',
            color: 'from-warning to-orange-600',
        },
        {
            icon: <Target size={28} />,
            title: 'نتائج مضمونة',
            description:
                'نسبة نجاح تتجاوز 95% مع ضمان تحسين ملحوظ في مستوى الطالب خلال فترة قصيرة',
            color: 'from-info to-blue-600',
        },
        {
            icon: <Smartphone size={28} />,
            title: 'نظام إدارة متطور',
            description:
                'منصة إلكترونية سهلة الاستخدام لحجز الحصص ومتابعة الجداول والتواصل مع المعلم',
            color: 'from-purple-500 to-purple-700',
        },
    ]

    return (
        <section id="features" ref={ref} className="section bg-background">
            <div className="container-custom">
                {/* Section Title */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl lg:text-5xl font-heading font-bold gradient-text mb-4">
                        ؟ لماذا تختار منصةالأستاذ
                    </h2>
                    <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                        نقدم لك تجربة تعليمية فريدة تجمع بين الجودة والاحترافية
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <FeatureCard {...feature} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

const FeatureCard = ({ icon, title, description, color }) => {
    return (
        <Card
            hover
            glass
            className="h-full group cursor-pointer"
        >
            {/* Icon */}
            <div
                className={`w-16 h-16 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
            >
                {icon}
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-text-primary mb-3">{title}</h3>

            {/* Description */}
            <p className="text-text-secondary leading-relaxed">{description}</p>
        </Card>
    )
}

export default Features
