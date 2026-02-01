import { X, Eye, EyeOff, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'

/**
 * AddEditStudentModal Component
 */
const AddEditStudentModal = ({ isOpen, onClose, onSubmit, student, loading }) => {
    const [showPassword, setShowPassword] = useState(false)
    const [selectedRole, setSelectedRole] = useState('Student')
    const isEdit = !!student

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm({
        defaultValues: {
            userName: '',
            password: '',
            fullName: '',
            phoneNumber: '',
            academicLevel: '',
            role: 'Student',
        },
    })

    // Update form values when student prop changes
    useEffect(() => {
        if (student) {
            setValue('userName', student.userName || '')
            setValue('fullName', student.fullName || '')
            setValue('phoneNumber', student.phoneNumber || '')
            setValue('academicLevel', student.academicLevel || '')
            // Determine role from student data
            const role = student.role === 2 ? 'Assistant' : 'Student'
            setSelectedRole(role)
            setValue('role', role)
        } else {
            reset({
                userName: '',
                password: '',
                fullName: '',
                phoneNumber: '',
                academicLevel: '',
                role: 'Student',
            })
            setSelectedRole('Student')
        }
    }, [student, setValue, reset])

    const generatePassword = () => {
        // Generate password that meets backend requirements:
        // - At least 8 characters
        // - Contains uppercase letter
        // - Contains lowercase letter
        // - Contains digit
        // - Contains special character
        const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
        const lowercase = 'abcdefghjkmnpqrstuvwxyz'
        const digits = '23456789'
        const special = '@!#$%&*'

        // Ensure at least one of each required type
        let password = ''
        password += uppercase.charAt(Math.floor(Math.random() * uppercase.length))
        password += lowercase.charAt(Math.floor(Math.random() * lowercase.length))
        password += digits.charAt(Math.floor(Math.random() * digits.length))
        password += special.charAt(Math.floor(Math.random() * special.length))

        // Fill the rest randomly (total 8-10 characters)
        const allChars = uppercase + lowercase + digits + special
        const remainingLength = 4 + Math.floor(Math.random() * 3) // 4-6 more chars
        for (let i = 0; i < remainingLength; i++) {
            password += allChars.charAt(Math.floor(Math.random() * allChars.length))
        }

        // Shuffle the password
        password = password.split('').sort(() => Math.random() - 0.5).join('')

        setValue('password', password)
    }

    const onFormSubmit = (data) => {
        // Add role to submission data
        const submissionData = { ...data, role: selectedRole }
        onSubmit(submissionData)
        reset()
        setSelectedRole('Student')
    }

    const handleClose = () => {
        reset()
        onClose()
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/50 z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-surface rounded-xl shadow-xl max-w-2xl w-full p-6 my-8"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-text-primary">
                                    {isEdit ? 'تعديل بيانات المستخدم' : 'إضافة مستخدم جديد'}
                                </h3>
                                <button
                                    onClick={handleClose}
                                    className="p-2 hover:bg-background rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
                                {/* Role Selection - Only for new users */}
                                {!isEdit && (
                                    <div>
                                        <label className="label">
                                            نوع المستخدم <span className="text-error">*</span>
                                        </label>
                                        <select
                                            value={selectedRole}
                                            onChange={(e) => {
                                                setSelectedRole(e.target.value)
                                                setValue('role', e.target.value)
                                                // Clear academicLevel if switching to Assistant
                                                if (e.target.value === 'Assistant') {
                                                    setValue('academicLevel', '')
                                                }
                                            }}
                                            className="input"
                                        >
                                            <option value="Student">طالب</option>
                                            <option value="Assistant">مساعد</option>
                                        </select>
                                    </div>
                                )}

                                {/* Username */}
                                <div>
                                    <label className="label">
                                        اسم المستخدم <span className="text-error">*</span>
                                    </label>
                                    <input
                                        {...register('userName', {
                                            required: 'اسم المستخدم مطلوب',
                                            minLength: { value: 3, message: 'يجب أن يكون 3 أحرف على الأقل' },
                                        })}
                                        className={`input ${errors.userName ? 'input-error' : ''}`}
                                        placeholder="أدخل اسم المستخدم"
                                    />
                                    {errors.userName && (
                                        <p className="text-error text-sm mt-1">{errors.userName.message}</p>
                                    )}
                                </div>

                                {/* Password */}
                                {!isEdit && (
                                    <div>
                                        <label className="label">
                                            كلمة المرور <span className="text-error">*</span>
                                        </label>
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <input
                                                    {...register('password', {
                                                        required: 'كلمة المرور مطلوبة',
                                                        minLength: {
                                                            value: 8,
                                                            message: 'يجب أن تكون 8 أحرف على الأقل'
                                                        },
                                                        pattern: {
                                                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                                                            message: 'يجب أن تحتوي على حرف كبير وصغير ورقم وحرف خاص (!@#$%^&*)'
                                                        }
                                                    })}
                                                    type={showPassword ? 'text' : 'password'}
                                                    className={`input pr-10 ${errors.password ? 'input-error' : ''}`}
                                                    placeholder="مثال: Student@123"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                                                >
                                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={generatePassword}
                                                className="btn btn-outline px-4"
                                                title="توليد كلمة مرور عشوائية"
                                            >
                                                <RefreshCw className="w-4 h-4" />
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className="text-error text-sm mt-1">{errors.password.message}</p>
                                        )}
                                        <p className="text-text-muted text-xs mt-1">
                                            يجب أن تحتوي على 8 أحرف على الأقل، حرف كبير، حرف صغير، رقم، وحرف خاص
                                        </p>
                                    </div>
                                )}

                                {/* Full Name */}
                                <div>
                                    <label className="label">
                                        الاسم الكامل <span className="text-error">*</span>
                                    </label>
                                    <input
                                        {...register('fullName', { required: 'الاسم الكامل مطلوب' })}
                                        className={`input ${errors.fullName ? 'input-error' : ''}`}
                                        placeholder="أدخل الاسم الكامل"
                                    />
                                    {errors.fullName && (
                                        <p className="text-error text-sm mt-1">{errors.fullName.message}</p>
                                    )}
                                </div>

                                {/* Phone Number */}
                                <div>
                                    <label className="label">رقم الهاتف</label>
                                    <input
                                        {...register('phoneNumber')}
                                        className="input"
                                        placeholder="01xxxxxxxxx"
                                    />
                                </div>

                                {/* Academic Level - Only for Students */}
                                {selectedRole === 'Student' && (
                                    <div>
                                        <label className="label">
                                            المستوى الدراسي <span className="text-error">*</span>
                                        </label>
                                        <select
                                            {...register('academicLevel', {
                                                required: selectedRole === 'Student' ? 'المستوى الدراسي مطلوب' : false
                                            })}
                                            className={`input ${errors.academicLevel ? 'input-error' : ''}`}
                                        >
                                            <option value="">اختر المستوى الدراسي</option>
                                            <option value="الصف الأول الثانوي">الصف الأول الثانوي</option>
                                            <option value="الصف الثاني الثانوي">الصف الثاني الثانوي</option>
                                            <option value="الصف الثالث الثانوي">الصف الثالث الثانوي</option>
                                        </select>
                                        {errors.academicLevel && (
                                            <p className="text-error text-sm mt-1">{errors.academicLevel.message}</p>
                                        )}
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        disabled={loading}
                                        className="btn btn-outline flex-1"
                                    >
                                        إلغاء
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn btn-primary flex-1"
                                    >
                                        {loading ? 'جاري الحفظ...' : isEdit ? 'حفظ التعديلات' : `إضافة ${selectedRole === 'Student' ? 'الطالب' : 'المساعد'}`}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    )
}

export default AddEditStudentModal
