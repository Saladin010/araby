import { motion } from 'framer-motion'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { Button } from '../common'

const Hero = () => {
    const scrollToFeatures = () => {
        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-bl from-primary/5 via-background to-secondary/5">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03]">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232386C8' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            {/* Floating Particles */}
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-primary/20 rounded-full"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                    }}
                />
            ))}

            <div className="container-custom py-20 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Content - Left (RTL) */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="order-2 lg:order-1"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
                        >
                            <Sparkles size={16} />
                            <span className="text-sm font-medium">منصة تعليمية متكاملة</span>
                        </motion.div>

                        {/* Main Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-5xl lg:text-7xl font-heading font-bold mb-4 bg-gradient-to-l from-primary to-primary-dark bg-clip-text text-transparent"
                        >
                            الأستاذ
                        </motion.h1>

                        {/* Subheadline */}
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-xl lg:text-2xl text-text-secondary mb-6 font-medium"
                        >
                            رحلتك نحو الإتقان  تبدأ هنا
                        </motion.h2>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="text-lg text-text-secondary mb-8 leading-relaxed"
                        >
                            نظام متكامل لإدارة الدروس الخصوصية يجمع بين الخبرة التعليمية الطويلة
                            والتكنولوجيا الحديثة لضمان أفضل النتائج. انضم إلى مئات الطلاب الذين
                            حققوا التميز.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-wrap gap-4"
                        >
                            <Button
                                variant="primary"
                                size="lg"
                                icon={<ArrowLeft size={20} />}
                                iconPosition="left"
                            >
                                ابدأ رحلتك الآن
                            </Button>
                            <Button variant="outline" size="lg" onClick={scrollToFeatures}>
                                تعرف علينا أكثر
                            </Button>
                        </motion.div>
                    </motion.div>

                    {/* Teacher Image - Right (RTL) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="order-1 lg:order-2 flex justify-center"
                    >
                        <motion.div
                            animate={{
                                y: [0, -20, 0],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                            className="relative"
                        >
                            {/* Gradient Border */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-secondary to-accent blur-2xl opacity-30 animate-pulse" />

                            {/* Image Container */}
                            <div className="relative w-64 h-64 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-surface shadow-2xl">
                                {/* Placeholder Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                                            <span className="text-6xl text-white font-heading">غ</span>
                                        </div>
                                        <p className="text-text-primary font-heading text-xl">
                                            الأستاذ
                                        </p>
                                    </div>
                                </div>

                                {/* Geometric Pattern Overlay */}
                                <div
                                    className="absolute inset-0 opacity-10"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
                                    }}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default Hero
