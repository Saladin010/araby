import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import { Avatar, Card } from '../common'

const Testimonials = () => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-100px' })
    const [currentIndex, setCurrentIndex] = useState(0)

    const testimonials = [
        {
            name: 'أحمد محمد',
            grade: 'الصف الثالث الثانوي',
            text: 'تحسن مستواي في منصة الأستاذ بشكل ملحوظ. الشرح واضح والمتابعة مستمرة. أنصح الجميع بالانضمام.',
            rating: 5,
        },
        {
            name: 'فاطمة أحمد',
            grade: 'الصف الأول الثانوي',
            text: 'منصة رائعة وسهلة الاستخدام. الأستاذ متمكن جداً ويشرح بطريقة مبسطة. حصلت على درجات ممتازة في الامتحانات.',
            rating: 5,
        },
        {
            name: 'محمود حسن',
            grade: 'الصف الثاني الإعدادي',
            text: 'أفضل معلم لغة عربية. يهتم بكل طالب ويتابع تقدمه باستمرار. النظام الإلكتروني يسهل حجز الحصص والمتابعة.',
            rating: 5,
        },
        {
            name: 'سارة علي',
            grade: 'الصف الثالث الإعدادي',
            text: 'تجربة تعليمية مميزة. الدروس منظمة والمحتوى شامل. أصبحت أحب منصة الأستاذ بفضل طريقة الشرح الرائعة.',
            rating: 5,
        },
    ]

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    }

    return (
        <section ref={ref} className="section bg-background">
            <div className="container-custom">
                {/* Section Title */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl lg:text-5xl font-heading font-bold gradient-text mb-4">
                        ماذا يقول طلابنا؟
                    </h2>
                    <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                        آراء حقيقية من طلابنا المتميزين
                    </p>
                </motion.div>

                {/* Carousel */}
                <div className="relative max-w-5xl mx-auto">
                    {/* Testimonials */}
                    <div className="overflow-hidden">
                        <motion.div
                            className="flex"
                            animate={{ x: `${-currentIndex * 100}%` }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        >
                            {testimonials.map((testimonial, index) => (
                                <div key={index} className="w-full flex-shrink-0 px-4">
                                    <TestimonialCard {...testimonial} />
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Navigation Arrows */}
                    <button
                        onClick={prevSlide}
                        className="absolute top-1/2 -translate-y-1/2 right-0 -mr-4 lg:-mr-12 w-12 h-12 rounded-full bg-surface shadow-lg border border-border hover:bg-primary hover:text-white transition-all flex items-center justify-center"
                        aria-label="السابق"
                    >
                        <ChevronRight size={24} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute top-1/2 -translate-y-1/2 left-0 -ml-4 lg:-ml-12 w-12 h-12 rounded-full bg-surface shadow-lg border border-border hover:bg-primary hover:text-white transition-all flex items-center justify-center"
                        aria-label="التالي"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    {/* Dots Indicator */}
                    <div className="flex justify-center gap-2 mt-8">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-3 h-3 rounded-full transition-all ${index === currentIndex
                                    ? 'bg-primary w-8'
                                    : 'bg-border hover:bg-text-muted'
                                    }`}
                                aria-label={`الشهادة ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

const TestimonialCard = ({ name, grade, text, rating }) => {
    return (
        <Card className="relative">
            {/* Quote Icon Background */}
            <div className="absolute top-6 left-6 text-primary/10">
                <Quote size={80} />
            </div>

            <div className="relative z-10">
                {/* Avatar & Info */}
                <div className="flex items-center gap-4 mb-6">
                    <Avatar name={name} size="lg" />
                    <div>
                        <h4 className="text-lg font-bold text-text-primary">{name}</h4>
                        <p className="text-text-secondary">{grade}</p>
                    </div>
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                    {[...Array(rating)].map((_, i) => (
                        <Star key={i} size={20} className="fill-warning text-warning" />
                    ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-text-primary text-lg leading-relaxed">{text}</p>
            </div>
        </Card>
    )
}

export default Testimonials
