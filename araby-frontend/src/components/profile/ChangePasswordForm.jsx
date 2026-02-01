import { useState } from 'react'
import { Lock, Eye, EyeOff, Key, Check, X, AlertCircle } from 'lucide-react'
import PropTypes from 'prop-types'
import { motion } from 'framer-motion'

/**
 * ChangePasswordForm Component
 * Form for changing user password with strength indicator
 */
const ChangePasswordForm = ({ onSubmit, isLoading }) => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    })
    const [errors, setErrors] = useState({})

    // Password strength calculation
    const getPasswordStrength = (password) => {
        if (!password) return { level: 0, label: '', color: '' }

        let strength = 0
        if (password.length >= 6) strength++
        if (password.length >= 8) strength++
        if (/[0-9]/.test(password)) strength++
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
        if (/[^A-Za-z0-9]/.test(password)) strength++

        if (strength <= 2) return { level: 1, label: 'ضعيفة', color: 'bg-red-500' }
        if (strength <= 3) return { level: 2, label: 'متوسطة', color: 'bg-yellow-500' }
        return { level: 3, label: 'قوية', color: 'bg-green-500' }
    }

    const strength = getPasswordStrength(formData.newPassword)

    // Password requirements
    const requirements = [
        { test: formData.newPassword.length >= 6, label: '6 أحرف على الأقل' },
        { test: /[0-9]/.test(formData.newPassword), label: 'يحتوي على أرقام' },
        { test: /[a-z]/.test(formData.newPassword) && /[A-Z]/.test(formData.newPassword), label: 'يحتوي على حروف كبيرة وصغيرة' }
    ]

    // Validate form
    const validate = () => {
        const newErrors = {}

        if (!formData.currentPassword) {
            newErrors.currentPassword = 'كلمة المرور الحالية مطلوبة'
        }

        if (!formData.newPassword) {
            newErrors.newPassword = 'كلمة المرور الجديدة مطلوبة'
        } else if (formData.newPassword.length < 6) {
            newErrors.newPassword = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'تأكيد كلمة المرور مطلوب'
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'كلمتا المرور غير متطابقتين'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    // Toggle password visibility
    const togglePassword = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
    }

    // Handle submit
    const handleSubmit = (e) => {
        e.preventDefault()
        if (validate()) {
            onSubmit({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            })
        }
    }

    // Handle clear
    const handleClear = () => {
        setFormData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        })
        setErrors({})
    }

    return (
        <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            {/* Current Password */}
            <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        <span>كلمة المرور الحالية</span>
                        <span className="text-red-500">*</span>
                    </div>
                </label>
                <div className="relative">
                    <input
                        type={showPasswords.current ? 'text' : 'password'}
                        id="currentPassword"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="أدخل كلمة المرور الحالية"
                    />
                    <button
                        type="button"
                        onClick={() => togglePassword('current')}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
                {errors.currentPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
                )}
            </div>

            {/* New Password */}
            <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                        <Key className="w-4 h-4" />
                        <span>كلمة المرور الجديدة</span>
                        <span className="text-red-500">*</span>
                    </div>
                </label>
                <div className="relative">
                    <input
                        type={showPasswords.new ? 'text' : 'password'}
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${errors.newPassword ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="أدخل كلمة المرور الجديدة"
                    />
                    <button
                        type="button"
                        onClick={() => togglePassword('new')}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
                {errors.newPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                )}

                {/* Strength Indicator */}
                {formData.newPassword && (
                    <div className="mt-2">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-600">قوة كلمة المرور:</span>
                            <span className={`text-xs font-medium ${strength.level === 1 ? 'text-red-600' :
                                    strength.level === 2 ? 'text-yellow-600' :
                                        'text-green-600'
                                }`}>
                                {strength.label}
                            </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all ${strength.color}`}
                                style={{ width: `${(strength.level / 3) * 100}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Confirm Password */}
            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                        <Key className="w-4 h-4" />
                        <span>تأكيد كلمة المرور</span>
                        <span className="text-red-500">*</span>
                    </div>
                </label>
                <div className="relative">
                    <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="أعد إدخال كلمة المرور الجديدة"
                    />
                    <button
                        type="button"
                        onClick={() => togglePassword('confirm')}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
                {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
                {formData.confirmPassword && formData.newPassword === formData.confirmPassword && (
                    <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        <span>كلمتا المرور متطابقتان</span>
                    </p>
                )}
            </div>

            {/* Requirements Checklist */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-3">متطلبات كلمة المرور:</h4>
                <div className="space-y-2">
                    {requirements.map((req, index) => (
                        <div key={index} className="flex items-center gap-2">
                            {req.test ? (
                                <Check className="w-4 h-4 text-green-600" />
                            ) : (
                                <X className="w-4 h-4 text-gray-400" />
                            )}
                            <span className={`text-sm ${req.test ? 'text-green-700' : 'text-gray-600'}`}>
                                {req.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Security Note */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-medium text-yellow-900 mb-1">ملاحظة أمنية</h4>
                        <p className="text-sm text-yellow-800">
                            بعد تغيير كلمة المرور، سيتم تسجيل خروجك من جميع الأجهزة الأخرى لحماية حسابك.
                        </p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Lock className="w-5 h-5" />
                    <span>{isLoading ? 'جاري التغيير...' : 'تغيير كلمة المرور'}</span>
                </button>
                <button
                    type="button"
                    onClick={handleClear}
                    disabled={isLoading}
                    className="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    إلغاء
                </button>
            </div>
        </motion.form>
    )
}

ChangePasswordForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    isLoading: PropTypes.bool
}

export default ChangePasswordForm
