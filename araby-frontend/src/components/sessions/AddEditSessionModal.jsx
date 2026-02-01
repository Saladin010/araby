import { X, Calendar, Clock, MapPin, Link as LinkIcon, Users as UsersIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { format } from 'date-fns'

/**
 * AddEditSessionModal Component
 * Modal for creating and editing sessions
 */
const AddEditSessionModal = ({ isOpen, onClose, onSubmit, session, students = [], loading }) => {
    const isEdit = !!session
    const [selectedStudents, setSelectedStudents] = useState([])
    const [duration, setDuration] = useState('')
    const [isRecurring, setIsRecurring] = useState(false)
    const [selectedDays, setSelectedDays] = useState([])
    const [recurrenceEndDate, setRecurrenceEndDate] = useState('')

    // Extract date and time from session if editing
    const getDefaultValues = () => {
        if (!session) {
            return {
                title: '',
                startDate: '',
                startTime: '',
                endTime: '',
                location: '',
                locationUrl: '',
                type: '2', // Group by default
                maxStudents: 20,
            }
        }

        const startDate = new Date(session.startTime)
        const endDate = new Date(session.endTime)

        return {
            title: session.title,
            startDate: startDate.toISOString().split('T')[0], // YYYY-MM-DD
            startTime: startDate.toTimeString().slice(0, 5), // HH:MM
            endTime: endDate.toTimeString().slice(0, 5), // HH:MM
            location: session.location,
            locationUrl: session.locationUrl || '',
            type: session.type?.toString() || '2',
            maxStudents: session.maxStudents || 20,
        }
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        reset,
    } = useForm({
        defaultValues: getDefaultValues(),
    })

    const watchStartTime = watch('startTime')
    const watchEndTime = watch('endTime')
    const watchType = watch('type')

    // Reset form when modal opens or session changes
    useEffect(() => {
        if (isOpen) {
            if (session) {
                // Edit mode - load session data
                const startDate = new Date(session.startTime)
                const endDate = new Date(session.endTime)

                reset({
                    title: session.title,
                    startDate: startDate.toISOString().split('T')[0],
                    startTime: startDate.toTimeString().slice(0, 5),
                    endTime: endDate.toTimeString().slice(0, 5),
                    location: session.location,
                    locationUrl: session.locationUrl || '',
                    type: session.type?.toString() || '2',
                    maxStudents: session.maxStudents || 20,
                })

                if (session.students) {
                    setSelectedStudents(session.students.map(s => s.id))
                }

                // Load recurrence data
                setIsRecurring(session.isRecurring || false)
                if (session.recurringPattern) {
                    try {
                        const pattern = JSON.parse(session.recurringPattern)
                        setSelectedDays(pattern.daysOfWeek || [])
                        setRecurrenceEndDate(pattern.endDate || '')
                    } catch (e) {
                        console.error('Error parsing recurring pattern:', e)
                    }
                }
            } else {
                // Create mode - reset to defaults
                reset({
                    title: '',
                    startDate: '',
                    startTime: '',
                    endTime: '',
                    location: '',
                    locationUrl: '',
                    type: '2',
                    maxStudents: 20,
                })
                setSelectedStudents([])
                setIsRecurring(false)
                setSelectedDays([])
                setRecurrenceEndDate('')
            }
        }
    }, [isOpen, session, reset])

    // Calculate duration
    useEffect(() => {
        if (watchStartTime && watchEndTime) {
            const start = new Date(`2000-01-01T${watchStartTime}`)
            const end = new Date(`2000-01-01T${watchEndTime}`)
            const diff = (end - start) / (1000 * 60) // minutes

            if (diff > 0) {
                const hours = Math.floor(diff / 60)
                const minutes = diff % 60
                setDuration(
                    hours > 0
                        ? `${hours} ساعة${minutes > 0 ? ` و ${minutes} دقيقة` : ''}`
                        : `${minutes} دقيقة`
                )
            } else {
                setDuration('')
            }
        }
    }, [watchStartTime, watchEndTime])

    // Load selected students if editing
    useEffect(() => {
        if (session?.students) {
            setSelectedStudents(session.students.map(s => s.id))
        }
    }, [session])

    const onFormSubmit = (data) => {
        console.log('=== Modal onFormSubmit called ===')
        console.log('Form data:', data)
        console.log('Is edit mode:', isEdit)
        console.log('Selected students:', selectedStudents)

        // Combine date and time into ISO format
        const startDateTime = new Date(`${data.startDate}T${data.startTime}`)
        const endDateTime = new Date(`${data.startDate}T${data.endTime}`)

        console.log('Start DateTime:', startDateTime)
        console.log('End DateTime:', endDateTime)

        // Build recurring pattern
        let recurringPattern = ''
        if (isRecurring && selectedDays.length > 0) {
            recurringPattern = JSON.stringify({
                daysOfWeek: selectedDays,
                endDate: recurrenceEndDate || null
            })
        }

        const sessionData = {
            title: data.title,
            startTime: startDateTime.toISOString(),
            endTime: endDateTime.toISOString(),
            location: data.location,
            locationUrl: data.locationUrl || '',
            type: parseInt(data.type), // 1 = Individual, 2 = Group
            maxStudents: data.type === '2' ? parseInt(data.maxStudents) : null,
            isRecurring: isRecurring,
            recurringPattern: recurringPattern,
        }

        // Add studentIds only for create, not for update
        if (!isEdit) {
            sessionData.studentIds = selectedStudents
        }

        console.log('Final session data to submit:', sessionData)
        console.log('Type value:', sessionData.type, 'Type of type:', typeof sessionData.type)

        onSubmit(sessionData)
        handleClose()
    }

    const handleClose = () => {
        reset()
        setSelectedStudents([])
        setDuration('')
        onClose()
    }

    const handleStudentToggle = (studentId) => {
        setSelectedStudents(prev => {
            if (prev.includes(studentId)) {
                return prev.filter(id => id !== studentId)
            } else {
                // Check max students for group sessions
                if (watchType === '2') {
                    const maxStudents = parseInt(watch('maxStudents'))
                    if (prev.length >= maxStudents) {
                        alert(`الحد الأقصى للطلاب هو ${maxStudents}`)
                        return prev
                    }
                }
                return [...prev, studentId]
            }
        })
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
                            className="bg-surface rounded-xl shadow-xl max-w-3xl w-full p-6 my-8 max-h-[90vh] overflow-y-auto"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-text-primary">
                                    {isEdit ? 'تعديل الحصة' : 'إضافة حصة جديدة'}
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
                                {/* Title */}
                                <div>
                                    <label className="label">
                                        عنوان الحصة <span className="text-error">*</span>
                                    </label>
                                    <input
                                        {...register('title', {
                                            required: 'عنوان الحصة مطلوب',
                                            maxLength: { value: 200, message: 'الحد الأقصى 200 حرف' },
                                        })}
                                        className={`input ${errors.title ? 'input-error' : ''}`}
                                        placeholder="مثال: النحو - الجملة الاسمية"
                                    />
                                    {errors.title && (
                                        <p className="text-error text-sm mt-1">{errors.title.message}</p>
                                    )}
                                </div>

                                {/* Date and Time */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="label">
                                            <Calendar className="w-4 h-4" />
                                            <span className="mr-2">التاريخ <span className="text-error">*</span></span>
                                        </label>
                                        <input
                                            type="date"
                                            {...register('startDate', { required: 'التاريخ مطلوب' })}
                                            className={`input ${errors.startDate ? 'input-error' : ''}`}
                                        />
                                        {errors.startDate && (
                                            <p className="text-error text-sm mt-1">{errors.startDate.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="label">
                                            <Clock className="w-4 h-4" />
                                            <span className="mr-2">وقت البداية <span className="text-error">*</span></span>
                                        </label>
                                        <input
                                            type="time"
                                            {...register('startTime', { required: 'وقت البداية مطلوب' })}
                                            className={`input ${errors.startTime ? 'input-error' : ''}`}
                                        />
                                        {errors.startTime && (
                                            <p className="text-error text-sm mt-1">{errors.startTime.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="label">
                                            <Clock className="w-4 h-4" />
                                            <span className="mr-2">وقت النهاية <span className="text-error">*</span></span>
                                        </label>
                                        <input
                                            type="time"
                                            {...register('endTime', {
                                                required: 'وقت النهاية مطلوب',
                                                validate: value => {
                                                    if (watchStartTime && value <= watchStartTime) {
                                                        return 'وقت النهاية يجب أن يكون بعد وقت البداية'
                                                    }
                                                    return true
                                                }
                                            })}
                                            className={`input ${errors.endTime ? 'input-error' : ''}`}
                                        />
                                        {errors.endTime && (
                                            <p className="text-error text-sm mt-1">{errors.endTime.message}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Duration Display */}
                                {duration && (
                                    <div className="bg-background px-4 py-2 rounded-lg">
                                        <span className="text-text-muted text-sm">المدة: </span>
                                        <span className="text-primary font-semibold">{duration}</span>
                                    </div>
                                )}

                                {/* Location */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">
                                            <MapPin className="w-4 h-4" />
                                            <span className="mr-2">المكان <span className="text-error">*</span></span>
                                        </label>
                                        <input
                                            {...register('location', { required: 'المكان مطلوب' })}
                                            className={`input ${errors.location ? 'input-error' : ''}`}
                                            placeholder="مثال: القاعة الرئيسية"
                                        />
                                        {errors.location && (
                                            <p className="text-error text-sm mt-1">{errors.location.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="label">
                                            <LinkIcon className="w-4 h-4" />
                                            <span className="mr-2">رابط الحصة (اختياري)</span>
                                        </label>
                                        <input
                                            type="url"
                                            {...register('locationUrl', {
                                                pattern: {
                                                    value: /^https?:\/\/.+/,
                                                    message: 'رابط غير صحيح'
                                                }
                                            })}
                                            className={`input ${errors.locationUrl ? 'input-error' : ''}`}
                                            placeholder="https://meet.google.com/..."
                                        />
                                        {errors.locationUrl && (
                                            <p className="text-error text-sm mt-1">{errors.locationUrl.message}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Session Type */}
                                <div>
                                    <label className="label">
                                        نوع الحصة <span className="text-error">*</span>
                                    </label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                value="1"
                                                {...register('type')}
                                                className="radio"
                                            />
                                            <span>فردي</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                value="2"
                                                {...register('type')}
                                                className="radio"
                                            />
                                            <span>جماعي</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Max Students (for group sessions) */}
                                {watchType === '2' && (
                                    <div>
                                        <label className="label">
                                            <UsersIcon className="w-4 h-4" />
                                            <span className="mr-2">الحد الأقصى للطلاب <span className="text-error">*</span></span>
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            {...register('maxStudents', {
                                                required: watchType === '2' ? 'الحد الأقصى مطلوب' : false,
                                                min: { value: 1, message: 'الحد الأدنى 1' }
                                            })}
                                            className={`input ${errors.maxStudents ? 'input-error' : ''}`}
                                        />
                                        {errors.maxStudents && (
                                            <p className="text-error text-sm mt-1">{errors.maxStudents.message}</p>
                                        )}
                                    </div>
                                )

                                }

                                {/* Recurrence Section */}
                                <div className="border-t border-border pt-4">
                                    <div className="flex items-center gap-3 mb-4">
                                        <input
                                            type="checkbox"
                                            id="isRecurring"
                                            checked={isRecurring}
                                            onChange={(e) => setIsRecurring(e.target.checked)}
                                            className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                                        />
                                        <label htmlFor="isRecurring" className="text-lg font-semibold text-text-primary cursor-pointer">
                                            تكرار الحصة أسبوعياً
                                        </label>
                                    </div>

                                    {isRecurring && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="space-y-4"
                                        >
                                            {/* Days Selection */}
                                            <div>
                                                <label className="label">
                                                    اختر الأيام <span className="text-error">*</span>
                                                </label>
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                                    {[
                                                        { value: 6, label: 'السبت' },
                                                        { value: 0, label: 'الأحد' },
                                                        { value: 1, label: 'الاثنين' },
                                                        { value: 2, label: 'الثلاثاء' },
                                                        { value: 3, label: 'الأربعاء' },
                                                        { value: 4, label: 'الخميس' },
                                                        { value: 5, label: 'الجمعة' },
                                                    ].map((day) => (
                                                        <label
                                                            key={day.value}
                                                            className={`flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${selectedDays.includes(day.value)
                                                                ? 'bg-primary text-white border-primary'
                                                                : 'bg-background border-border hover:border-primary'
                                                                }`}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedDays.includes(day.value)}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) {
                                                                        setSelectedDays([...selectedDays, day.value])
                                                                    } else {
                                                                        setSelectedDays(selectedDays.filter(d => d !== day.value))
                                                                    }
                                                                }}
                                                                className="hidden"
                                                            />
                                                            <span className="font-medium">{day.label}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                                {isRecurring && selectedDays.length === 0 && (
                                                    <p className="text-error text-sm mt-1">يجب اختيار يوم واحد على الأقل</p>
                                                )}
                                            </div>

                                            {/* End Date */}
                                            <div>
                                                <label className="label">
                                                    <Calendar className="w-4 h-4" />
                                                    <span className="mr-2">تاريخ انتهاء التكرار (اختياري)</span>
                                                </label>
                                                <input
                                                    type="date"
                                                    value={recurrenceEndDate}
                                                    onChange={(e) => setRecurrenceEndDate(e.target.value)}
                                                    min={watch('startDate')}
                                                    className="input"
                                                    placeholder="اترك فارغاً للتكرار بدون نهاية"
                                                />
                                                <p className="text-text-muted text-sm mt-1">
                                                    اترك فارغاً إذا كنت تريد أن تستمر الحصة بدون تاريخ انتهاء
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Students Selection */}
                                <div>
                                    <label className="label">
                                        الطلاب ({selectedStudents.length} محدد)
                                    </label>
                                    <div className="border border-border rounded-lg p-4 max-h-48 overflow-y-auto">
                                        {students.length === 0 ? (
                                            <p className="text-text-muted text-sm">لا يوجد طلاب</p>
                                        ) : (
                                            <div className="space-y-2">
                                                {students.map((student) => (
                                                    <label
                                                        key={student.id}
                                                        className="flex items-center gap-2 cursor-pointer hover:bg-background p-2 rounded"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedStudents.includes(student.id)}
                                                            onChange={() => handleStudentToggle(student.id)}
                                                            className="checkbox"
                                                        />
                                                        <span>{student.fullName}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

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
                                        {loading ? 'جاري الحفظ...' : isEdit ? 'حفظ التعديلات' : 'إضافة الحصة'}
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

export default AddEditSessionModal
