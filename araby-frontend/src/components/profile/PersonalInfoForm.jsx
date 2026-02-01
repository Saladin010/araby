import { useState, useEffect } from 'react'
import { Save, X, Lock, Mail, Phone, User, GraduationCap } from 'lucide-react'
import PropTypes from 'prop-types'
import { motion } from 'framer-motion'

/**
 * PersonalInfoForm Component
 * Form for editing user personal information
 */
const PersonalInfoForm = ({ user, onSave, isLoading }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        academicLevel: ''
    })
    const [errors, setErrors] = useState({})
    const [hasChanges, setHasChanges] = useState(false)

    // Initialize form data
    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                email: user.email || '',
                phoneNumber: user.phoneNumber || '',
                academicLevel: user.academicLevel || ''
            })
        }
    }, [user])

    // Check for changes
    useEffect(() => {
        const changed =
            formData.fullName !== (user?.fullName || '') ||
            formData.email !== (user?.email || '') ||
            formData.phoneNumber !== (user?.phoneNumber || '') ||
            formData.academicLevel !== (user?.academicLevel || '')
        setHasChanges(changed)
    }, [formData, user])

    // Validate form
    const validate = () => {
        const newErrors = {}

        // Full name validation
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'الاسم الكامل مطلوب'
        } else if (formData.fullName.trim().length < 3) {
            newErrors.fullName = 'الاسم يجب أن يكون 3 أحرف على الأقل'
        }

        // Email validation
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'البريد الإلكتروني غير صحيح'
        }

        // Phone validation
        if (formData.phoneNumber && !/^01[0-2,5]{1}[0-9]{8}$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = 'رقم الهاتف غير صحيح (يجب أن يبدأ بـ 01 ويتكون من 11 رقم)'
        }

        // Academic level validation (for students)
        if (user?.role === 3 && !formData.academicLevel) {
            newErrors.academicLevel = 'المستوى الدراسي مطلوب للطلاب'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    // Handle submit
    const handleSubmit = (e) => {
        e.preventDefault()
        if (validate()) {
            onSave(formData)
        }
    }

    // Handle cancel
    const handleCancel = () => {
        setFormData({
            fullName: user?.fullName || '',
            email: user?.email || '',
            phoneNumber: user?.phoneNumber || '',
            academicLevel: user?.academicLevel || ''
        })
        setErrors({})
    }

    const isStudent = user?.role === 3

    return (
        <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            {/* Read-Only Fields */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">معلومات غير قابلة للتعديل</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>اسم المستخدم</span>
                                <Lock className="w-3 h-3 text-gray-400" />
                            </div>
                        </label>
                        <div className="px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-600">
                            {user?.userName}
                        </div>
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center gap-2">
                                <GraduationCap className="w-4 h-4" />
                                <span>الدور</span>
                                <Lock className="w-3 h-3 text-gray-400" />
                            </div>
                        </label>
                        <div className="px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg">
                            {user?.role === 1 && <span className="text-purple-600 font-medium">👨‍🏫 مدرس</span>}
                            {user?.role === 2 && <span className="text-blue-600 font-medium">👨‍💼 مساعد</span>}
                            {user?.role === 3 && <span className="text-green-600 font-medium">🎓 طالب</span>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Editable Fields */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">معلومات قابلة للتعديل</h3>

                {/* Full Name */}
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>الاسم الكامل</span>
                            <span className="text-red-500">*</span>
                        </div>
                    </label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${errors.fullName ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="أدخل الاسم الكامل"
                    />
                    {errors.fullName && (
                        <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>البريد الإلكتروني</span>
                        </div>
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="example@email.com"
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                </div>

                {/* Phone Number */}
                <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <span>رقم الهاتف</span>
                        </div>
                    </label>
                    <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="01xxxxxxxxx"
                        maxLength="11"
                    />
                    {errors.phoneNumber && (
                        <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                    )}
                </div>

                {/* Academic Level (Students only) */}
                {isStudent && (
                    <div>
                        <label htmlFor="academicLevel" className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center gap-2">
                                <GraduationCap className="w-4 h-4" />
                                <span>المستوى الدراسي</span>
                                <span className="text-red-500">*</span>
                            </div>
                        </label>
                        <select
                            id="academicLevel"
                            name="academicLevel"
                            value={formData.academicLevel}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${errors.academicLevel ? 'border-red-500' : 'border-gray-300'
                                }`}
                        >
                            <option value="">اختر المستوى الدراسي</option>
                            <option value="الصف الأول الثانوي">الصف الأول الثانوي</option>
                            <option value="الصف الثاني الثانوي">الصف الثاني الثانوي</option>
                            <option value="الصف الثالث الثانوي">الصف الثالث الثانوي</option>
                        </select>
                        {errors.academicLevel && (
                            <p className="mt-1 text-sm text-red-600">{errors.academicLevel}</p>
                        )}
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
                <button
                    type="submit"
                    disabled={!hasChanges || isLoading}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Save className="w-5 h-5" />
                    <span>{isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
                </button>
                <button
                    type="button"
                    onClick={handleCancel}
                    disabled={!hasChanges || isLoading}
                    className="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="flex items-center gap-2">
                        <X className="w-5 h-5" />
                        <span>إلغاء</span>
                    </div>
                </button>
            </div>
        </motion.form>
    )
}

PersonalInfoForm.propTypes = {
    user: PropTypes.object,
    onSave: PropTypes.func.isRequired,
    isLoading: PropTypes.bool
}

export default PersonalInfoForm
