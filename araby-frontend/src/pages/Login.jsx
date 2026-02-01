import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { User, Lock, Eye, EyeOff, LogIn } from 'lucide-react'
import { AuthLayout } from '../components/layout'
import { Input, Button } from '../components/common'
import { useAuth } from '../hooks/useAuth'

const Login = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [failedAttempts, setFailedAttempts] = useState(0)
    const [isLocked, setIsLocked] = useState(false)
    const { login, isAuthenticated } = useAuth()
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors },
        setFocus,
        reset,
    } = useForm()

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard')
        }
    }, [isAuthenticated, navigate])

    // Auto-focus username field on mount
    useEffect(() => {
        setFocus('userName')
    }, [setFocus])

    // Handle rate limiting
    useEffect(() => {
        if (failedAttempts >= 5) {
            setIsLocked(true)
            const timer = setTimeout(() => {
                setIsLocked(false)
                setFailedAttempts(0)
            }, 60000) // 1 minute lockout

            return () => clearTimeout(timer)
        }
    }, [failedAttempts])

    const onSubmit = async (data) => {
        if (isLocked) {
            return
        }

        setIsSubmitting(true)

        try {
            await login(data)
            // Success handled in AuthContext
        } catch (error) {
            // Increment failed attempts
            setFailedAttempts((prev) => prev + 1)

            // Clear password field
            reset({ userName: data.userName, password: '' })

            // Focus username field
            setFocus('userName')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <AuthLayout>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-heading font-bold gradient-text mb-2">
                        تسجيل الدخول
                    </h1>
                    <p className="text-text-secondary">
                        مرحباً بك في منصة الأستاذ
                    </p>
                </div>

                {/* Lockout Warning */}
                {isLocked && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm text-center"
                    >
                        تم تجاوز عدد المحاولات المسموح بها. يرجى المحاولة بعد دقيقة واحدة.
                    </motion.div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Username Field */}
                    <div>
                        <Input
                            label="اسم المستخدم"
                            name="userName"
                            type="text"
                            placeholder="أدخل اسم المستخدم"
                            icon={<User size={20} />}
                            iconPosition="right"
                            error={errors.userName?.message}
                            disabled={isLocked}
                            {...register('userName', {
                                required: 'اسم المستخدم مطلوب',
                            })}
                        />
                    </div>

                    {/* Password Field */}
                    <div className="relative">
                        <Input
                            label="كلمة المرور"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="أدخل كلمة المرور"
                            icon={<Lock size={20} />}
                            iconPosition="right"
                            error={errors.password?.message}
                            disabled={isLocked}
                            autoComplete="current-password"
                            {...register('password', {
                                required: 'كلمة المرور مطلوبة',
                                minLength: {
                                    value: 6,
                                    message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
                                },
                            })}
                        />
                        {/* Show/Hide Password Toggle */}
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute left-3 top-[42px] text-text-muted hover:text-text-primary transition-colors"
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {/* Forgot Password Link */}
                    <div className="flex justify-between items-center">
                        <button
                            type="button"
                            className="text-sm text-primary hover:text-primary-dark transition-colors"
                            onClick={() => {
                                // Placeholder for forgot password
                                alert('ميزة استعادة كلمة المرور قيد التطوير')
                            }}
                        >
                            نسيت كلمة المرور؟
                        </button>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                        loading={isSubmitting}
                        disabled={isLocked || isSubmitting}
                        icon={<LogIn size={20} />}
                        iconPosition="left"
                    >
                        {isSubmitting ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                    </Button>
                </form>

                {/* Failed Attempts Warning */}
                {failedAttempts > 0 && failedAttempts < 5 && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-warning text-sm text-center mt-4"
                    >
                        محاولة {failedAttempts} من 5
                    </motion.p>
                )}

                {/* Back to Home Link */}
                <div className="text-center mt-6">
                    <Link
                        to="/"
                        className="text-sm text-text-secondary hover:text-primary transition-colors inline-flex items-center gap-2"
                    >
                        <span>←</span>
                        <span>العودة إلى الصفحة الرئيسية</span>
                    </Link>
                </div>
            </motion.div>
        </AuthLayout>
    )
}

export default Login
