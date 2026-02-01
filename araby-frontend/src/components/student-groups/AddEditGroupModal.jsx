import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import PropTypes from 'prop-types'

/**
 * AddEditGroupModal Component
 * Modal for creating or editing a student group
 */
const AddEditGroupModal = ({ isOpen, onClose, group, onSubmit, isLoading }) => {
    const isEditMode = !!group

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm({
        defaultValues: {
            groupName: '',
            description: ''
        }
    })

    // Populate form when editing
    useEffect(() => {
        if (group) {
            setValue('groupName', group.groupName || '')
            setValue('description', group.description || '')
        } else {
            reset()
        }
    }, [group, setValue, reset])

    const handleFormSubmit = (data) => {
        onSubmit(data)
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
                        className="fixed inset-0 bg-black/50 z-40"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
                            {/* Header */}
                            <div className="bg-gradient-to-l from-primary to-primary-dark p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold">
                                        {isEditMode ? 'تعديل المجموعة' : 'إنشاء مجموعة جديدة'}
                                    </h2>
                                    <button
                                        onClick={handleClose}
                                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            {/* Body */}
                            <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
                                {/* Group Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        اسم المجموعة <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        {...register('groupName', {
                                            required: 'اسم المجموعة مطلوب',
                                            maxLength: {
                                                value: 100,
                                                message: 'الاسم يجب ألا يتجاوز 100 حرف'
                                            }
                                        })}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${errors.groupName ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="مثال: الصف الأول الثانوي"
                                    />
                                    {errors.groupName && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.groupName.message}
                                        </p>
                                    )}
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        الوصف
                                    </label>
                                    <textarea
                                        {...register('description', {
                                            maxLength: {
                                                value: 500,
                                                message: 'الوصف يجب ألا يتجاوز 500 حرف'
                                            }
                                        })}
                                        rows={4}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none ${errors.description ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="وصف مختصر عن المجموعة..."
                                    />
                                    {errors.description && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.description.message}
                                        </p>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-1 bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? 'جاري الحفظ...' : isEditMode ? 'حفظ التعديلات' : 'إنشاء المجموعة'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                    >
                                        إلغاء
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

AddEditGroupModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    group: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    isLoading: PropTypes.bool
}

export default AddEditGroupModal
