import { useState } from 'react'
import { User, StickyNote } from 'lucide-react'
import { motion } from 'framer-motion'
import { Avatar } from '../common'

/**
 * StudentAttendanceCard Component
 * Card for marking individual student attendance
 */
const StudentAttendanceCard = ({
    student,
    status,
    notes,
    onStatusChange,
    onNotesChange,
    index = 0,
    disabled = false
}) => {
    const [showNotes, setShowNotes] = useState(false)

    // Status options with colors and labels
    const statusOptions = [
        { value: 1, label: 'حاضر', icon: '✅', color: 'success', bgColor: 'bg-success/10', textColor: 'text-success', borderColor: 'border-success' },
        { value: 2, label: 'غائب', icon: '❌', color: 'error', bgColor: 'bg-error/10', textColor: 'text-error', borderColor: 'border-error' },
        { value: 3, label: 'متأخر', icon: '⏰', color: 'warning', bgColor: 'bg-warning/10', textColor: 'text-warning', borderColor: 'border-warning' },
        { value: 4, label: 'معذور', icon: '📝', color: 'info', bgColor: 'bg-info/10', textColor: 'text-info', borderColor: 'border-info' },
    ]

    const handleStatusClick = (value) => {
        onStatusChange(student.id, value)
    }

    const handleNotesChange = (e) => {
        onNotesChange(student.id, e.target.value)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`card hover:shadow-lg transition-all ${status ? statusOptions.find(s => s.value === status)?.borderColor + ' border-r-4' : ''
                }`}
        >
            {/* Student Info */}
            <div className="flex items-center gap-3 mb-4">
                <Avatar
                    name={student.fullName}
                    size="md"
                />
                <div className="flex-1">
                    <h3 className="font-bold text-text-primary">{student.fullName}</h3>
                    {student.phoneNumber && (
                        <p className="text-sm text-text-muted">{student.phoneNumber}</p>
                    )}
                </div>
            </div>

            {/* Status Buttons */}
            <div className="grid grid-cols-2 gap-2 mb-3">
                {statusOptions.map((option) => {
                    const isActive = status === option.value
                    return (
                        <motion.button
                            key={option.value}
                            whileTap={!disabled ? { scale: 0.95 } : {}}
                            onClick={() => !disabled && handleStatusClick(option.value)}
                            disabled={disabled}
                            className={`
                                p-3 rounded-lg font-semibold transition-all
                                ${isActive
                                    ? `${option.bgColor} ${option.textColor} border-2 ${option.borderColor} shadow-md`
                                    : 'bg-background hover:bg-background/80 text-text-muted border-2 border-transparent'
                                }
                                ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                            `}
                        >
                            <span className="text-lg mr-1">{option.icon}</span>
                            {option.label}
                        </motion.button>
                    )
                })}
            </div>

            {/* Notes Toggle */}
            <button
                onClick={() => setShowNotes(!showNotes)}
                disabled={disabled}
                className={`w-full flex items-center justify-center gap-2 text-sm text-text-muted hover:text-primary transition-colors mb-2 ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
                <StickyNote className="w-4 h-4" />
                {showNotes ? 'إخفاء الملاحظات' : 'إضافة ملاحظات'}
            </button>

            {/* Notes Textarea */}
            {showNotes && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                >
                    <textarea
                        value={notes || ''}
                        onChange={handleNotesChange}
                        disabled={disabled}
                        placeholder="ملاحظات اختيارية..."
                        className={`input w-full min-h-[80px] resize-none ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
                        rows={3}
                    />
                </motion.div>
            )}
        </motion.div>
    )
}

export default StudentAttendanceCard
