import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Save, PlusCircle, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAllUsers } from '../../hooks/useStudents'
import { useCreateGrade, useStudentGrades } from '../../hooks/useGrades'
import { calculatePercentage, getGradeLabel, getGradeColor } from '../../utils/gradeHelpers'

/**
 * AddGradeForm Component
 * Form for adding new grades with live preview
 */
const AddGradeForm = ({ onSuccess }) => {
    const [selectedStudent, setSelectedStudent] = useState(null)
    const [livePercentage, setLivePercentage] = useState(0)

    const { register, handleSubmit, formState: { errors }, watch, reset, setValue } = useForm({
        defaultValues: {
            studentId: '',
            examName: '',
            score: '',
            maxScore: '',
            examDate: new Date().toISOString().split('T')[0],
            notes: ''
        }
    })

    // Fetch students only (role filter)
    const { data: studentsData, isLoading: loadingStudents } = useAllUsers('student')
    const students = studentsData || []

    // Fetch selected student's recent grades
    const { data: studentGrades } = useStudentGrades(selectedStudent?.id)
    const recentGrades = studentGrades?.slice(0, 5) || []

    // Create grade mutation
    const createGrade = useCreateGrade()

    // Watch score and maxScore for live calculation
    const watchScore = watch('score')
    const watchMaxScore = watch('maxScore')

    // Calculate live percentage
    useEffect(() => {
        if (watchScore && watchMaxScore) {
            const percentage = calculatePercentage(
                parseFloat(watchScore),
                parseFloat(watchMaxScore)
            )
            setLivePercentage(percentage)
        } else {
            setLivePercentage(0)
        }
    }, [watchScore, watchMaxScore])

    // Handle student selection
    const handleStudentSelect = (student) => {
        setSelectedStudent(student)
        setValue('studentId', student.id)
    }

    // Handle form submission
    const onSubmit = async (data) => {
        try {
            const gradeData = {
                studentId: data.studentId,
                examName: data.examName,
                score: parseFloat(data.score),
                maxScore: parseFloat(data.maxScore),
                examDate: data.examDate,
                notes: data.notes
            }

            await createGrade.mutateAsync(gradeData)

            // Reset form
            reset()
            setSelectedStudent(null)
            setLivePercentage(0)

            if (onSuccess) onSuccess()
        } catch (error) {
            console.error('Submit error:', error)
        }
    }

    // Handle save and add another
    const handleSaveAndAddAnother = async (data) => {
        await onSubmit(data)
        // Form is already reset in onSubmit
    }

    // Quick select max score presets
    const maxScorePresets = [10, 20, 50, 100]

    const gradeColors = getGradeColor(livePercentage)
    const gradeLabel = getGradeLabel(livePercentage)

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Student Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        اختيار الطالب <span className="text-red-600">*</span>
                    </label>

                    {!selectedStudent ? (
                        <div className="relative">
                            <select
                                onChange={(e) => {
                                    const student = students.find(s => s.id === e.target.value)
                                    if (student) handleStudentSelect(student)
                                }}
                                value=""
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={loadingStudents}
                            >
                                <option value="">
                                    {loadingStudents ? 'جاري التحميل...' : 'اختر طالباً...'}
                                </option>
                                {students.map(student => (
                                    <option key={student.id} value={student.id}>
                                        {student.fullName} - {student.phoneNumber || 'لا يوجد رقم'}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                                    {selectedStudent.fullName?.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900">{selectedStudent.fullName}</div>
                                    <div className="text-sm text-gray-600">{selectedStudent.phoneNumber}</div>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedStudent(null)
                                    setValue('studentId', '')
                                }}
                                className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    )}

                    <input type="hidden" {...register('studentId', { required: 'يجب اختيار الطالب' })} />
                    {errors.studentId && (
                        <p className="text-red-600 text-sm mt-1">{errors.studentId.message}</p>
                    )}
                </div>

                {/* Recent Grades (if student selected) */}
                {selectedStudent && recentGrades.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">آخر 5 درجات:</h4>
                        <div className="space-y-2">
                            {recentGrades.map(grade => (
                                <div key={grade.id} className="flex justify-between items-center text-sm">
                                    <span className="text-gray-700">{grade.examName}</span>
                                    <span className="font-medium text-gray-900">
                                        {grade.score} / {grade.maxScore} ({grade.percentage?.toFixed(1)}%)
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Exam Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        اسم الامتحان/التقييم <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="text"
                        {...register('examName', {
                            required: 'اسم الامتحان مطلوب',
                            maxLength: { value: 200, message: 'الحد الأقصى 200 حرف' }
                        })}
                        placeholder='مثال: "امتحان الشهر الأول" أو "واجب منزلي رقم 5"'
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.examName && (
                        <p className="text-red-600 text-sm mt-1">{errors.examName.message}</p>
                    )}
                </div>

                {/* Score and Max Score */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Score */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            الدرجة المحرزة <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            {...register('score', {
                                required: 'الدرجة مطلوبة',
                                min: { value: 0, message: 'الدرجة يجب أن تكون 0 أو أكثر' },
                                validate: (value) => {
                                    const maxScore = parseFloat(watchMaxScore)
                                    if (maxScore && parseFloat(value) > maxScore) {
                                        return 'الدرجة يجب أن تكون أقل من أو تساوي الدرجة النهائية'
                                    }
                                    return true
                                }
                            })}
                            placeholder="0.00"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {errors.score && (
                            <p className="text-red-600 text-sm mt-1">{errors.score.message}</p>
                        )}
                    </div>

                    {/* Max Score */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            الدرجة النهائية <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="1"
                            {...register('maxScore', {
                                required: 'الدرجة النهائية مطلوبة',
                                min: { value: 1, message: 'الدرجة النهائية يجب أن تكون 1 أو أكثر' }
                            })}
                            placeholder="100"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {errors.maxScore && (
                            <p className="text-red-600 text-sm mt-1">{errors.maxScore.message}</p>
                        )}

                        {/* Quick Presets */}
                        <div className="flex gap-2 mt-2">
                            {maxScorePresets.map(preset => (
                                <button
                                    key={preset}
                                    type="button"
                                    onClick={() => setValue('maxScore', preset)}
                                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
                                >
                                    {preset}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Live Percentage Display */}
                {watchScore && watchMaxScore && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-lg border-2 ${gradeColors.border} ${gradeColors.bg}`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">النسبة المئوية:</span>
                            <span className={`text-2xl font-bold ${gradeColors.text}`}>
                                {livePercentage.toFixed(1)}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${livePercentage}%` }}
                                className={`h-full ${gradeColors.progress}`}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                        <div className="mt-2 text-center">
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${gradeColors.bg} ${gradeColors.text}`}>
                                {gradeLabel}
                            </span>
                        </div>
                    </motion.div>
                )}

                {/* Exam Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        تاريخ الامتحان <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="date"
                        {...register('examDate', {
                            required: 'تاريخ الامتحان مطلوب',
                            validate: (value) => {
                                const selectedDate = new Date(value)
                                const today = new Date()
                                today.setHours(0, 0, 0, 0)
                                if (selectedDate > today) {
                                    return 'لا يمكن اختيار تاريخ مستقبلي'
                                }
                                return true
                            }
                        })}
                        max={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.examDate && (
                        <p className="text-red-600 text-sm mt-1">{errors.examDate.message}</p>
                    )}
                </div>

                {/* Notes */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        ملاحظات (اختياري)
                    </label>
                    <textarea
                        {...register('notes', {
                            maxLength: { value: 500, message: 'الحد الأقصى 500 حرف' }
                        })}
                        rows={3}
                        placeholder="ملاحظات إضافية عن الأداء..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                    {errors.notes && (
                        <p className="text-red-600 text-sm mt-1">{errors.notes.message}</p>
                    )}
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-4">
                    <button
                        type="button"
                        onClick={() => {
                            reset()
                            setSelectedStudent(null)
                            setLivePercentage(0)
                        }}
                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        disabled={createGrade.isPending}
                    >
                        إلغاء
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit(handleSaveAndAddAnother)}
                        className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={createGrade.isPending}
                    >
                        <PlusCircle className="w-5 h-5" />
                        حفظ وإضافة أخرى
                    </button>
                    <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={createGrade.isPending}
                    >
                        <Save className="w-5 h-5" />
                        {createGrade.isPending ? 'جاري الحفظ...' : 'حفظ'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddGradeForm
