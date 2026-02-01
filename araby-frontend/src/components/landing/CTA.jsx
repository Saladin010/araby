import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { Button } from '../common'
import { useNavigate } from 'react-router-dom'

const CTA = () => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-100px' })
    const navigate = useNavigate()

    return (
        <section
            ref={ref}
            className="section bg-gradient-to-bl from-primary via-primary-dark to-secondary relative overflow-hidden"
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            {/* Floating Particles */}
            {[...Array(8)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-3 h-3 bg-white/30 rounded-full"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [0, -40, 0],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 4 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                    }}
                />
            ))}

            <div className="container-custom relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center max-w-3xl mx-auto"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white mb-6"
                    >
                        <Sparkles size={16} />
                        <span className="text-sm font-medium">ابدأ الآن مجاناً</span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.3 }}
                        className="text-4xl lg:text-5xl font-heading font-bold text-white mb-6"
                    >
                        هل أنت مستعد لتحسين مستواك؟
                    </motion.h2>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.4 }}
                        className="text-xl text-white/90 mb-8 leading-relaxed"
                    >
                        انضم إلى مئات الطلاب الذين حققوا التميز والنجاح. ابدأ رحلتك التعليمية
                        اليوم!
                    </motion.p>

                    {/* CTA Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.5 }}
                    >
                        <motion.div
                            animate={{
                                scale: [1, 1.05, 1],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        >
                            <Button
                                variant="secondary"
                                size="lg"
                                icon={<ArrowLeft size={24} />}
                                iconPosition="left"
                                onClick={() => navigate('/login')}
                                className="text-lg px-12 py-6 shadow-2xl"
                            >
                                سجل الآن
                            </Button>
                        </motion.div>
                    </motion.div>

                    {/* Trust Badge */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ delay: 0.6 }}
                        className="text-white/70 text-sm mt-6"
                    >
                        ✓ لا حاجة لبطاقة ائتمان • ✓ إلغاء في أي وقت • ✓ دعم فني متواصل
                    </motion.p>
                </motion.div>
            </div>
        </section>
    )
}

export default CTA
