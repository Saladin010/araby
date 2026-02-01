import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { Users, Award, TrendingUp, BookOpen } from 'lucide-react'

const Statistics = () => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-100px' })

    const stats = [
        {
            icon: <Users size={32} />,
            number: 500,
            suffix: '+',
            label: 'طالب',
            color: 'from-primary to-primary-dark',
        },
        {
            icon: <Award size={32} />,
            number: 15,
            suffix: '+',
            label: 'سنة خبرة',
            color: 'from-secondary to-amber-600',
        },
        {
            icon: <TrendingUp size={32} />,
            number: 95,
            suffix: '%',
            label: 'نسبة النجاح',
            color: 'from-accent to-emerald-600',
        },
        {
            icon: <BookOpen size={32} />,
            number: 10000,
            suffix: '+',
            label: 'حصة مكتملة',
            color: 'from-info to-blue-600',
        },
    ]

    return (
        <section
            ref={ref}
            className="py-20 bg-gradient-to-bl from-primary to-primary-dark relative overflow-hidden"
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            <div className="container-custom relative z-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <StatCard {...stat} isInView={isInView} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

const StatCard = ({ icon, number, suffix, label, color, isInView }) => {
    const [count, setCount] = useState(0)

    useEffect(() => {
        if (!isInView) return

        let start = 0
        const end = number
        const duration = 2000
        const increment = end / (duration / 16)

        const timer = setInterval(() => {
            start += increment
            if (start >= end) {
                setCount(end)
                clearInterval(timer)
            } else {
                setCount(Math.floor(start))
            }
        }, 16)

        return () => clearInterval(timer)
    }, [isInView, number])

    return (
        <div className="bg-white/10 backdrop-blur-custom rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-300">
            {/* Icon */}
            <div
                className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg`}
            >
                {icon}
            </div>

            {/* Number */}
            <div className="text-4xl lg:text-5xl font-bold text-white mb-2 arabic-numbers">
                {count.toLocaleString('ar-EG')}
                {suffix}
            </div>

            {/* Label */}
            <div className="text-white/90 font-medium">{label}</div>
        </div>
    )
}

export default Statistics
