import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { UserPlus, Calendar, Video, BarChart3 } from 'lucide-react'

const HowItWorks = () => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-100px' })

    const steps = [
        {
            number: 1,
            icon: <UserPlus size={32} />,
            title: 'التسجيل في النظام',
            description:
                'قم بإنشاء حساب جديد في دقائق معدودة وابدأ رحلتك التعليمية معنا',
        },
        {
            number: 2,
            icon: <Calendar size={32} />,
            title: 'حجز الحصص',
            description:
                'اختر المواعيد المناسبة لك من خلال نظام الحجز الإلكتروني السهل',
        },
        {
            number: 3,
            icon: <Video size={32} />,
            title: 'حضور الدروس',
            description:
                'احضر الحصص في الوقت المحدد واستفد من الشرح التفصيلي والتفاعلي',
        },
        {
            number: 4,
            icon: <BarChart3 size={32} />,
            title: 'متابعة التقدم',
            description:
                'راقب تطورك من خلال التقارير الدورية والاختبارات التقييمية',
        },
    ]

    return (
        <section ref={ref} className="section bg-gradient-to-br from-background to-primary/5">
            <div className="container-custom">
                {/* Section Title */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl lg:text-5xl font-heading font-bold gradient-text mb-4">
                        كيف يعمل النظام؟
                    </h2>
                    <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                        أربع خطوات بسيطة للبدء في رحلتك التعليمية
                    </p>
                </motion.div>

                {/* Steps - Desktop Timeline */}
                <div className="hidden lg:block relative">
                    {/* Connecting Line */}
                    <div className="absolute top-24 right-0 left-0 h-1 bg-gradient-to-l from-primary via-secondary to-accent" />

                    <div className="grid grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                            >
                                <StepCard {...step} />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Steps - Mobile Vertical */}
                <div className="lg:hidden space-y-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -50 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            className="relative"
                        >
                            {/* Connecting Line */}
                            {index < steps.length - 1 && (
                                <div className="absolute top-24 right-8 w-1 h-full bg-gradient-to-b from-primary to-secondary" />
                            )}
                            <StepCard {...step} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

const StepCard = ({ number, icon, title, description }) => {
    return (
        <div className="relative">
            {/* Number Badge */}
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-2xl font-bold shadow-lg relative z-10">
                {number}
            </div>

            {/* Card */}
            <div className="bg-surface rounded-2xl p-6 shadow-card border border-border hover:shadow-soft transition-all duration-300">
                {/* Icon */}
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-text-primary mb-3 text-center">
                    {title}
                </h3>

                {/* Description */}
                <p className="text-text-secondary text-center leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
    )
}

export default HowItWorks
