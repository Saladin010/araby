import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useForm } from 'react-hook-form'
import { LogIn, Eye, EyeOff } from 'lucide-react'

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const onSubmit = async (data) => {
        setIsLoading(true)
        try {
            await login(data)
        } catch (error) {
            console.error('Login error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-bl from-primary/10 to-background p-4">
            <div className="card max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-heading font-bold gradient-text mb-2">
                        الأستاذ
                    </h1>
                    <p className="text-text-secondary">تسجيل الدخول إلى النظام</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Username */}
                    <div>
                        <label htmlFor="userName" className="label">
                            اسم المستخدم
                        </label>
                        <input
                            id="userName"
                            type="text"
                            className={`input ${errors.userName ? 'input-error' : ''}`}
                            placeholder="أدخل اسم المستخدم"
                            {...register('userName', {
                                required: 'اسم المستخدم مطلوب',
                            })}
                        />
                        {errors.userName && (
                            <p className="text-error text-sm mt-1">{errors.userName.message}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="label">
                            كلمة المرور
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                className={`input ${errors.password ? 'input-error' : ''}`}
                                placeholder="أدخل كلمة المرور"
                                {...register('password', {
                                    required: 'كلمة المرور مطلوبة',
                                })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-error text-sm mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-primary w-full"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <span className="spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                                جاري تسجيل الدخول...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <LogIn size={20} />
                                تسجيل الدخول
                            </span>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate('/')}
                        className="text-primary hover:text-primary-dark text-sm"
                    >
                        العودة إلى الصفحة الرئيسية
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
