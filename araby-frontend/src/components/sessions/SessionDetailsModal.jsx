import { X, Clock, MapPin, Users, Calendar, Link as LinkIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'

/**
 * SessionDetailsModal Component
 * Displays detailed information about a session
 */
const SessionDetailsModal = ({ isOpen, onClose, session, onEdit, onDelete }) => {
    if (!session) return null

    const startTime = new Date(session.startTime)
    const endTime = new Date(session.endTime)

    // Calculate duration
    const durationMinutes = Math.round((endTime - startTime) / (1000 * 60))
    const hours = Math.floor(durationMinutes / 60)
    const minutes = durationMinutes % 60
    const durationText = hours > 0
        ? `${hours} ساعة${minutes > 0 ? ` و ${minutes} دقيقة` : ''}`
        : `${minutes} دقيقة`

    const isPrivate = session.type === 1 || session.type === 'Private'
    const isPast = startTime < new Date()

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
                            className="bg-surface rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-text-primary mb-2">
                                        {session.title}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <span className={`badge ${isPrivate ? 'badge-primary' : 'badge-success'}`}>
                                            {isPrivate ? 'فردي' : 'جماعي'}
                                        </span>
                                        {isPast && (
                                            <span className="badge badge-secondary">منتهية</span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-background rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Session Info */}
                            <div className="space-y-4 mb-6">
                                {/* Date & Time */}
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-primary mt-1" />
                                    <div>
                                        <p className="font-semibold text-text-primary">التاريخ والوقت</p>
                                        <p className="text-text-muted">
                                            {format(startTime, 'EEEE، d MMMM yyyy', { locale: ar })}
                                        </p>
                                        <p className="text-text-muted">
                                            {format(startTime, 'h:mm a', { locale: ar })} - {format(endTime, 'h:mm a', { locale: ar })}
                                            <span className="text-xs mr-2">({durationText})</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-primary mt-1" />
                                    <div>
                                        <p className="font-semibold text-text-primary">المكان</p>
                                        <p className="text-text-muted">{session.location}</p>
                                        {session.locationUrl && (
                                            <a
                                                href={session.locationUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:underline text-sm flex items-center gap-1 mt-1"
                                            >
                                                <LinkIcon className="w-4 h-4" />
                                                رابط الحصة
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Students */}
                                <div className="flex items-start gap-3">
                                    <Users className="w-5 h-5 text-primary mt-1" />
                                    <div className="flex-1">
                                        <p className="font-semibold text-text-primary mb-2">الطلاب</p>
                                        {isPrivate ? (
                                            <p className="text-text-muted">
                                                {session.studentName || 'لم يتم تحديد طالب'}
                                            </p>
                                        ) : (
                                            <div>
                                                <p className="text-text-muted mb-2">
                                                    {session.studentsCount || 0} / {session.maxStudents || 0} طالب
                                                </p>
                                                {session.students && session.students.length > 0 && (
                                                    <div className="bg-background rounded-lg p-3 max-h-40 overflow-y-auto">
                                                        <ul className="space-y-1">
                                                            {session.students.map((student, index) => (
                                                                <li key={index} className="text-sm text-text-muted">
                                                                    • {student.fullName || student.name}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Created Date */}
                                {session.createdAt && (
                                    <div className="flex items-start gap-3">
                                        <Clock className="w-5 h-5 text-primary mt-1" />
                                        <div>
                                            <p className="font-semibold text-text-primary">تاريخ الإنشاء</p>
                                            <p className="text-text-muted text-sm">
                                                {format(new Date(session.createdAt), 'd MMMM yyyy، h:mm a', { locale: ar })}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            {!isPast && (
                                <div className="flex gap-3 pt-4 border-t border-border">
                                    <button
                                        onClick={() => {
                                            onClose()
                                            onEdit(session)
                                        }}
                                        className="btn btn-primary flex-1"
                                    >
                                        تعديل الحصة
                                    </button>
                                    <button
                                        onClick={() => {
                                            onClose()
                                            onDelete(session)
                                        }}
                                        className="btn btn-error flex-1"
                                    >
                                        حذف الحصة
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    )
}

export default SessionDetailsModal
