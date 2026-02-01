import { Clock, MapPin, Users, Edit, Trash2, Eye, UserCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'

/**
 * SessionCard Component
 * Displays session information in a card format
 */
const SessionCard = ({
    session,
    onView,
    onEdit,
    onDelete,
    onTakeAttendance,
    index = 0
}) => {
    if (!session) return null

    const startTime = new Date(session.startTime)
    const endTime = new Date(session.endTime)
    const isToday = format(startTime, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
    const isPast = startTime < new Date()

    // Calculate duration in minutes
    const durationMinutes = Math.round((endTime - startTime) / (1000 * 60))
    const hours = Math.floor(durationMinutes / 60)
    const minutes = durationMinutes % 60
    const durationText = hours > 0
        ? `${hours} ساعة${minutes > 0 ? ` و ${minutes} دقيقة` : ''}`
        : `${minutes} دقيقة`

    // Session type badge
    const typeBadge = session.type === 1 || session.type === 'Private' ? (
        <span className="badge badge-primary">فردي</span>
    ) : (
        <span className="badge badge-success">جماعي</span>
    )

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`card hover:shadow-lg transition-all ${isToday ? 'border-r-4 border-r-primary' : ''
                } ${isPast ? 'opacity-70' : ''}`}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-text-primary">
                            {session.title}
                        </h3>
                        {typeBadge}
                        {isToday && (
                            <span className="badge badge-warning">اليوم</span>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                    {console.log('Session:', session.title, 'isPast:', isPast, 'startTime:', startTime)}
                    <button
                        onClick={() => onView(session)}
                        className="p-2 rounded-lg bg-background hover:bg-primary hover:text-white transition-colors"
                        title="عرض التفاصيل"
                    >
                        <Eye className="w-5 h-5" />
                    </button>
                    {/* Temporarily showing for all sessions to debug */}
                    <button
                        onClick={() => onEdit(session)}
                        className="p-2 rounded-lg bg-background hover:bg-info hover:text-white transition-colors text-info"
                        title="تعديل"
                    >
                        <Edit className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => onDelete(session)}
                        className="p-2 rounded-lg bg-background hover:bg-error hover:text-white transition-colors text-error"
                        title="حذف"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Body */}
            <div className="space-y-3">
                {/* Time */}
                <div className="flex items-center gap-2 text-text-muted">
                    <Clock className="w-4 h-4" />
                    <span>
                        {format(startTime, 'h:mm a', { locale: ar })} - {format(endTime, 'h:mm a', { locale: ar })}
                        <span className="text-xs mr-2">({durationText})</span>
                    </span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-text-muted">
                    <MapPin className="w-4 h-4" />
                    <span>{session.location}</span>
                    {session.locationUrl && (
                        <a
                            href={session.locationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline text-sm"
                        >
                            (رابط)
                        </a>
                    )}
                </div>

                {/* Students */}
                {session.type === 2 || session.type === 'Group' ? (
                    <div className="flex items-center gap-2 text-text-muted">
                        <Users className="w-4 h-4" />
                        <span>
                            {session.studentsCount || 0} / {session.maxStudents || 0} طالب
                        </span>
                    </div>
                ) : (
                    session.studentName && (
                        <div className="flex items-center gap-2 text-text-muted">
                            <Users className="w-4 h-4" />
                            <span>{session.studentName}</span>
                        </div>
                    )
                )}
            </div>

            {/* Footer */}
            {isToday && onTakeAttendance && (
                <div className="mt-4 pt-4 border-t border-border">
                    <button
                        onClick={() => onTakeAttendance(session)}
                        className="btn btn-sm btn-primary w-full"
                    >
                        <UserCheck className="w-4 h-4" />
                        تسجيل الحضور
                    </button>
                </div>
            )}
        </motion.div>
    )
}

export default SessionCard
