import { useState, useEffect } from 'react'
import { DollarSign, Users, Calendar, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { useStudents } from '../../hooks/useStudents'
import { useFeeTypes } from '../../hooks/useFeeTypes'
import { useStudentGroups, useStudentGroup } from '../../hooks/useStudentGroups'
import { useAssignFee } from '../../hooks/usePayments'
import toast from 'react-hot-toast'

/**
 * AssignFee Component
 * Assign fees to all students or selected students
 */
const AssignFee = () => {
    const [feeTypeId, setFeeTypeId] = useState('')
    const [assignToAll, setAssignToAll] = useState(true)
    const [selectedStudents, setSelectedStudents] = useState([])
    const [selectedGroup, setSelectedGroup] = useState('')
    const [amount, setAmount] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [periodStart, setPeriodStart] = useState('')
    const [periodEnd, setPeriodEnd] = useState('')
    const [gracePeriod, setGracePeriod] = useState(30)
    const [notes, setNotes] = useState('')

    const { data: studentsData } = useStudents()
    const { data: feeTypesData } = useFeeTypes()
    const { data: groupsData } = useStudentGroups()
    const assignFee = useAssignFee()

    const students = studentsData || []
    const feeTypes = feeTypesData || []
    const groups = groupsData || []

    // Fetch individual group details when selected (to get members)
    const { data: groupDetails, isLoading: isLoadingGroup } = useStudentGroup(selectedGroup, {
        enabled: !!selectedGroup
    })

    useEffect(() => {
        if (selectedGroup && groupDetails && groupDetails.members) {
            const memberIds = groupDetails.members.map(m => m.studentId)
            setSelectedStudents(memberIds)
            if (memberIds.length > 0) {
                toast.success(`تم تحديد ${memberIds.length} طالب من المجموعة`)
            } else {
                toast('هذه المجموعة لا تحتوي على طلاب')
            }
        }
    }, [groupDetails, selectedGroup])


    const handleGroupSelect = (groupId) => {
        const id = parseInt(groupId) || ''
        setSelectedGroup(id)
        if (!id) {
            setSelectedStudents([])
        }
        // Loading will happen via hook
    }

    const handleStudentToggle = (studentId) => {
        setSelectedStudents(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        )
    }

    const handleSelectAll = () => {
        setSelectedStudents(students.map(s => s.id))
    }

    const handleDeselectAll = () => {
        setSelectedStudents([])
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!feeTypeId || !amount || !dueDate || !periodStart || !periodEnd) {
            toast.error('يرجى ملء جميع الحقول المطلوبة')
            return
        }

        if (!assignToAll && selectedStudents.length === 0) {
            toast.error('يرجى اختيار طالب واحد على الأقل')
            return
        }

        try {
            await assignFee.mutateAsync({
                feeTypeId: parseInt(feeTypeId),
                studentIds: assignToAll ? null : selectedStudents,
                amount: parseFloat(amount),
                dueDate,
                periodStart,
                periodEnd,
                gracePeriodDays: gracePeriod,
                notes
            })

            // Reset form
            setFeeTypeId('')
            setAmount('')
            setDueDate('')
            setPeriodStart('')
            setPeriodEnd('')
            setNotes('')
            setSelectedStudents([])
        } catch (error) {
            console.error('Failed to assign fee:', error)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-text-primary">تعيين رسوم</h2>
                <p className="text-text-muted mt-1">
                    تعيين رسوم لجميع الطلاب أو طلاب محددين
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Fee Type & Amount */}
                <div className="card">
                    <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-primary" />
                        معلومات الرسوم
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">
                                نوع الرسوم *
                            </label>
                            <select
                                value={feeTypeId}
                                onChange={(e) => {
                                    const id = e.target.value
                                    setFeeTypeId(id)
                                    if (id) {
                                        const type = feeTypes.find(f => f.id === parseInt(id))
                                        if (type) setAmount(type.amount)
                                    } else {
                                        setAmount('')
                                    }
                                }}
                                className="input w-full"
                                required
                            >
                                <option value="">اختر نوع الرسوم</option>
                                {feeTypes.map(feeType => (
                                    <option key={feeType.id} value={feeType.id}>
                                        {feeType.name} - {feeType.amount} جنيه
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">
                                المبلغ *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="input w-full"
                                placeholder="500.00"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Dates */}
                <div className="card">
                    <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        التواريخ
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">
                                تاريخ الاستحقاق *
                            </label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="input w-full"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">
                                بداية الفترة *
                            </label>
                            <input
                                type="date"
                                value={periodStart}
                                onChange={(e) => setPeriodStart(e.target.value)}
                                className="input w-full"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">
                                نهاية الفترة *
                            </label>
                            <input
                                type="date"
                                value={periodEnd}
                                onChange={(e) => setPeriodEnd(e.target.value)}
                                className="input w-full"
                                required
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            فترة السماح (أيام)
                        </label>
                        <input
                            type="number"
                            value={gracePeriod}
                            onChange={(e) => setGracePeriod(parseInt(e.target.value))}
                            className="input w-full md:w-48"
                            min="0"
                        />
                        <p className="text-xs text-text-muted mt-1">
                            عدد الأيام بعد تاريخ الاستحقاق قبل أن تصبح الرسوم متأخرة
                        </p>
                    </div>
                </div>

                {/* Student Selection */}
                <div className="card">
                    <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        اختيار الطلاب
                    </h3>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    checked={assignToAll}
                                    onChange={() => setAssignToAll(true)}
                                    className="radio"
                                />
                                <span className="font-medium">جميع الطلاب</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    checked={!assignToAll}
                                    onChange={() => setAssignToAll(false)}
                                    className="radio"
                                />
                                <span className="font-medium">طلاب محددين</span>
                            </label>
                        </div>

                        {!assignToAll && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-3"
                            >
                                {/* Group Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-2">
                                        اختيار مجموعة (اختياري)
                                    </label>
                                    <select
                                        value={selectedGroup}
                                        onChange={(e) => handleGroupSelect(e.target.value)}
                                        className="input w-full"
                                    >
                                        <option value="">بدون مجموعة - اختيار يدوي</option>
                                        {groups.map(group => (
                                            <option key={group.id} value={group.id}>
                                                {group.groupName} ({group.members?.length || 0} طالب)
                                            </option>
                                        ))}
                                    </select>
                                    {selectedGroup && (
                                        <p className="text-xs text-success mt-1">
                                            ✓ تم اختيار جميع أعضاء المجموعة
                                        </p>
                                    )}
                                </div>

                                {/* Individual Selection Buttons */}
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={handleSelectAll}
                                        className="btn btn-outline btn-sm"
                                    >
                                        تحديد الكل
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleDeselectAll}
                                        className="btn btn-outline btn-sm"
                                    >
                                        إلغاء التحديد
                                    </button>
                                </div>

                                <div className="max-h-64 overflow-y-auto border border-border rounded-lg p-3 space-y-2">
                                    {students.map(student => (
                                        <label
                                            key={student.id}
                                            className="flex items-center gap-2 p-2 hover:bg-background rounded cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedStudents.includes(student.id)}
                                                onChange={() => handleStudentToggle(student.id)}
                                                className="checkbox"
                                            />
                                            <span>{student.fullName}</span>
                                            <span className="text-xs text-text-muted">
                                                {student.academicLevel}
                                            </span>
                                        </label>
                                    ))}
                                </div>

                                <p className="text-sm text-text-muted">
                                    تم اختيار {selectedStudents.length} طالب
                                </p>
                            </motion.div>
                        )}

                        {assignToAll && (
                            <p className="text-sm text-info">
                                سيتم تعيين الرسوم لجميع الطلاب ({students.length} طالب)
                            </p>
                        )}
                    </div>
                </div>

                {/* Notes */}
                <div className="card">
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                        ملاحظات
                    </label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="input w-full min-h-[100px]"
                        placeholder="ملاحظات اختيارية..."
                    />
                </div>

                {/* Submit */}
                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={assignFee.isPending}
                        className="btn btn-primary flex-1"
                    >
                        {assignFee.isPending ? 'جاري التعيين...' : 'تعيين الرسوم'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AssignFee
