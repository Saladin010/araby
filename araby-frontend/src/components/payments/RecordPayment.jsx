import { useState, useEffect } from 'react'
import { DollarSign, Calendar, FileText, User, CreditCard, Printer } from 'lucide-react'
import { motion } from 'framer-motion'
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useStudents } from '../../hooks/useStudents'
import { useFeeTypes } from '../../hooks/useFeeTypes'
import { useCreatePayment } from '../../hooks/usePayments'
import ReceiptView from './ReceiptView'

/**
 * RecordPayment Component
 * Form for recording student payments
 */
const RecordPayment = () => {
    const [showReceipt, setShowReceipt] = useState(false)
    const [lastPayment, setLastPayment] = useState(null)
    const [selectedStudent, setSelectedStudent] = useState(null)
    const [selectedFeeType, setSelectedFeeType] = useState(null)

    const { data: studentsData, isLoading: loadingStudents } = useStudents()
    const { data: feeTypesData, isLoading: loadingFeeTypes } = useFeeTypes()
    const createPayment = useCreatePayment()

    // Extract data directly from API response
    const students = studentsData || []
    const feeTypes = feeTypesData || []

    const {
        control,
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            studentId: '',
            feeTypeId: '',
            amount: '',
            paymentDate: new Date().toISOString().split('T')[0],
            notes: '',
        },
    })

    const watchStudentId = watch('studentId')
    const watchFeeTypeId = watch('feeTypeId')
    const watchAmount = watch('amount')

    // Update selected student
    useEffect(() => {
        if (watchStudentId) {
            const student = students.find(s => s.id === parseInt(watchStudentId))
            setSelectedStudent(student)
        } else {
            setSelectedStudent(null)
        }
    }, [watchStudentId, students])

    // Update selected fee type and auto-fill amount
    useEffect(() => {
        if (watchFeeTypeId) {
            const feeType = feeTypes.find(f => f.id === parseInt(watchFeeTypeId))
            setSelectedFeeType(feeType)
            if (feeType && !watchAmount) {
                setValue('amount', feeType.amount)
            }
        } else {
            setSelectedFeeType(null)
        }
    }, [watchFeeTypeId, feeTypes, setValue, watchAmount])

    // Handle form submission
    const onSubmit = async (data) => {
        try {
            // Validate that studentId and feeTypeId are not empty
            if (!data.studentId || !data.feeTypeId) {
                toast.error('يجب اختيار الطالب ونوع الرسوم')
                return
            }

            // Calculate period dates (for now, same as payment date)
            const paymentDate = new Date(data.paymentDate)

            const paymentData = {
                studentId: data.studentId, // Keep as string - backend expects string
                feeTypeId: parseInt(data.feeTypeId, 10),
                amount: parseFloat(data.amount),
                paymentDate: data.paymentDate,
                periodStart: data.paymentDate, // Same as payment date
                periodEnd: data.paymentDate, // Same as payment date
                notes: data.notes || '',
            }

            // Validate numbers
            if (isNaN(paymentData.feeTypeId) || isNaN(paymentData.amount)) {
                toast.error('بيانات غير صحيحة')
                return
            }

            const result = await createPayment.mutateAsync(paymentData)

            // Store payment for receipt with proper data structure
            setLastPayment({
                id: result.id,
                amountPaid: paymentData.amount,
                paymentDate: paymentData.paymentDate,
                notes: paymentData.notes,
                student: selectedStudent, // From state
                feeType: selectedFeeType, // From state
            })

            // Show receipt
            setShowReceipt(true)

            // Reset form
            reset()
            setSelectedStudent(null)
            setSelectedFeeType(null)
        } catch (error) {
            console.error('Payment error:', error)
        }
    }

    // Get frequency label
    const getFrequencyLabel = (frequency) => {
        const labels = {
            1: 'شهري',
            2: 'أسبوعي',
            3: 'سنوي',
            4: 'مرة واحدة',
        }
        return labels[frequency] || 'غير محدد'
    }

    if (showReceipt && lastPayment) {
        return (
            <ReceiptView
                payment={lastPayment}
                onClose={() => setShowReceipt(false)}
                onNewPayment={() => {
                    setShowReceipt(false)
                    setLastPayment(null)
                }}
            />
        )
    }

    return (
        <div className="max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-green-100 rounded-lg">
                        <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">تسجيل دفعة جديدة</h2>
                        <p className="text-sm text-gray-500">قم بإدخال بيانات الدفعة</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Student Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <User className="w-4 h-4 inline ml-1" />
                            الطالب *
                        </label>
                        <select
                            {...register('studentId', { required: 'يجب اختيار الطالب' })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            disabled={loadingStudents}
                        >
                            <option value="">اختر الطالب</option>
                            {students.map((student) => (
                                <option key={student.id} value={student.id}>
                                    {student.fullName} - {student.phoneNumber}
                                </option>
                            ))}
                        </select>
                        {errors.studentId && (
                            <p className="text-red-500 text-sm mt-1">{errors.studentId.message}</p>
                        )}
                        {selectedStudent && (
                            <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-900">
                                    <strong>الهاتف:</strong> {selectedStudent.phoneNumber}
                                </p>
                                {selectedStudent.email && (
                                    <p className="text-sm text-blue-900">
                                        <strong>البريد:</strong> {selectedStudent.email}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Fee Type Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <CreditCard className="w-4 h-4 inline ml-1" />
                            نوع الرسوم *
                        </label>
                        <select
                            {...register('feeTypeId', { required: 'يجب اختيار نوع الرسوم' })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            disabled={loadingFeeTypes}
                        >
                            <option value="">اختر نوع الرسوم</option>
                            {feeTypes.filter(f => f.isActive).map((feeType) => (
                                <option key={feeType.id} value={feeType.id}>
                                    {feeType.name} - {feeType.amount} جنيه ({getFrequencyLabel(feeType.frequency)})
                                </option>
                            ))}
                        </select>
                        {errors.feeTypeId && (
                            <p className="text-red-500 text-sm mt-1">{errors.feeTypeId.message}</p>
                        )}
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <DollarSign className="w-4 h-4 inline ml-1" />
                            المبلغ (جنيه) *
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            {...register('amount', {
                                required: 'يجب إدخال المبلغ',
                                min: { value: 0.01, message: 'المبلغ يجب أن يكون أكبر من صفر' },
                            })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="0.00"
                        />
                        {errors.amount && (
                            <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
                        )}
                        {selectedFeeType && (
                            <p className="text-sm text-gray-500 mt-1">
                                المبلغ الافتراضي: {selectedFeeType.amount} جنيه
                            </p>
                        )}
                    </div>

                    {/* Payment Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Calendar className="w-4 h-4 inline ml-1" />
                            تاريخ الدفع *
                        </label>
                        <input
                            type="date"
                            {...register('paymentDate', { required: 'يجب اختيار تاريخ الدفع' })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        {errors.paymentDate && (
                            <p className="text-red-500 text-sm mt-1">{errors.paymentDate.message}</p>
                        )}
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <FileText className="w-4 h-4 inline ml-1" />
                            ملاحظات (اختياري)
                        </label>
                        <textarea
                            {...register('notes')}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                            placeholder="أي ملاحظات إضافية..."
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => reset()}
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            إعادة تعيين
                        </button>
                        <button
                            type="submit"
                            disabled={createPayment.isPending}
                            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {createPayment.isPending ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    جاري الحفظ...
                                </>
                            ) : (
                                <>
                                    <Printer className="w-5 h-5" />
                                    حفظ وطباعة الإيصال
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}

export default RecordPayment
