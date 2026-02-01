import { X, Key, Check, Loader2, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useResetPassword, useStudentCredentials } from '../../hooks/useStudents'

/**
 * ResetPasswordModal Component
 */
const ShowPasswordModal = ({ isOpen, onClose, student }) => {
    const [newPassword, setNewPassword] = useState('')
    const { mutate: resetPassword, isPending } = useResetPassword()
    const { data: credentials, refetch: fetchCredentials, isFetching: isFetchingCredentials } = useStudentCredentials(student?.id)
    const [success, setSuccess] = useState(false)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (isOpen && student?.id) {
            fetchCredentials()
        }
    }, [isOpen, student, fetchCredentials])

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleReset = (e) => {
        e.preventDefault()
        if (!newPassword || newPassword.length < 6) return

        resetPassword(
            { id: student.id, newPassword },
            {
                onSuccess: () => {
                    setSuccess(true)
                    setNewPassword('')
                    fetchCredentials() // Refresh credentials to show new password
                    setTimeout(() => {
                        setSuccess(false)
                        // onClose() // Keep open to let user copy
                    }, 2000)
                }
            }
        )
    }

    const generatePassword = () => {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&'
        let pass = ''
        for (let i = 0; i < 8; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        setNewPassword(pass)
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
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-surface rounded-xl shadow-xl max-w-md w-full p-6"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-text-primary">تغيير كلمة المرور</h3>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-background rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Warning */}
                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
                                <p className="text-sm text-blue-800">
                                    لأسباب أمنية، لا يمكن عرض كلمة المرور الحالية. يمكنك تعيين كلمة مرور جديدة لـ
                                    <strong> {student?.fullName}</strong>.
                                </p>
                            </div>

                            {/* Current Password Display (Added as requested) */}
                            <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">
                                    كلمة المرور الحالية
                                </label>
                                <div className="flex items-center justify-between">
                                    <div className="font-mono text-lg font-bold text-gray-800">
                                        {isFetchingCredentials ? (
                                            <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                        ) : (
                                            credentials?.password || '***'
                                        )}
                                    </div>
                                    {credentials?.password && credentials.password !== '***' && (
                                        <button
                                            onClick={() => copyToClipboard(credentials.password)}
                                            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-600"
                                            title="نسخ"
                                        >
                                            {copied ? <Check className="w-4 h-4 text-success" /> : <RefreshCw className="w-4 h-4" />}
                                        </button>
                                    )}
                                </div>
                                {credentials?.password === '***' && (
                                    <p className="text-xs text-gray-400 mt-2">
                                        كلمة المرور غير مخزنة للعرض (حساب قديم). قم بتعيين واحدة جديدة لتظهر هنا مستقبلاً.
                                    </p>
                                )}
                            </div>

                            {/* Form */}
                            <form onSubmit={handleReset} className="space-y-4">
                                <div>
                                    <label className="label">كلمة المرور الجديدة</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="input w-full pl-10"
                                            placeholder="أدخل كلمة مرور جديدة"
                                            minLength={6}
                                            required
                                        />
                                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    </div>
                                    <div className="mt-2 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={generatePassword}
                                            className="text-xs text-primary hover:text-primary-dark"
                                        >
                                            توليد كلمة مرور عشوائية
                                        </button>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="mt-6 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="btn btn-outline flex-1"
                                        disabled={isPending}
                                    >
                                        إلغاء
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary flex-1 flex items-center justify-center gap-2"
                                        disabled={isPending || !newPassword}
                                    >
                                        {isPending ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : success ? (
                                            <>
                                                <Check className="w-5 h-5" />
                                                تم التغيير
                                            </>
                                        ) : (
                                            'حفظ كلمة المرور'
                                        )}
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

export default ShowPasswordModal
