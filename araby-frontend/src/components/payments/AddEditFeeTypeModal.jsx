import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useStudentGroups } from '../../hooks/useStudentGroups'

/**
 * AddEditFeeTypeModal Component
 * Modal for creating or editing fee types
 */
const AddEditFeeTypeModal = ({ isOpen, onClose, feeType, onSubmit, isLoading }) => {
    const [selectedGroups, setSelectedGroups] = useState([])
    const [autoAssign, setAutoAssign] = useState(false)

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            name: '',
            amount: '',
            frequency: 1
        }
    })

    const { data: groupsData } = useStudentGroups()
    const groups = groupsData || []

    // Reset form when feeType changes
    useEffect(() => {
        if (feeType) {
            reset({
                name: feeType.name,
                amount: feeType.amount,
                frequency: feeType.frequency
            })
            setSelectedGroups([])
            setAutoAssign(false)
        } else {
            reset({
                name: '',
                amount: '',
                frequency: 1
            })
            setSelectedGroups([])
            setAutoAssign(false)
        }
    }, [feeType, reset])

    const handleFormSubmit = (data) => {
        onSubmit({
            name: data.name,
            amount: parseFloat(data.amount),
            frequency: parseInt(data.frequency),
            autoAssign: autoAssign,
            selectedGroupIds: autoAssign ? selectedGroups : []
        })
    }

    const handleGroupToggle = (groupId) => {
        setSelectedGroups(prev =>
            prev.includes(groupId)
                ? prev.filter(id => id !== groupId)
                : [...prev, groupId]
        )
    }

    const handleClose = () => {
        reset()
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={handleClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {feeType ? 'تعديل نوع المصروف' : 'إضافة نوع مصروف جديد'}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            اسم المصروف <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            {...register('name', {
                                required: 'اسم المصروف مطلوب',
                                maxLength: { value: 100, message: 'الحد الأقصى 100 حرف' }
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="مثال: الاشتراك الشهري"
                        />
                        {errors.name && (
                            <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            المبلغ (ج.م) <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="1"
                            {...register('amount', {
                                required: 'المبلغ مطلوب',
                                min: { value: 1, message: 'المبلغ يجب أن يكون أكبر من صفر' }
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0.00"
                        />
                        {errors.amount && (
                            <p className="text-red-600 text-sm mt-1">{errors.amount.message}</p>
                        )}
                    </div>

                    {/* Frequency */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            التكرار <span className="text-red-600">*</span>
                        </label>
                        <select
                            {...register('frequency', { required: 'التكرار مطلوب' })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value={1}>شهري</option>
                            <option value={2}>أسبوعي</option>
                            <option value={3}>سنوي</option>
                            <option value={4}>لمرة واحدة</option>
                        </select>
                        {errors.frequency && (
                            <p className="text-red-600 text-sm mt-1">{errors.frequency.message}</p>
                        )}
                    </div>

                    {/* Auto-assign to Groups - Only for new fee types */}
                    {!feeType && (
                        <div className="border-t pt-4 mt-4">
                            <div className="flex items-center gap-2 mb-3">
                                <input
                                    type="checkbox"
                                    id="autoAssign"
                                    checked={autoAssign}
                                    onChange={(e) => setAutoAssign(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <label htmlFor="autoAssign" className="text-sm font-medium text-gray-700 cursor-pointer">
                                    تعيين تلقائي للمجموعات المحددة
                                </label>
                            </div>

                            {autoAssign && (
                                <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                                    {groups.length === 0 ? (
                                        <p className="text-sm text-gray-500 text-center py-2">
                                            لا توجد مجموعات متاحة
                                        </p>
                                    ) : (
                                        groups.map(group => (
                                            <label
                                                key={group.id}
                                                className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedGroups.includes(group.id)}
                                                    onChange={() => handleGroupToggle(group.id)}
                                                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                                />
                                                <div className="flex-1">
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {group.groupName}
                                                    </span>
                                                    <span className="text-xs text-gray-500 mr-2">
                                                        ({group.members?.length || 0} طالب)
                                                    </span>
                                                </div>
                                            </label>
                                        ))
                                    )}
                                </div>
                            )}

                            {autoAssign && selectedGroups.length > 0 && (
                                <p className="text-xs text-blue-600 mt-2">
                                    ✓ سيتم تعيين هذه الرسوم تلقائياً لـ {selectedGroups.length} مجموعة
                                </p>
                            )}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            disabled={isLoading}
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            {isLoading ? 'جاري الحفظ...' : 'حفظ'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddEditFeeTypeModal
