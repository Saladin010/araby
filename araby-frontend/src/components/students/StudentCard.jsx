import { motion } from 'framer-motion'
import { Phone, User, GraduationCap, MoreVertical } from 'lucide-react'
import { formatDate } from '../../utils/dateUtils'

/**
 * StudentCard Component - Mobile card view
 */
const StudentCard = ({ student, onView, onEdit, onDelete, onToggleStatus, onShowPassword, index = 0 }) => {
    const getInitials = (name) => {
        return name
            .split(' ')
            .slice(0, 2)
            .map((n) => n[0])
            .join('')
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="card"
        >
            {/* Avatar and Name */}
            <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg flex-shrink-0">
                    {getInitials(student.fullName)}
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-text-primary mb-1 truncate">{student.fullName}</h3>
                    <p className="text-sm text-text-muted">@{student.userName}</p>
                    <div className="flex gap-2 mt-2">
                        {student.role === 1 ? (
                            <span className="badge badge-primary">طالب</span>
                        ) : student.role === 2 ? (
                            <span className="badge badge-warning">مساعد</span>
                        ) : (
                            <span className="badge badge-secondary">غير محدد</span>
                        )}
                        {student.isActive ? (
                            <span className="badge badge-success">نشط</span>
                        ) : (
                            <span className="badge badge-error">غير نشط</span>
                        )}
                    </div>
                </div>

                <button
                    onClick={() => onView(student)}
                    className="p-2 hover:bg-background rounded-lg transition-colors"
                >
                    <MoreVertical className="w-5 h-5" />
                </button>
            </div>

            {/* Info */}
            <div className="space-y-2 text-sm">
                {student.phoneNumber && (
                    <div className="flex items-center gap-2 text-text-muted">
                        <Phone className="w-4 h-4" />
                        <span>{student.phoneNumber}</span>
                    </div>
                )}

                {student.academicLevel && (
                    <div className="flex items-center gap-2 text-text-muted">
                        <GraduationCap className="w-4 h-4" />
                        <span>{student.academicLevel}</span>
                    </div>
                )}

                <div className="flex items-center gap-2 text-text-muted">
                    <User className="w-4 h-4" />
                    <span>انضم في {formatDate(student.createdAt)}</span>
                </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-border">
                <button
                    onClick={() => onEdit(student)}
                    className="btn btn-outline btn-sm"
                >
                    تعديل
                </button>
                <button
                    onClick={() => onView(student)}
                    className="btn btn-primary btn-sm"
                >
                    عرض التفاصيل
                </button>
            </div>
        </motion.div>
    )
}

export default StudentCard
